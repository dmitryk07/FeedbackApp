var _pickers = [];


function getPicker(key) {
    for (var i in _pickers) {
        var picker = _pickers[i];

        if (picker.key == key) {
            return picker;
        }
    }
}

function clearRoleAssignments(roleAssignments) {
    var roleAssignmentsArray = [];

    var roleAssignmentsEnumerator = roleAssignments.getEnumerator();
    while (roleAssignmentsEnumerator.moveNext()) {
        roleAssignmentsArray.push(roleAssignmentsEnumerator.get_current());
    }

    for (var i = roleAssignmentsArray.length - 1; i > -1; i--) {
        roleAssignmentsArray[i].deleteObject();
    }
}

function setWebPermissions(spContext, spWeb, callback) {
    var webPermissions = resources.get_webPermissions();
    if (webPermissions.length > 0) {
        if (!spWeb.get_hasUniqueRoleAssignments()) {
            spWeb.breakRoleInheritance(false, true);
        }

        spContext.load(spWeb, "RoleAssignments");
        spContext.executeQueryAsync(
            Function.createDelegate(this, function () {
                var roleAssignments = spWeb.get_roleAssignments();
                clearRoleAssignments(roleAssignments);

                for (var i in webPermissions) {
                    var webPermission = webPermissions[i];

                    var role = SP.RoleDefinitionBindingCollection.newObject(spContext);
                    role.add(spWeb.get_roleDefinitions().getByType(webPermission.roleType));

                    var picker = getPicker(webPermission.key);
                    for (var j in picker.spPrincipals) {
                        roleAssignments.add(picker.spPrincipals[j], role);
                    }
                }

                spContext.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        if (typeof (callback) == "function") {
                            callback();
                        }
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        showError(spContext, args);
                    })
                );
            }),
            Function.createDelegate(this, function (sender, args) {
                showError(spContext, args);
            })
        );
    }
    else {
        if (typeof (callback) == "function") {
            callback();
        }
    }
}

function setListsPermissions(spContext, spWeb, spLists, callback) {
    var listsPermissions = resources.get_listsPermissions();
    var listsData = [];

    var enumerator = spLists.getEnumerator();
    while (enumerator.moveNext()) {
        var spList = enumerator.get_current();

        for (var i in listsPermissions) {
            var listPermissions = listsPermissions[i];

            if (spList.get_defaultViewUrl().toUpperCase().indexOf(listPermissions.url.toUpperCase()) == -1) {
                continue;
            }

            if (!spList.get_hasUniqueRoleAssignments()) {
                spList.breakRoleInheritance(false, true);
            }

            spContext.load(spList, "RoleAssignments");

            listsData.push({ spList: spList, permissions: listPermissions.permissions });
        }
    }


    if (listsData.length > 0) {
        spContext.executeQueryAsync(
            Function.createDelegate(this, function () {
                for (var i in listsData) {
                    var listData = listsData[i];

                    var roleAssignments = listData.spList.get_roleAssignments();
                    clearRoleAssignments(roleAssignments);

                    for (var j in listData.permissions) {
                        var permission = listData.permissions[j];

                        var role = SP.RoleDefinitionBindingCollection.newObject(spContext);
                        role.add(spWeb.get_roleDefinitions().getByType(permission.roleType));

                        var picker = getPicker(permission.key);
                        for (var k in picker.spPrincipals) {
                            roleAssignments.add(picker.spPrincipals[k], role);
                        }
                    }
                }

                spContext.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        if (typeof (callback) == "function") {
                            callback();
                        }
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        showError(spContext, args);
                    })
                );
            }),
            Function.createDelegate(this, function (sender, args) {
                showError(spContext, args);
            })
        );
    }
    else {
        if (typeof (callback) == "function") {
            callback();
        }
    }
}

function validatePickers() {
    var validationResult = true;

    for (var i in _pickers) {
        var picker = _pickers[i].control;

        picker.AddUnresolvedUserFromEditor(true);
        picker.Validate();
    }

    for (var i in _pickers) {
        var picker = _pickers[i].control;

        if (picker.HasInputError) {
            validationResult = false;
            continue;
        }

        var entities = picker.GetAllUserInfo();
        for (var j in entities) {
            if (!entities[j].IsResolved) {
                validationResult = false;
            }
        }
    }

    return validationResult;
}

function showError(spContext, args) {
    SP.UI.Status.removeAllStatus(true);

    var statusId = SP.UI.Status.addStatus(args.get_message());
    SP.UI.Status.setStatusPriColor(statusId, "red");

    SP.Utilities.Utility.logCustomAppError(spContext, args.get_message());
    spContext.executeQueryAsync(Function.createDelegate(this, function () { }), Function.createDelegate(this, function (sender, args) { }));
}

function onPreScriptsLoaded(inputSections) {
    document.title = resources.get_pageTitle();
    $("#DeltaPlaceHolderPageTitleInTitleArea").html(resources.get_pageTitle());

    for (var i in inputSections) {
        var inputSection = inputSections[i];

        var pickerSections = resources.get_pickerSections();
        for (var j in pickerSections) {
            var pickerSection = pickerSections[j];

            if (inputSection.key == pickerSection.key) {
                $("#" + inputSection.headerDivId).html(pickerSection.header);
                $("#" + inputSection.descriptionDivId).html(pickerSection.description);
            }
        }
    }

    var $okButton = $(".okButton:first");
    $okButton.val(resources.get_okButtonText());
    $okButton.click(function () {
        okButton_Click(this);

        return false;
    });

    var $cancelButton = $(".cancelButton:first");
    $cancelButton.val(resources.get_cancelButtonText());
    $cancelButton.click(function () {
        cancelButton_Click(this);

        return false;
    });
}

function onPostScriptsLoaded(inputSections) {
    var spContext = SP.ClientContext.get_current();

    var spWeb = spContext.get_web();
    spContext.load(spWeb, "AllProperties");

    var spProperties = spWeb.get_allProperties();
    spContext.load(spProperties);

    spContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            var pickerSchema = {};
            pickerSchema["SearchPrincipalSource"] = 15;
            pickerSchema["ResolvePrincipalSource"] = 15;
            pickerSchema["AllowMultipleValues"] = true;
            pickerSchema["Rows"] = 3;
            pickerSchema["PrincipalAccountType"] = "User,SPGroup";
            pickerSchema["Required"] = true;

            for (var i in inputSections) {
                var inputSection = inputSections[i];

                SPClientPeoplePicker_InitStandaloneControlWrapper(inputSection.pickerDivId, null, pickerSchema);

                var control = SPClientPeoplePicker.SPClientPeoplePickerDict[inputSection.pickerDivId + "_TopSpan"];
                _pickers.push({
                    key: inputSection.key,
                    control: control
                });

                var entitiesStr = spProperties.get_fieldValues()[inputSection.key];
                if (typeof (entitiesStr) != "undefined") {
                    control.AddUserKeys(entitiesStr);
                }
            }

            $(".okButton:first").removeAttr("disabled");
        }),
        Function.createDelegate(this, function (sender, args) {
            showError(spContext, args);
        })
    );
}

function okButton_Click(okButton) {
    $(okButton).attr("disabled", "disabled");
    var validationResult = validatePickers();

    if (!validationResult) {
        $(okButton).removeAttr("disabled");

        return;
    }

    var spContext = SP.ClientContext.get_current();

    var spWeb = spContext.get_web();
    spContext.load(spWeb, "HasUniqueRoleAssignments", "SiteGroups");

    var spLists = spWeb.get_lists();
    spContext.load(spLists, "Include(DefaultViewUrl, HasUniqueRoleAssignments)");

    spContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            for (var i in _pickers) {
                var picker = _pickers[i];
                var entities = picker.control.GetAllUserInfo();

                picker.spPrincipals = [];
                for (var j in entities) {
                    var entity = entities[j];

                    if (typeof (entity.EntityData.SPGroupID) == "undefined") {
                        picker.spPrincipals.push(spWeb.ensureUser(entity.Key));
                    }
                    else {
                        picker.spPrincipals.push(spWeb.get_siteGroups().getById(entity.EntityData.SPGroupID));
                    }
                }
            }

            setWebPermissions(spContext, spWeb, function () {
                setListsPermissions(spContext, spWeb, spLists, function () {
                    var spWebProperties = spWeb.get_allProperties();
                    spWebProperties.set_item("PermissionsConfigured", "TRUE");

                    for (var i in _pickers) {
                        var picker = _pickers[i];

                        spWebProperties.set_item(picker.key, picker.control.GetAllUserKeys());
                    }
                    spWeb.update();

                    spContext.executeQueryAsync(
                        Function.createDelegate(this, function () {
                            document.location.href = "Home.aspx";
                        }),
                        Function.createDelegate(this, function (sender, args) {
                            showError(spContext, args);
                        })
                    );
                });
            });
        }),
        Function.createDelegate(this, function (sender, args) {
            showError(spContext, args);
        })
    );
}

function cancelButton_Click(cancelButton) {
    document.location.href = "Home.aspx";
}
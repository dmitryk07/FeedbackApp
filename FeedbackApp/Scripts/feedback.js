function getQueryStringParam(paramName) {
    var query = document.URL.split('?')[1];

    if (typeof (query) != "undefined") {
        query = query.split("&");

        for (var i = 0; i < query.length; i++) {
            var param = query[i].split("=");

            if (param[0].toUpperCase() == paramName.toUpperCase() && param.length > 1) {
                return param[1];
            }
        }
    }

    return "";
}

function loadDefaultStyles(callback) {
    var webUrl = "";
    var webUrlPosition = document.URL.toUpperCase().indexOf("/FEEDBACKAPP/PAGES/FEEDBACK.ASPX");

    if (webUrlPosition > -1) {
        webUrl = document.URL.substring(0, webUrlPosition);
    }

    var ctagParameter = "";
    var ctagValue = decodeURIComponent(getQueryStringParam("SPClientTag"));

    if (ctagValue.length > 0) {
        ctagParameter = "ctag=" + ctagValue;
    }
    else {
        ctagParameter = "ctag=0";
    }

    var $link = $("<link rel='stylesheet' />");
    $link.attr("href", webUrl + "/_layouts/15/defaultcss.ashx?" + ctagParameter);

    if (typeof (callback) == "function") {
        $link.on("load", function () {
            callback();
        });
    }

    $(document.head).append($link);
}

function getList(spLists, listUrl) {
    var listsEnumerator = spLists.getEnumerator();
    while (listsEnumerator.moveNext()) {
        var spList = listsEnumerator.get_current();
        if (spList.get_defaultViewUrl().toUpperCase().indexOf(listUrl.toUpperCase()) != -1) {
            return spList;
        }
    }

    return null;
}

function showErrorMessage(spContext, message) {
    $("#inputFormDiv").hide();

    $("#errorMessageTextDiv").html(message);
    $("#errorMessageDiv").show();

    SP.Utilities.Utility.logCustomAppError(spContext, message);
    spContext.executeQueryAsync(Function.createDelegate(this, function () { }), Function.createDelegate(this, function (sender, args) { }));
}

function onPreScriptsLoaded() {
    loadDefaultStyles(function () {
        $("#formDiv").show();
    });

    document.title = resources.get_pageTitle();

    $("#categoryHeaderDiv").html(resources.get_categoryHeaderTitle() + "<span class='ms-accentText' title='" + resources.get_requiredFieldTitle() + "'> *</span>");
    $("#messageHeaderDiv").html(resources.get_messageHeaderTitle() + "<span class='ms-accentText' title='" + resources.get_requiredFieldTitle() + "'> *</span>");

    var $loadingOption = $("<option />");
    $loadingOption.html(resources.get_loadingOptionTitle());

    var $categoriesSelect = $("#categoriesSelect");
    $categoriesSelect.attr("title", resources.get_categorySelectTitle());
    $categoriesSelect.append($loadingOption);

    $("#messageTextArea").attr("title", resources.get_messageTextAreaTitle());

    var $sendButton = $("#sendButton");
    $sendButton.val(resources.get_sendButtonText());

    $("#completionMessageHeaderH1").html(resources.get_completionMessageHeaderTitle());
    $("#completionMessageTextDiv").html(resources.get_completionMessageText());

    $("#errorMessageHeaderH1").html(resources.get_errorMessageHeaderTitle());
    $("#reloadLink").html(resources.get_reloadLinkTitle());
}

function onPostScriptsLoaded() {
    var spContext = SP.ClientContext.get_current();

    var spLists = spContext.get_web().get_lists();
    spContext.load(spLists, "Include(DefaultViewUrl)");

    spContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            var categoriesList = getList(spLists, "/LISTS/CATEGORIES/");
            if (categoriesList == null) {
                showErrorMessage(spContext, resources.get_noCategoriesListErrorText());

                return;
            }

            var queryXml = "<View>" +
                               "<Query>" +
                                   "<OrderBy>" +
                                       "<FieldRef Name='Title' />" +
                                   "</OrderBy>" +
                               "</Query>" +
                               "<ViewFields>" +
                                   "<FieldRef Name='ID' />" +
                                   "<FieldRef Name='Title' />" +
                               "</ViewFields>" +
                               "<RowLimit>5000</RowLimit>" +
                           "</View>";

            var query = new SP.CamlQuery();
            query.set_viewXml(queryXml);

            var categoriesItems = categoriesList.getItems(query);
            spContext.load(categoriesItems);

            spContext.executeQueryAsync(
            Function.createDelegate(this, function () {
                if (categoriesItems.get_count() > 0) {
                    var $categoriesSelect = $("#categoriesSelect");
                    $categoriesSelect.html("");

                    var enumerator = categoriesItems.getEnumerator();
                    while (enumerator.moveNext()) {
                        var categoryItem = enumerator.get_current();

                        var categoryTitle = categoryItem.get_item("Title");
                        if (categoryTitle == null) {
                            categoryTitle = resources.get_noTitleOptionTitle();
                        }

                        var $option = $("<option />");
                        $option.val(categoryItem.get_item("ID"));
                        $option.html(categoryTitle);

                        $categoriesSelect.append($option);
                    }

                    $categoriesSelect.removeAttr("disabled");
                    $("#messageTextArea").removeAttr("disabled");
                    $("#sendButton").removeAttr("disabled");
                }
                else {
                    showErrorMessage(spContext, resources.get_noCategoriesListItemsErrorText());
                }
            }),
            Function.createDelegate(this, function (sender, args) {
                showErrorMessage(spContext, args.get_message());
            }));
        }),
        Function.createDelegate(this, function (sender, args) {
            showErrorMessage(spContext, args.get_message());
        }));
}

function sendButton_Click(sendButton) {
    $(sendButton).attr("disabled", "disabled");

    var $categoriesSelect = $("#categoriesSelect");
    if ($categoriesSelect.val() == null || $categoriesSelect.val().length == 0) {
        $categoriesSelect.focus();
        $(sendButton).removeAttr("disabled");

        return;
    }

    var $messageTextArea = $("#messageTextArea");
    if ($messageTextArea.val() == null || $messageTextArea.val().length == 0) {
        $messageTextArea.focus();
        $(sendButton).removeAttr("disabled");

        return;
    }

    var spContext = SP.ClientContext.get_current();

    var spLists = spContext.get_web().get_lists();
    spContext.load(spLists, "Include(DefaultViewUrl)");

    spContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            var messagesBufferList = getList(spLists, "/LISTS/MESSAGESBUFFER/");
            if (messagesBufferList == null) {
                showErrorMessage(spContext, resources.get_noMessagesBufferListErrorText());

                return;
            }

            var listItemInformation = new SP.ListItemCreationInformation();
            var listItem = messagesBufferList.addItem(listItemInformation);

            var categoryIdValue = new SP.FieldLookupValue();
            categoryIdValue.set_lookupId($categoriesSelect.val());

            listItem.set_item("MessagesBufferItemCategory", categoryIdValue);
            listItem.set_item("MessagesBufferItemText", $messageTextArea.val());
            listItem.update();

            spContext.load(listItem);
            spContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var sourceParam = getQueryStringParam("Source");
                    if (sourceParam.length > 0) {
                        window.top.location.href = decodeURIComponent(sourceParam);
                    }
                    else {
                        $("#inputFormDiv").hide();
                        $("#completionMessageDiv").show();
                    }
                }),
                Function.createDelegate(this, function (sender, args) {
                    showErrorMessage(spContext, args.get_message());
                })
            );
        }),
        Function.createDelegate(this, function (sender, args) {
            showErrorMessage(spContext, args.get_message());
        })
    );
}

function reloadLink_Click(reloadLink) {
    document.location.reload();
}
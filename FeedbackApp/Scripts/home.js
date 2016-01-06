function showTileCalloutIcon(tileId) {
    $("#" + tileId).find(".ms-calloutLink:first").find(".ms-ellipsis-icon:first").css("visibility", "visible");
}

function hideTileCalloutIcon(tileId) {
    $("#" + tileId).find(".ms-calloutLink:first").find(".ms-ellipsis-icon:first").css("visibility", "hidden");
}

function addPagesLayout(formTable, webPermissions) {
    var pages = resources.get_pages();
    var pagesRowHtml = "";

    for (var i in pages) {
        var page = pages[i];

        var hasPermissions = true;
        if (typeof (page.permissionKinds) != "undefined") {
            for (var j in page.permissionKinds) {
                if (!webPermissions.has(page.permissionKinds[j])) {
                    hasPermissions = false;

                    break;
                }
            }
        }

        if (hasPermissions) {
            var $link = $("<a class='ms-heroCommandLink'>" + page.title + "</a>");

            if (typeof (page.onclick) != "undefined") {
                $link.attr("href", "javascript:;");
                $link.attr("onclick", page.onclick);
            }
            else {
                $link.attr("href", page.href);
            }

            if (i > 0) {
                pagesRowHtml += "<div class='itemSeparator'></div>";
            }

            pagesRowHtml += "<div>" +
                                "<span class='ms-textXLarge'>" +
                                    $link[0].outerHTML +
                                "</span>";

            if (typeof (page.description) != "undefined") {
                pagesRowHtml += "<div class='ms-metadata'>" + page.description + "</div>";
            }

            pagesRowHtml += "</div>";
        }
    }

    if (pagesRowHtml.length > 0) {
        $(formTable).append("<tr>" +
                                "<td colspan='2'>" +
                                    "<h2 class='ms-webpart-titleText'>" +
                                        resources.get_pagesHeaderTitle() +
                                    "</h2>" +
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td colspan='2'>" +
                                    "<hr />" +
                                "</td>" +
                            "</tr>");

        $(formTable).append("<tr><td colspan='2'>" + pagesRowHtml + "</td></tr>");
    }
}

function addListsLayout(formTable, spLists, webUrl, recycleBinItemsCount) {
    var lists = resources.get_lists();
    var callouts = [];
    var listsRowHtml = "";

    for (var i in lists) {
        var list = lists[i];

        var enumerator = spLists.getEnumerator();
        while (enumerator.moveNext()) {
            var spList = enumerator.get_current();

            if (spList.get_defaultViewUrl().toUpperCase().indexOf(list.url.toUpperCase()) == -1) {
                continue;
            }

            var hasPermissions = true;
            if (typeof (list.permissionKinds) != "undefined") {
                for (var j in list.permissionKinds) {
                    if (!spList.get_effectiveBasePermissions().has(list.permissionKinds[j])) {
                        hasPermissions = false;

                        break;
                    }
                }
            }

            if (!hasPermissions) {
                break;
            }

            callouts.push({
                listId: spList.get_id(),
                listTitle: spList.get_title(),
                listDescription: spList.get_description(),
                showSettings: list.showSettings && spList.get_effectiveBasePermissions().has(SP.PermissionKind.manageLists)
            });

            var $listImage = $("<img class='ms-storefront-appiconimg' />");
            $listImage.attr("src", list.iconSrc);
            $listImage.attr("alt", spList.get_title());

            var $listImageLink = $("<a tabindex='-1' class='ms-storefront-selectanchor ms-storefront-appiconspan'>" +
                                       $listImage[0].outerHTML +
                                   "</a>");
            $listImageLink.attr("href", spList.get_defaultViewUrl());

            var $listLink = $("<a class='ms-vl-apptitle ms-listLink'>" + spList.get_title() + "</a>");
            $listLink.attr("title", spList.get_title());
            $listLink.attr("href", spList.get_defaultViewUrl());

            var $calloutImage = $("<img class='ms-ellipsis-icon' style='visibility: hidden;' src='/_layouts/15/images/spcommon.png?rev=33' />");
            $calloutImage.attr("alt", resources.get_calloutIconAlt());

            var $calloutImageLink = $("<a id='callout_" + spList.get_id() + "' class='ms-vl-calloutarrow ms-calloutLink ms-ellipsis-a ms-pivotControl-overflowDot js-callout-launchPoint'" +
                                        " onfocus='showTileCalloutIcon(\"list_" + spList.get_id() + "\");'" +
                                        " onblur='hideTileCalloutIcon(\"list_" + spList.get_id() + "\");'" +
                                        " href='javascript:;'>" +
                                          $calloutImage[0].outerHTML +
                                      "</a>");
            $calloutImageLink.attr("title", resources.get_calloutLinkTitle());

            listsRowHtml += "<div id='list_" + spList.get_id() + "' class='ms-vl-apptile ms-vl-apptilehover'" +
                                " onmouseover='showTileCalloutIcon(\"list_" + spList.get_id() + "\");' onmouseout='hideTileCalloutIcon(\"list_" + spList.get_id() + "\");'>" +
                                "<div class='ms-vl-appimage'>" +
                                    $listImageLink[0].outerHTML +
                                "</div>" +
                                "<div class='ms-vl-appinfo ms-vl-pointer'>" +
                                    "<div>" +
                                        "<div class='ms-vl-apptitleouter'>" +
                                            $listLink[0].outerHTML +
                                        "</div>" +
                                        $calloutImageLink[0].outerHTML +
                                    "</div>" +
                                    "<div class='ms-metadata ms-vl-appstatus'>" + resources.getListItemsCountText(spList.get_itemCount()) + "</div>" +
                                "</div>" +
                             "</div>";
        }
    }

    if (listsRowHtml.length > 0) {
        var $link = $("<a class='ms-calloutLink ms-vl-settingsmarginleft ms-vl-alignactionsmiddle' onclick='return STSNavigate(this.href);'>" +
                          "<span style='width: 16px; height: 16px; overflow: hidden; display: inline-block; position: relative'>" +
                              "<img style='border-width: 0px; left: -196px !important; top: -155px !important; position: absolute' src='/_layouts/15/images/spcommon.png?rev=33' />" +
                          "</span>" +
                          "&nbsp;" +
                          "<span class='ms-splinkbutton-text'>" + resources.get_recycleBinLinkText() + " (" + recycleBinItemsCount + ")</span>" +
                      "</a>");
        $link.attr("href", webUrl + "/_layouts/RecycleBin.aspx");

        if ($(formTable).children("tbody").children("tr").length > 0) {
            $(formTable).append("<tr><td colspan='2'><div class='sectionSeparator'></div</td></tr>");
        }

        $(formTable).append("<tr>" +
                                "<td>" +
                                    "<h2 class='ms-webpart-titleText'>" +
                                        resources.get_listsHeaderTitle() +
                                    "</h2>" +
                                "</td>" +
                                "<td class='ms-alignRight'>" +
                                    $link[0].outerHTML +
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td colspan='2'>" +
                                    "<hr />" +
                                "</td>" +
                            "</tr>");

        $(formTable).append("<tr><td colspan='2'>" + listsRowHtml + "</td></tr>");
    }

    for (var i in callouts) {
        addListCallout(formTable, callouts[i]);
    }
}

function addListCallout(formTable, callout) {
    var calloutSection = CalloutManager.createNew({
        ID: callout.listId,
        title: callout.listTitle,
        content: "<div class='ms-vl-calloutversion'><div class='ms-vl-calloutContent'><div></div><div class='ms-vl-appdescription'>" + callout.listDescription + "</div></div></div>",
        launchPoint: $(formTable).find("#callout_" + callout.listId)[0]
    });

    if (callout.showSettings) {
        var settingsAction = new CalloutAction({
            text: resources.get_settingsActionText(),
            tooltip: resources.get_settingsActionTooltip(),
            onClickCallback: function (e, action) {
                var webUrl = "";

                var webUrlPosition = document.URL.toUpperCase().indexOf("/PAGES/HOME.ASPX");
                if (webUrlPosition > -1) {
                    webUrl = document.URL.substring(0, webUrlPosition);
                }

                document.location.href = webUrl + "/_layouts/15/listedit.aspx?List=" + callout.listId.toString();
            }
        });

        calloutSection.addAction(settingsAction);
    }
}

function showAlerts(spWeb, spLists, spProperties) {
    if (spProperties.get_fieldValues()["PermissionsConfigured"] != "TRUE") {
        if (spWeb.get_effectiveBasePermissions().has(SP.PermissionKind.manageWeb)) {
            var statusId = SP.UI.Status.addStatus(resources.get_permissionsWarningText());
            SP.UI.Status.setStatusPriColor(statusId, "yellow");
        }
    }
    else {
        var enumerator = spLists.getEnumerator();
        while (enumerator.moveNext()) {
            var spList = enumerator.get_current();

            if (spList.get_defaultViewUrl().toUpperCase().indexOf("/LISTS/CATEGORIES/") != -1) {
                if (spList.get_itemCount() == 0) {
                    if (spList.get_effectiveBasePermissions().has(SP.PermissionKind.addListItems)) {
                        var statusId = SP.UI.Status.addStatus(resources.get_categoriesWarningText().replace("{0}", spList.get_defaultViewUrl()));
                        SP.UI.Status.setStatusPriColor(statusId, "yellow");
                    }
                }

                break;
            }
        }
    }
}

function onPreScriptsLoaded() {
    document.title = resources.get_pageTitle();
    $("#DeltaPlaceHolderPageTitleInTitleArea").html(resources.get_pageTitle());
}

function onPostScriptsLoaded() {
    var spContext = SP.ClientContext.get_current();

    var spWeb = spContext.get_web();
    spContext.load(spWeb, "Url", "RecycleBin", "AllProperties", "EffectiveBasePermissions");

    var spLists = spWeb.get_lists();
    spContext.load(spLists, "Include(Id, Title, Description, DefaultViewUrl, ItemCount, EffectiveBasePermissions)");

    var spProperties = spWeb.get_allProperties();
    spContext.load(spProperties);

    spContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            var formTable = $("#formTable")[0];

            addPagesLayout(formTable, spWeb.get_effectiveBasePermissions());

            addListsLayout(formTable, spLists, spWeb.get_url(), spWeb.get_recycleBin().get_count());

            showAlerts(spWeb, spLists, spProperties);
        }),
        Function.createDelegate(this, function (sender, args) {
            SP.UI.Status.removeAllStatus(true);

            var statusId = SP.UI.Status.addStatus(args.get_message());
            SP.UI.Status.setStatusPriColor(statusId, "red");

            SP.Utilities.Utility.logCustomAppError(spContext, args.get_message());
            spContext.executeQueryAsync(Function.createDelegate(this, function () { }), Function.createDelegate(this, function (sender, args) { }));
        })
    );
}
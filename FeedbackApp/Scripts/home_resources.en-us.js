var resources = {
    get_pageTitle: function () { return "Home"; },
    get_pagesHeaderTitle: function () { return "Pages"; },
    get_listsHeaderTitle: function () { return "Lists"; },

    get_recycleBinLinkText: function () { return "RECYCLE BIN"; },
    get_calloutLinkTitle: function () { return "Click for more information."; },
    get_calloutIconAlt: function () { return "Open Menu"; },
    get_settingsActionText: function () { return "SETTINGS"; },
    get_settingsActionTooltip: function () { return "Settings"; },

    get_permissionsWarningText: function () { return "App permissions are not set. <a href='Permissions.aspx'>(Manage permissions)</a>"; },
    get_categoriesWarningText: function () { return "Categories list is empty. <a href='{0}'>(Add new category)</a>"; },

    get_pages: function () {
        return [
            {
                title: "Feedback",
                description: "Use this page to send messages.",
                onclick: "SP.UI.ModalDialog.showModalDialog({ url: 'Feedback.aspx', width: 465, height: 430 });"
            },
            {
                title: "Manage permissions",
                description: "Use this page to manage app permissions.",
                href: "Permissions.aspx",
                permissionKinds: [SP.PermissionKind.manageWeb]
            }
        ];
    },

    get_lists: function () {
        return [
            { url: "/Lists/Categories/", iconSrc: "/_layouts/15/images/ltgen.png?rev=33", permissionKinds: [SP.PermissionKind.addListItems, SP.PermissionKind.editListItems, SP.PermissionKind.deleteListItems] },
            { url: "/Lists/Messages/", iconSrc: "/_layouts/15/images/ltgen.png?rev=33" },
            { url: "/Lists/MessagesBuffer/", iconSrc: "/_layouts/15/images/ltgen.png?rev=33", permissionKinds: [SP.PermissionKind.manageWeb] }
        ];
    },

    getListItemsCountText: function (itemsCount) {
        if (itemsCount == 1) {
            return "1 item";
        }
        else {
            return itemsCount + " items";
        }
    }
};
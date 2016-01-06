var resources = {
    get_pageTitle: function () { return "Manage permissions"; },

    get_pickerSections: function () {
        return [
            { key: "AppSenders", header: "Senders", description: "Senders have access to sending messages." },
            { key: "AppRecepients", header: "Recepients", description: "Recipients have access to reading messages." },
            { key: "AppContributors", header: "Contributors", description: "Contributors have edit access to the app content." },
            { key: "AppOwners", header: "Owners", description: "Owners have full access to the app content." }
        ];
    },

    get_webPermissions: function () {
        return [
            { key: "AppSenders", roleType: SP.RoleType.reader },
            { key: "AppRecepients", roleType: SP.RoleType.reader },
            { key: "AppContributors", roleType: SP.RoleType.contributor },
            { key: "AppOwners", roleType: SP.RoleType.administrator }
        ]
    },

    get_listsPermissions: function () {
        return [
            {
                url: "/Lists/Categories/",
                permissions: [
                    { key: "AppSenders", roleType: SP.RoleType.reader },
                    { key: "AppContributors", roleType: SP.RoleType.contributor },
                    { key: "AppOwners", roleType: SP.RoleType.administrator }
                ]
            },
            {
                url: "/Lists/Messages/",
                permissions: [
                    { key: "AppRecepients", roleType: SP.RoleType.reader },
                    { key: "AppContributors", roleType: SP.RoleType.contributor },
                    { key: "AppOwners", roleType: SP.RoleType.administrator }]
            },
            {
                url: "/Lists/MessagesBuffer/",
                permissions: [
                    { key: "AppSenders", roleType: SP.RoleType.contributor },
                    { key: "AppContributors", roleType: SP.RoleType.contributor },
                    { key: "AppOwners", roleType: SP.RoleType.administrator }]
            }
        ];
    },

    get_okButtonText: function () { return "OK"; },
    get_cancelButtonText: function () { return "Cancel"; }
};
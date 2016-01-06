<%@ Page Language="C#" Inherits="System.Web.UI.Page" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html lang="<%$Resources:wss,language_value%>" dir="<%$Resources:wss,multipages_direction_dir_value%>" runat="server">
<head runat="server">
    <meta name="GENERATOR" content="Microsoft SharePoint" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <meta http-equiv="Expires" content="0" />
    <meta name="msapplication-TileImage" content="/_layouts/15/images/SharePointMetroAppTile.png" />
    <meta name="msapplication-TileColor" content="#0072C6" />
    <SharePoint:SPShortcutIcon runat="server" IconUrl="/_layouts/15/images/favicon.ico?rev=23" />
    <link rel="Stylesheet" type="text/css" href="../Styles/feedback.css" />
    <SharePoint:ScriptLink Name="init.js" Localizable="false" OnDemand="true" runat="server" />
    <SharePoint:ScriptLink Name="sp.js" Localizable="false" OnDemand="true" runat="server" />
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/feedback.js"></script>
    <script type="text/javascript" src="../Scripts/feedback_resources.<SharePoint:EncodedLiteral runat='server' text='<% $Resources:wss,language_value %>' EncodeMethod='HtmlEncode' />.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            onPreScriptsLoaded();

            SP.SOD.executeFunc("sp.js", "SP.ClientContext", function () {
                onPostScriptsLoaded();
            });
        });
    </script>
</head>
<body>
    <form id="aspnetForm" runat="server">
        <asp:ScriptManager ID="ScriptManager" runat="server" EnablePageMethods="false" EnablePartialRendering="true" EnableScriptGlobalization="false" EnableScriptLocalization="true" />
        <WebPartPages:AllowFraming runat="server" />
        <div id="formDiv" style="display: none">
            <div id="inputFormDiv">
                <div id="categoryHeaderDiv"></div>
                <div id="categoryValueDiv">
                    <select id="categoriesSelect" class="ms-RadioText" disabled="disabled"></select>
                </div>
                <div id="messageHeaderDiv"></div>
                <div id="messageValueDiv">
                    <textarea id="messageTextArea" class="ms-long" rows="" cols="" disabled="disabled"></textarea>
                </div>
                <div id="buttonsDiv">
                    <input type="button" id="sendButton" onclick="sendButton_Click(this);" disabled="disabled" />
                </div>
            </div>
            <div id="completionMessageDiv" style="display: none">
                <h1 id="completionMessageHeaderH1"></h1>
                <div id="completionMessageTextDiv"></div>
            </div>
            <div id="errorMessageDiv" style="display: none">
                <h1 id="errorMessageHeaderH1"></h1>
                <div id="errorMessageTextDiv"></div>
                <hr class="sectionSeparator" />
                <div>
                    <a id="reloadLink" class="ms-calloutLink" href="javascript:;" onclick="reloadLink_Click(this);"></a>
                </div>
            </div>
        </div>
    </form>
</body>
</html>

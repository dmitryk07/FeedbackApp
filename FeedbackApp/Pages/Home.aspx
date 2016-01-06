<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <link rel="Stylesheet" type="text/css" href="../Styles/home.css" />
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/home.js"></script>
    <script type="text/javascript" src="../Scripts/home_resources.<SharePoint:EncodedLiteral runat='server' text='<% $Resources:wss,language_value %>' EncodeMethod='HtmlEncode' />.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            onPreScriptsLoaded();

            SP.SOD.executeFunc("sp.js", "SP.ClientContext", function () {
                SP.SOD.executeFunc("callout.js", "Callout", function () {
                    onPostScriptsLoaded();
                });
            });
        });
    </script>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <table id="formTable" cellspacing="0" cellpadding="0" style="width: 100%"></table>
</asp:Content>

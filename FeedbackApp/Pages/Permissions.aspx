<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" TagName="InputFormSection" Src="~/_controltemplates/15/InputFormSection.ascx" %>
<%@ Register TagPrefix="SharePoint" TagName="InputFormControl" Src="~/_controltemplates/15/InputFormControl.ascx" %>
<%@ Register TagPrefix="SharePoint" TagName="ButtonSection" Src="~/_controltemplates/15/ButtonSection.ascx" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <SharePoint:ScriptLink name="clienttemplates.js" Localizable="false" OnDemand="true" runat="server" />
    <SharePoint:ScriptLink name="clientforms.js" Localizable="false" OnDemand="true" runat="server" />
    <SharePoint:ScriptLink name="clientpeoplepicker.js" Localizable="false" OnDemand="true" runat="server" />
    <SharePoint:ScriptLink name="autofill.js" Localizable="false" OnDemand="true" runat="server" />
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/permissions.js"></script>
    <script type="text/javascript" src="../Scripts/permissions_resources.<SharePoint:EncodedLiteral runat='server' text='<% $Resources:wss,language_value %>' EncodeMethod='HtmlEncode' />.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            var inputSections = [
                { key: "AppSenders", headerDivId: "appSendersHeaderDiv", descriptionDivId: "appSendersDescriptionDiv", pickerDivId: "appSendersPickerDiv" },
                { key: "AppRecepients", headerDivId: "appRecepientsHeaderDiv", descriptionDivId: "appRecepientsDescriptionDiv", pickerDivId: "appRecepientsPickerDiv" },
                { key: "AppContributors", headerDivId: "appContributorsHeaderDiv", descriptionDivId: "appContributorsDescriptionDiv", pickerDivId: "appContributorsPickerDiv" },
                { key: "AppOwners", headerDivId: "appOwnersHeaderDiv", descriptionDivId: "appOwnersDescriptionDiv", pickerDivId: "appOwnersPickerDiv" }
            ];

            onPreScriptsLoaded(inputSections);

            SP.SOD.executeFunc("sp.js", "SP.ClientContext", function () {
                SP.SOD.executeFunc("clienttemplates.js", "SPClientTemplates", function () {
                    SP.SOD.executeFunc("clientforms.js", "SPClientPeoplePicker_InitStandaloneControlWrapper", function () {
                        SP.SOD.executeFunc("clientpeoplepicker.js", "SPClientPeoplePicker", function () {
                            onPostScriptsLoaded(inputSections);
                        });
                    });
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
    <table cellspacing="0" cellpadding="0">
        <SharePoint:InputFormSection runat="server">
            <template_title>
                <div id="appSendersHeaderDiv"></div>                
            </template_title>
            <template_description>
                <div id="appSendersDescriptionDiv"></div>
			</template_description>
            <template_inputformcontrols>
                <SharePoint:InputFormControl runat="server">
                    <Template_Control>
                        <div id="appSendersPickerDiv"></div>
                    </Template_Control>
                </SharePoint:InputFormControl>
            </template_inputformcontrols>
        </SharePoint:InputFormSection>
        <SharePoint:InputFormSection runat="server">
            <template_title>
                <div id="appRecepientsHeaderDiv"></div>
            </template_title>
            <template_description>
                <div id="appRecepientsDescriptionDiv"></div>
			</template_description>
            <template_inputformcontrols>
                <SharePoint:InputFormControl runat="server">
                    <Template_Control>
                        <div id="appRecepientsPickerDiv"></div>
					</Template_Control>
                </SharePoint:InputFormControl>
            </template_inputformcontrols>
        </SharePoint:InputFormSection>
        <SharePoint:InputFormSection runat="server">
            <template_title>
                <div id="appContributorsHeaderDiv"></div>
            </template_title>
            <template_description>
				<div id="appContributorsDescriptionDiv"></div>
			</template_description>
            <template_inputformcontrols>
                <SharePoint:InputFormControl runat="server">
                    <Template_Control>
                        <div id="appContributorsPickerDiv"></div>
					</Template_Control>
                </SharePoint:InputFormControl>
            </template_inputformcontrols>
        </SharePoint:InputFormSection>
        <SharePoint:InputFormSection runat="server">
            <template_title>
                <div id="appOwnersHeaderDiv"></div>
            </template_title>
            <template_description>
				<div id="appOwnersDescriptionDiv"></div>
			</template_description>
            <template_inputformcontrols>
                <SharePoint:InputFormControl runat="server">
                    <Template_Control>
                        <div id="appOwnersPickerDiv"></div>
					</Template_Control>
                </SharePoint:InputFormControl>
            </template_inputformcontrols>
        </SharePoint:InputFormSection>
        <SharePoint:ButtonSection ShowStandardCancelButton="false" runat="server">
            <template_buttons>
                <asp:Button ID="OKButton" runat="Server" CssClass="okButton" Enabled="false" />
                <asp:Button ID="CancelButton" runat="Server" CssClass="cancelButton" />
            </template_buttons>
        </SharePoint:ButtonSection>
    </table>
</asp:Content>

import React from 'react';
import * as Fluent from '@fluentui/react';
import * as Router from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { List } from 'linqts';
import * as MSALBrowser from '@azure/msal-browser';
import * as MSALReact from '@azure/msal-react';
import * as Types from '../Types';
import * as Pages from '../Pages';


export interface IAppMenu {
	type?: Types.CommandType;
	pageTitle?: string;
	iconName?: string;
	label?: string;
	toolTip?:string;
	componentName?: string;
	isRouterIndex?: boolean;
	key: string;
	onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement | HTMLSpanElement | Fluent.BaseButton | Fluent.Button> | undefined, msalInstance: MSALReact.IMsalContext) => void;
	url?: Router.To;
	pageComponent?: JSX.Element;
	submenu?: List<IAppMenu>;
	displayMode?: Types.DisplayMode;
}

export const config = {
	title: "Rdz!",
	rightPanelTitle: "Quick Links",
	facebookFeature: {
		Comments: {
			numberOfComments: 5
		}
	},
	msal: {
		msalConfig: {
			auth: {
				clientId: process.env.REACT_APP_AZUREAD_APP_CLIENTID,
				authority: "https://login.microsoftonline.com/common",
				redirectUri: process.env.REACT_APP_AZUREAD_APP_REDIRECTURL
			},
			cache: {
				cacheLocation: "sessionStorage", // This configures where your cache will be stored
				storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
			},
			system: {
				loggerOptions: {
					loggerCallback: (level: any, message: any, containsPii: any) => {
						if (containsPii) {
							return;
						}
						switch (level) {
							case MSALBrowser.LogLevel.Error:
								console.error(message);
								return;
							case MSALBrowser.LogLevel.Info:
								//console.info(message);
								return;
							case MSALBrowser.LogLevel.Verbose:
								//console.debug(message);
								return;
							case MSALBrowser.LogLevel.Warning:
								console.warn(message);
								return;
						}
					}
				}
			}
		} as MSALBrowser.Configuration,
		loginRequest: {
			scopes: ["User.Read"]
		}
	},
	appIcons: new List<IAppMenu>([
		{
			type: Types.CommandType.Heading,
			key: uuidv4(),
			submenu: new List<IAppMenu>([
				{
					iconName: "HomeSolid",
					label: "Home",
					url: `/`,
					key: uuidv4(),
					pageComponent: <Pages.Default />
				},
				{
					pageTitle: "Password Generator",
					iconName: "PasswordField",
					label: "Password Generator",
					url: `/password-generator`,
					key: uuidv4(),
					pageComponent: <Pages.PasswordGen />
				},
				{
					pageTitle: "URI Encode-Decode",
					iconName: "ChangeEntitlements",
					label: "URI Encode-Decode",
					url: `/uri-encode-decode`,
					key: uuidv4(),
					pageComponent: <Pages.URIEncodeDecode />
				},
				{
					pageTitle: "Blogs",
					iconName: "blog",
					label: "Blogs",
					url: `/blogs`,
					key: uuidv4(),
					pageComponent: <Pages.Blogs />,
					submenu: new List<IAppMenu>([
						{
							isRouterIndex: true,
							key: uuidv4(),
							pageComponent: <Pages.BlogList />
						},						
						{
							url: `:blogId/:blogUrl`,
							key: uuidv4(),
							pageComponent: <Pages.BlogDetails />
						}
					])
				},
			])
		},
		{
			label: "Office 365",
			type: Types.CommandType.Heading,
			key: uuidv4(),
			submenu: new List<IAppMenu>([
				{
					pageTitle: "Office 365",
					iconName: "WaffleOffice365",
					label: "Office",
					url: `/O365`,
					key: uuidv4(),
					pageComponent: <Pages.O365 />,
					displayMode: Types.DisplayMode.AuthenticatedOnly
				},
				{
					pageTitle: "Office 365",
					iconName: "Signin",
					label: "Login",
					onClick: (ev, msal) => {
						msal.instance.loginRedirect(config.msal.loginRequest).catch(e => console.log(e));
					},
					key: uuidv4(),
					displayMode: Types.DisplayMode.UnauthenticatedOnly
				}
			])
		},
		{
			label: "Google",
			type: Types.CommandType.Heading,
			key: uuidv4(),
			submenu: new List<IAppMenu>([
				{
					pageTitle: "Blogger",
					iconName: "page",
					label: "Blogger",
					toolTip: "Write your own blog with my editor (requires app permission).",
					url: `/google/blogger`,
					key: uuidv4(),
					pageComponent: <Pages.BloggerEditor />
				},
				{
					pageTitle: "Drive",
					iconName: "page",
					label: "Drive",
					toolTip: "Write your own blog with my editor (requires app permission).",
					url: `/google/drive`,
					key: uuidv4(),
					pageComponent: <Pages.DriveEditor />
				},
			])
		},
		{
			label: "About",
			type: Types.CommandType.Heading,
			key: uuidv4(),
			submenu: new List<IAppMenu>([
				{
					pageTitle: "Privacy Policy",
					iconName: "page",
					label: "Privacy Policy",
					url: `/privacy-policy`,
					key: uuidv4(),
					pageComponent: <Pages.PrivacyPolicy />
				},
				{
					pageTitle: "Terms of Service",
					iconName: "page",
					label: "Terms of Service",
					url: `/terms-of-service`,
					key: uuidv4(),
					pageComponent: <Pages.TermsOfService />
				}
			])
		}
	])
};
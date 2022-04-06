import React from 'react';
import * as Router from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { List } from 'linqts';

import * as Pages from '../Pages';

export interface IAppMenu {
	pageTitle?: string;
  iconName: string;
  label: string;
  componentName?: string;
  key?: string;
  execute?: Function;
	url?: Router.To;
	component?: JSX.Element;
	submenu?: List<IAppMenu>;
}

export const config = {
	title: "Rdz!",
	appIcons: new List<IAppMenu>([
		{
			iconName: "HomeSolid",
			label: "Home",
			componentName: "Default",
			url: "/",
			key: uuidv4(),
			component: <Pages.Default />
		},
		{
			pageTitle: "Password Generator",
			iconName: "PasswordField",
			label: "Password Generator",
			componentName: "PasswordGen",
			url: "/password-generator",
			key: uuidv4(),
			component: <Pages.PasswordGen />
		},
		{
			pageTitle: "Blogs",
			iconName: "blog",
			label: "Blogs",
			componentName: "Blogs",
			url: "/blogs",
			key: uuidv4(),
			component: <Pages.Blogs />
		}
	])
};
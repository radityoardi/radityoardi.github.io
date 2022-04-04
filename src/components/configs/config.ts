import { v4 as uuidv4 } from 'uuid';

export interface IAppMenu {
	pageTitle?: string;
  iconName: string;
  label: string;
  componentName?: string;
  key?: string;
  execute?: Function;
}

export const config = {
	title: "Rdz!",
	appIcons: [
		{
			iconName: "HomeSolid",
			label: "Home",
			componentName: "Default",
			key: uuidv4()
		},
		{
			pageTitle: "Password Generator",
			iconName: "PasswordField",
			label: "Password Generator",
			componentName: "PasswordGen",
			key: uuidv4()
		},
		{
			pageTitle: "Blogs",
			iconName: "blog",
			label: "Blogs",
			componentName: "Blogs",
			key: uuidv4()
		}
	] as IAppMenu[]
};
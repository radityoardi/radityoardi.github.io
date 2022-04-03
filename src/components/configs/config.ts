import { v4 as uuidv4 } from 'uuid';

export interface IAppMenu {
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
			iconName: "PasswordField",
			label: "Password Generator",
			componentName: "PasswordGen",
			key: uuidv4()
		}
	] as IAppMenu[]
};
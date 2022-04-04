import {
	BaseSlots,
	createTheme,
	getColorFromString,
	isDark,
	IThemeRules,
	PartialTheme,
	ThemeGenerator,
	themeRulesStandardCreator,
} from '@fluentui/react';

export interface IThemeInfo {
	primaryColor: string;
	textColor: string;
	backgroundColor: string;
	partialTheme?: PartialTheme;
}

export function generateTheme(themeInfo: IThemeInfo) {
	const themeRules = themeRulesStandardCreator();
	const colors = {
			primaryColor: getColorFromString(themeInfo.primaryColor)!,
			textColor: getColorFromString(themeInfo.textColor)!,
			backgroundColor: getColorFromString(themeInfo.backgroundColor)!,
	};

	const isCustomization = false;
	const overwriteCustomColor = true;

	ThemeGenerator.setSlot(
			themeRules[BaseSlots[BaseSlots.backgroundColor]],
			colors.backgroundColor,
			undefined,
			isCustomization,
			overwriteCustomColor,
	);

	const currentIsDark = isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!);

	ThemeGenerator.setSlot(
			themeRules[BaseSlots[BaseSlots.primaryColor]],
			colors.primaryColor,
			currentIsDark,
			isCustomization,
			overwriteCustomColor,
	);
	ThemeGenerator.setSlot(
			themeRules[BaseSlots[BaseSlots.foregroundColor]],
			colors.textColor,
			currentIsDark,
			isCustomization,
			overwriteCustomColor,
	);

	// strip out the unnecessary shade slots from the final output theme
	const abridgedTheme: IThemeRules = Object.entries(themeRules).reduce(
			(acc, [ruleName, ruleValue]) => (
					(
							ruleName.indexOf('ColorShade') === -1
							&& ruleName !== 'primaryColor'
							&& ruleName !== 'backgroundColor'
							&& ruleName !== 'foregroundColor'
							&& ruleName.indexOf('body') === -1
					)
							? {
									...acc,
									[ruleName]: ruleValue,
							}
							: acc
			),
			{} as IThemeRules,
	);

	return createTheme({ palette: ThemeGenerator.getThemeAsJson(abridgedTheme), ...themeInfo.partialTheme });
}
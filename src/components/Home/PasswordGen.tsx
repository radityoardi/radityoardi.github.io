import React, { CSSProperties, useState } from 'react';
import * as Fluent from '@fluentui/react';
import * as Hooks from '@fluentui/react-hooks';
import * as styles from '../../App.styles';

const CharClasses = {
	"a": { UL: "Aa", N: "4", S: "@^" },
	"b": { UL: "Bb", N: "38", S: "&>})" },
	"c": { UL: "Cc", N: "", S: "{[<(" },
	"d": { UL: "Dd", N: "", S: ">})" },
	"e": { UL: "Ee", N: "3", S: "" },
	"f": { UL: "Ff", N: "", S: "%" },
	"g": { UL: "Gg", N: "69", S: "&%" },
	"h": { UL: "Hh", N: "", S: "#" },
	"i": { UL: "Ii", N: "1", S: "!" },
	"k": { UL: "Kk", N: "", S: "" },
	"l": { UL: "Ll", N: "1", S: "|/\\" },
	"m": { UL: "Mm", N: "", S: "" },
	"n": { UL: "Nn", N: "", S: "^" },
	"o": { UL: "Oo", N: "0", S: "*" },
	"p": { UL: "Pp", N: "", S: "" },
	"q": { UL: "Qq", N: "", S: "?" },
	"r": { UL: "Rr", N: "", S: "" },
	"s": { UL: "Ss", N: "5", S: "$" },
	"t": { UL: "Tt", N: "7", S: "+" },
	"u": { UL: "Uu", N: "", S: "" },
	"v": { UL: "Vv", N: "", S: "" },
	"w": { UL: "Ww", N: "", S: "" },
	"x": { UL: "Xx", N: "", S: "*" },
	"y": { UL: "Yy", N: "", S: "" },
	"z": { UL: "Zz", N: "2", S: "" },
	" ": { UL: "", N: "", S: "_~-=:;" },
	".": { UL: "", N: "", S: ".,'/\\\"*`:;" }
} as { [key: string]: any };

const generatedPasswordStyle: CSSProperties = {
	backgroundColor: styles.appTheme.palette.themeDark,
	fontSize: '40px',
	padding: '10px',
	borderRadius: '5px'
};
const resultStyle: CSSProperties = {
	textAlign: 'center',
	margin: '50px auto 25px'
};

export const PasswordGen:React.FunctionComponent = () => {
	const tglUcaseLcase = Hooks.useId('tglUcaseLcase');
	const tglNumbers = Hooks.useId('tglNumbers');
	const tglNoModifyUcase = Hooks.useId('tglNoModifyUcase');
	const tglSpecialChars = Hooks.useId('tglSpecialChars');
	const txtDesiredPhrase = Hooks.useId('txtDesiredPhrase');
	const lblResult = Hooks.useId('lblResult');
	const [password, setPassword] = useState("-none-");

	const [UppercaseLowercase, { toggle: toggleUppercaseLowercase }] = Hooks.useBoolean(true);
	const [Numbers, { toggle: toggleNumbers }] = Hooks.useBoolean(true);
	const [NoModifyUppercase, { toggle: toggleNoModifyUppercase }] = Hooks.useBoolean(true);
	const [SpecialCharacters, { toggle: toggleSpecialCharacters }] = Hooks.useBoolean(true);
	const [DesiredPhrase, setDesiredPhrase] = React.useState<string>("");
	

	const generatePassword = () => {
		const PreferredPasswordLowerCase = DesiredPhrase.toLowerCase().split('');
		let PreferredPasswordNormal = DesiredPhrase.split('');
		const isUpperCase = (input:string):boolean => {
			return (input === input.toUpperCase());
		};

		for (let i = 0; i < PreferredPasswordNormal.length; i++) {
			const eNormal = PreferredPasswordNormal[i];
			const eLcase = PreferredPasswordLowerCase[i];
			
			if (CharClasses[eLcase] && (!NoModifyUppercase || (NoModifyUppercase && !isUpperCase(eNormal)))) {
				var ULClass = (NoModifyUppercase && CharClasses[eLcase].UL.length == 2 ? CharClasses[eLcase].UL[1] : CharClasses[eLcase].UL);
				var NumClass = (Numbers ? CharClasses[eLcase].N : '');
				var SymClass = (SpecialCharacters ? CharClasses[eLcase].S : '');
				var cClass = ULClass + NumClass + SymClass;
				var rnd = Math.floor(Math.random() * cClass.length);
				PreferredPasswordNormal[i] = cClass[rnd];
			}
	
		}
		setPassword(PreferredPasswordNormal.join(''));
	};

	return (
		<React.Fragment>
			<h1>Password Generator</h1>
			<h2>Instructions</h2>
			<p>
				Easy-to-remember password. Type your desired password phrase, or leave it blank and click <Fluent.PrimaryButton primary onClick={ev => generatePassword()}>Generate</Fluent.PrimaryButton> button.
			</p>
			<h2>Options</h2>
			<Fluent.Toggle id={tglUcaseLcase} label="Uppercase and lowercase" defaultChecked disabled inlineLabel onText="On" offText="Off" onChange={toggleUppercaseLowercase} />
			<Fluent.Toggle id={tglNumbers} label="Numbers" defaultChecked inlineLabel onText="On" offText="Off" onChange={toggleNumbers} />
			<Fluent.Toggle id={tglNoModifyUcase} label="Don't modify the uppercase" defaultChecked inlineLabel onText="On" offText="Off" onChange={toggleNoModifyUppercase} />
			<Fluent.Toggle id={tglSpecialChars} label="Special characters" defaultChecked inlineLabel onText="On" offText="Off" onChange={toggleSpecialCharacters} />
			<Fluent.TextField id={txtDesiredPhrase} label='Desired Phrase' onChange={(ev,newtext) => {
				if (newtext !== undefined) {
					setDesiredPhrase(newtext);
					generatePassword();
				}
			} } />
			<p style={resultStyle}>
				<Fluent.Text id={lblResult} style={generatedPasswordStyle}>{password}</Fluent.Text>
			</p>
			
		</React.Fragment>
	);
};
export default PasswordGen;
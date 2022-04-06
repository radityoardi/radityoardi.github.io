import React from 'react';
import * as Fluent from '@fluentui/react';
import * as Hooks from '@fluentui/react-hooks';
import * as Router from 'react-router-dom';
import * as styles from '../App.styles';


export const Blogs: React.FunctionComponent = () => {

	const [posts, setPosts] = React.useState({ items: [] });
	const [error, setError] = React.useState(null);
	const bloggerAPIKey = process.env.REACT_APP_GOOGLEAPI_KEY;
	const bloggerID = process.env.REACT_APP_MAINBLOGID;

	const breakText: React.CSSProperties = {
		wordBreak: 'break-all'
	};
	React.useEffect(() => {
		fetch(`https://www.googleapis.com/blogger/v3/blogs/${bloggerID}/posts?key=${bloggerAPIKey}`).then(response => response.json()).then(data => {
			setPosts(data);
			console.log(data);
		});
	}, []);

	return (
		<React.Fragment>
			<div>
				{
					posts.items.length == 0 && (
						<Fluent.ProgressIndicator label="Fetching" description="Fetching blog posts" />
					)
				}
				{
					posts && posts.items && posts.items.map((item: any, index: number) => (
						<React.Fragment>
							<h1 key={item.id}><Fluent.Link href={item.url}>{item.title}</Fluent.Link></h1>
							<div>Written by {item.author.displayName} on {(new Date(item.published)).toDateString()}</div>
							<Fluent.Text style={breakText}>
								<span dangerouslySetInnerHTML={{ __html: item.content }}></span>
							</Fluent.Text>
						</React.Fragment>
					))
				}

			</div>
		</React.Fragment>
	);
};

export const Default: React.FunctionComponent = () => {
	const textStyle: React.CSSProperties = {
		fontWeight: 'bolder',
		fontSize: '18px',
		letterSpacing: '2px',
		lineHeight: 1.3
	};
	const myPhoto: React.CSSProperties = {
		float: 'right',
		height: '100px'
	};
	
	return (
		<React.Fragment>
			<img src='ToonRadityoCircle.png' style={myPhoto} />
			<h1>Hello, World!</h1>
			<p style={textStyle}>
				This is not your typical default "Hello, World!" application.
			</p>
			<p style={textStyle}>
				I'm Radityo. I'm a technical consultant focusing on the application development world, currently living in the bustling city of Singapore, the city that never sleeps (literally).
				I've been getting my hands dirty on mostly Microsoft technology such as C#, SharePoint (not long after it was born), PowerShell hardcore, and now toying with Office 365, Power Apps &amp; Automate, and lastly sharpening my skills on TypeScript and React.
				<br />
				Though Machine Learning and AI are not really my main skills, but I'm leaning towards that.
			</p>
			<p style={textStyle}>
				In my free time, I love to cook (though I know I'm a terrible chef), love to "fish" sunbirds and yellow-vented bulbul to come to my corridor in a bid to grab their pics, and of course...eat.
			</p>
			<p style={textStyle}>
				This site got some tools I've written (click that top-right icon), it might be worth sharing. I used to <Fluent.Link href="https://otak-otak-it.blogspot.com">blog</Fluent.Link> but I'm falling away from it.
			</p>
		</React.Fragment>
	);
};

export const Home: React.FunctionComponent = () => {
	return (
		<React.Fragment>
			This is homeasd
		</React.Fragment>
	);
};



export const PasswordGen: React.FunctionComponent = () => {
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
	
	const generatedPasswordStyle: React.CSSProperties = {
		backgroundColor: styles.appTheme.palette.themeDark,
		color: styles.appTheme.palette.themeLight,
		fontSize: '40px',
		padding: '10px',
		borderRadius: '5px'
	};
	const resultStyle: React.CSSProperties = {
		textAlign: 'center',
		margin: '50px auto 25px'
	};
	
	const tglUcaseLcase = Hooks.useId('tglUcaseLcase');
	const tglNumbers = Hooks.useId('tglNumbers');
	const tglNoModifyUcase = Hooks.useId('tglNoModifyUcase');
	const tglSpecialChars = Hooks.useId('tglSpecialChars');
	const txtDesiredPhrase = Hooks.useId('txtDesiredPhrase');
	const lblResult = Hooks.useId('lblResult');
	const [password, setPassword] = React.useState("-none-");

	const [UppercaseLowercase, { toggle: toggleUppercaseLowercase }] = Hooks.useBoolean(true);
	const [Numbers, { toggle: toggleNumbers }] = Hooks.useBoolean(true);
	const [NoModifyUppercase, { toggle: toggleNoModifyUppercase }] = Hooks.useBoolean(true);
	const [SpecialCharacters, { toggle: toggleSpecialCharacters }] = Hooks.useBoolean(true);
	const [DesiredPhrase, setDesiredPhrase] = React.useState<string>("");


	const generatePassword = () => {
		const PreferredPasswordLowerCase = DesiredPhrase.toLowerCase().split('');
		let PreferredPasswordNormal = DesiredPhrase.split('');
		const isUpperCase = (input: string): boolean => {
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
			<Fluent.TextField id={txtDesiredPhrase} label='Desired Phrase' onChange={(ev, newtext) => {
				if (newtext !== undefined) {
					setDesiredPhrase(newtext);
					generatePassword();
				}
			}} />
			<p style={resultStyle}>
				<Fluent.Text id={lblResult} style={generatedPasswordStyle}>{password}</Fluent.Text>
			</p>

		</React.Fragment>
	);
};
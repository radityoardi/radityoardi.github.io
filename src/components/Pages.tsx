import React from 'react';
import * as Fluent from '@fluentui/react';
import * as Hooks from '@fluentui/react-hooks';
import * as Router from 'react-router-dom';
import * as styles from '../App.styles';
import * as Utility from './utils/Utility';
import * as Controls from './Controls';
import { v4 as uuidv4 } from 'uuid';
import * as MSALReact from '@azure/msal-react';
import * as Parser from "html-react-parser";
import * as codeStyles from 'react-syntax-highlighter/dist/esm/styles/hljs';


/*
export const Home: React.FunctionComponent = () => {
	return (
		<React.Fragment>
			This is homeasd
		</React.Fragment>
	);
};

*/
export const Blogs: React.FunctionComponent = () => {
	return (
		<React.Fragment>
			<Router.Outlet />
		</React.Fragment>
	);
};

export const BlogList: React.FunctionComponent = () => {

	const [posts, setPosts] = React.useState<any>({ items: [] });
	const [pageToken, setPageToken] = React.useState<string>();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const bloggerAPIKey = process.env.REACT_APP_GOOGLEAPI_KEY;
	const bloggerID = process.env.REACT_APP_MAINBLOGID;

	React.useEffect(() => {
		LoadBlogList();
	}, [pageToken, bloggerAPIKey, bloggerID]);

	const LoadBlogList = () => {
		setIsLoading(true);
		const fetchUrl = `https://www.googleapis.com/blogger/v3/blogs/${bloggerID}/posts?key=${bloggerAPIKey}${(pageToken ? `&pageToken=${pageToken}` : ``)}`;
		fetch(fetchUrl).then(response => response.json()).then(data => {
			setPosts(data);
		}).finally(() => setIsLoading(false));
	};

	const firstImageUrl = (content: string): HTMLImageElement | null => {
		const div = document.createElement(`div`);
		div.innerHTML = content;
		return div.querySelector(`img`);
	};

	const onSearchBlog = (newvalue:any) => {
		setIsLoading(true);
		const fetchUrl = `https://www.googleapis.com/blogger/v3/blogs/${bloggerID}/posts/search?key=${bloggerAPIKey}&q=${encodeURIComponent(newvalue)}`;
		fetch(fetchUrl).then(response => response.json()).then(data => {
			setPosts(data);
			console.log(data);
		}).finally(() => setIsLoading(false));
	};

	return (
		<React.Fragment>
			<Fluent.Stack tokens={{ childrenGap: 15, padding: 10 }}>
				<Fluent.SearchBox placeholder="Search blog posts..." underlined={true} onSearch={onSearchBlog} onClear={() => LoadBlogList()} />
			</Fluent.Stack>
			{
				isLoading && (
					<Fluent.ProgressIndicator label="Fetching" description="Fetching blog posts" />
				)
			}
			<Fluent.Stack horizontal wrap tokens={{ childrenGap: 15 }} className={`blogs`}>
				{
					!isLoading && posts && posts.items && posts.items.map((item: any) => (
						<Fluent.Stack.Item grow key={`bloghead-${item.id}`} tokens={{ padding: 20 }} styles={styles.blogItem} className={`blogitem`}>
							<Controls.RouterLink to={`/blogs/${item.id}`}><h1 className={`blogtitle`}>{item.title}</h1></Controls.RouterLink>
							{
								firstImageUrl(item.content) && (
									<Fluent.Image src={firstImageUrl(item.content)?.src} imageFit={Fluent.ImageFit.cover} height={150} styles={styles.blogImage} className={`blogimage`} />
								)
							}
							<Fluent.Persona imageUrl={item.author.image.url} text={item.author.displayName} size={Fluent.PersonaSize.size40} secondaryText={`Written on ${(new Date(item.published)).toDateString()}`} />
						</Fluent.Stack.Item>
					))
				}
			</Fluent.Stack>
			<Fluent.Stack horizontal wrap tokens={{ childrenGap: 25, padding: 10 }} horizontalAlign={`center`}>
				{
					!isLoading && posts && (posts.prevPageToken || posts.nextPageToken) && (
						<React.Fragment>
							<Fluent.IconButton iconProps={{ iconName: "ChromeBack" }} title={`Previous`} disabled={(posts.prevPageToken === undefined)} onClick={() => {
								setPosts(null);
								setPageToken(posts.prevPageToken);
							}} />
							<Fluent.IconButton iconProps={{ iconName: "ChromeBackMirrored" }} title={`Next`} disabled={(posts.nextPageToken === undefined)} onClick={() => {
								setPosts(null);
								setPageToken(posts.nextPageToken);
							}} />
						</React.Fragment>
					)
				}
			</Fluent.Stack>
		</React.Fragment>
	);
};

export const BlogDetails: React.FunctionComponent = () => {
	const [post, setPost] = React.useState<any>(undefined);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const bloggerAPIKey = process.env.REACT_APP_GOOGLEAPI_KEY;
	const bloggerID = process.env.REACT_APP_MAINBLOGID;
	const params = Router.useParams();

	const breakText: Fluent.IStyle = {
		wordBreak: 'break-word'
	};
	const isCodeElement = (node: any) => {
		return (
			node.type === "tag" && node.name === "pre" &&
			node.children.length > 0 && node.children[0].type === "tag" && node.children[0].name === "code" &&
			node.children[0].children.length > 0 && node.children[0].children[0].type === "text"
		);
	};

	const parserOptions: Parser.HTMLReactParserOptions = {
		replace: (node: any): JSX.Element | undefined => {
			if (isCodeElement(node)) {
				return (
					<React.Fragment>
						<Controls.CodeBlock language={node.children[0].attribs.style} style={codeStyles.dracula}>
							{node.children[0].children[0].data}
						</Controls.CodeBlock>
					</React.Fragment>
				);
			}
			else if (node.type === "tag" && node.name === "a" && node.children.length > 0 && node.children[0].type === "text") {
				return (<Fluent.Link href={node.attribs.href}>{node.children[0].data}</Fluent.Link>);
			}
			else if (node.type === "tag" && node.name === "img") {
				const width = node.attribs.width as number;
				return (<Fluent.Image alt={node.attribs.alt} src={node.attribs.src} styles={{ image: { width: width } }} />);
			}
		}
	};

	React.useEffect(() => {
		setIsLoading(true);
		const fetchUrl = `https://www.googleapis.com/blogger/v3/blogs/${bloggerID}/posts/${[params.blogId]}?key=${bloggerAPIKey}`;
		fetch(fetchUrl).then(response => response.json()).then(data => {
			setPost(data);
		}).finally(() => setIsLoading(false));
	}, [bloggerID, bloggerAPIKey, params.blogId]);

	return (
		<React.Fragment>
			{
				isLoading && (
					<Fluent.ProgressIndicator label="Fetching" description="Fetching a specific blog post" />
				)
			}
			{
				!isLoading && post && post.title && (
					<React.Fragment>
						<h1><Fluent.Link key={uuidv4()} href={`/#/blogs/${post.id}`} target={`_blank`}>{post.title}</Fluent.Link></h1>
						<Controls.RouterIconButton iconProps={{ iconName: "NavigateBack" }} to={`/blogs`} title={`back`} />
						<Fluent.IconButton iconProps={{ iconName: "FileSymlink" }} href={post.url} target={`_blank`} title={`go to the original blog`} />
						<div>Written by {post.author.displayName} on {(new Date(post.published)).toDateString()}</div>
						<Fluent.Text key={uuidv4()} styles={{ root: breakText }}>
							{Parser.default(post.content, parserOptions)}
						</Fluent.Text>
					</React.Fragment>
				)
			}
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
			<div style={textStyle}>
				<Controls.RdzMarkdown require={require(`./markdowns/home.md`)} />
			</div>
		</React.Fragment>
	);
};


export const NotFound404: React.FunctionComponent = () => {
	const lostGIFs = [
		`//giphy.com/embed/L3pfVwbsJbrk4`,
		`//giphy.com/embed/gKsJUddjnpPG0`,
		`//giphy.com/embed/8GTKaetBL5IVBMr18A`,
		`//giphy.com/embed/OfpdDt12u1Psk`,
		`//giphy.com/embed/WRQBXSCnEFJIuxktnw`,
	];
	const [randomGIF, setRandomGIF] = React.useState<string>();
	React.useEffect(() => {
		console.log(lostGIFs);
		const random = Math.floor(Math.random() * lostGIFs.length);
		console.log(random);
		setRandomGIF(lostGIFs[random]);
	}, []);
	return (
		<React.Fragment>
			<h1>404 Page Not Found</h1>
			{
				randomGIF && (<iframe src={randomGIF} title={`GIF404`} className={`notfound404`}></iframe>)
			}
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
		fontFamily: 'Consolas',
		fontSize: '20px',
		padding: '10px',
		borderRadius: '5px',
		cursor: 'pointer'
	};
	const resultStyle: React.CSSProperties = {
		textAlign: 'center',
		margin: '50px auto 25px'
	};
	const desiredPhraseStyle: Fluent.IStyle = {
		textAlign: 'center',
		fontSize: '18px'
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
	const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = Hooks.useBoolean(false);

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
				var ULClass = (NoModifyUppercase && CharClasses[eLcase].UL.length === 2 ? CharClasses[eLcase].UL[1] : CharClasses[eLcase].UL);
				var NumClass = (Numbers ? CharClasses[eLcase].N : '');
				var SymClass = (SpecialCharacters ? CharClasses[eLcase].S : '');
				var cClass = ULClass + NumClass + SymClass;
				var rnd = Math.floor(Math.random() * cClass.length);
				PreferredPasswordNormal[i] = cClass[rnd];
			}

		}
		setPassword(PreferredPasswordNormal.join(''));
	};

	React.useEffect(() => {
		generatePassword();
	}, [DesiredPhrase, UppercaseLowercase, Numbers, NoModifyUppercase, SpecialCharacters]);

	React.useEffect(() => {
		fetch(`https://random-word-api.herokuapp.com/word?number=2`).then(response => response.json()).then(data => {
			setDesiredPhrase(data.map((item: string) => (item.charAt(0).toUpperCase() + item.slice(1))).join(''));
		});
	}, []);

	return (
		<React.Fragment>
			<h1>Password Generator</h1>
			<h2>Instructions</h2>
			<p>
				Easy-to-remember password. Type your desired password phrase, or leave it blank to generate 2-word randoms and click the button to scramble characters.
			</p>
			<h2>Options</h2>
			<Fluent.Toggle id={tglUcaseLcase} label="Uppercase and lowercase" defaultChecked disabled onText="Enabled" offText="Disabled" onChange={toggleUppercaseLowercase} />
			<Fluent.Toggle id={tglNumbers} label="Numbers" defaultChecked onText="Enabled" offText="Disabled" onChange={toggleNumbers} />
			<Fluent.Toggle id={tglNoModifyUcase} label="Don't modify the uppercase" defaultChecked onText="Enabled" offText="Disabled" onChange={toggleNoModifyUppercase} />
			<Fluent.Toggle id={tglSpecialChars} label="Special characters" defaultChecked onText="Enabled" offText="Disabled" onChange={toggleSpecialCharacters} />
			<Fluent.TextField id={txtDesiredPhrase} label='Desired Phrase' styles={{ field: desiredPhraseStyle }} value={DesiredPhrase} onChange={(ev, newtext) => setDesiredPhrase(newtext as string) as any}>
			</Fluent.TextField>

			<p style={resultStyle}>

				<Fluent.Text id={lblResult} style={generatedPasswordStyle} onClick={() => { Utility.copyToClipboard(lblResult); toggleIsCalloutVisible(); setTimeout(toggleIsCalloutVisible, 1000); }}>{password}</Fluent.Text>
				{
					isCalloutVisible && (
						<Fluent.Callout target={`#${lblResult}`}>
							<Fluent.Text>Password is copied to the clipboard.</Fluent.Text>
						</Fluent.Callout>
					)
				}
				<Fluent.IconButton primary onClick={generatePassword} iconProps={{ iconName: "Refresh" }}></Fluent.IconButton>
			</p>

		</React.Fragment>
	);
};

export const PrivacyPolicy: React.FunctionComponent = () => {
	return (
		<React.Fragment>
			<Controls.RdzMarkdown require={require(`./markdowns/privacypolicy.md`)} />
		</React.Fragment>
	);
};

export const TermsOfService: React.FunctionComponent = () => {
	return (
		<React.Fragment>
			<Controls.RdzMarkdown require={require(`./markdowns/termsofservice.md`)} />
		</React.Fragment>
	);
};

export const O365: React.FunctionComponent = () => {
	return (
		<React.Fragment>
			<MSALReact.UnauthenticatedTemplate>
				You have not signed in to Office 365.
				<Experimental />
			</MSALReact.UnauthenticatedTemplate>
			<MSALReact.AuthenticatedTemplate>
				You're signed in.
				<Experimental />
			</MSALReact.AuthenticatedTemplate>
		</React.Fragment>
	);
};

export const Experimental: React.FunctionComponent = () => {
	return (
		<React.Fragment>
			This is just an experiment.
		</React.Fragment>
	);
};

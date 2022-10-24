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
import * as Configs from './configs/config';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GoogleUserContext } from './utils/GoogleUserContext';
import { gapi } from 'gapi-script';

const fbBaseCommentHref = () => {
	return document.location.origin !== process.env.REACT_APP_FBCOMMENT_BASEURL ? `${process.env.REACT_APP_FBCOMMENT_BASEURL}/${(new URL(document.location.href)).hash}` : document.location.href;
};

const convertFromPermalink = (fullUrl: string) => {
	const parsedUrl = new URL(fullUrl);
	return parsedUrl.pathname.replaceAll(`/`, `_`);
};

const convertToPermalink = (partialUrl: string) => {
	return partialUrl.replaceAll(`_`, `/`);
};

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
		const fetchUrl = `https://www.googleapis.com/blogger/v3/blogs/${bloggerID}/posts?key=${bloggerAPIKey}&maxResults=12${(pageToken ? `&pageToken=${pageToken}` : ``)}`;
		fetch(fetchUrl).then(response => response.json()).then(data => {
			setPosts((current: any) => {
				return { ...data, items: [...current.items, ...data.items] };
			});
		}).finally(() => setIsLoading(false));
	};

	const firstImageUrl = (content: string): HTMLImageElement | null => {
		const div = document.createElement(`div`);
		div.innerHTML = content;
		return div.querySelector(`img`);
	};

	const onSearchBlog = (newvalue: any) => {
		setIsLoading(true);
		gtag(`event`, `search`, { search_term: newvalue }); //send to GA
		const fetchUrl = `https://www.googleapis.com/blogger/v3/blogs/${bloggerID}/posts/search?key=${bloggerAPIKey}&q=${encodeURIComponent(newvalue)}`;

		fetch(fetchUrl).then(response => response.json()).then(data => {
			setPosts(data);
		}).finally(() => setIsLoading(false));
	};

	return (
		<React.Fragment>
			<Fluent.Stack tokens={{ childrenGap: 15, padding: 10 }}>
				<Fluent.SearchBox placeholder="Search blog posts..." underlined={true} onSearch={onSearchBlog} onClear={() => LoadBlogList()} />
			</Fluent.Stack>
			<InfiniteScroll dataLength={posts.items.length} hasMore={true} next={() => { setPageToken(posts.nextPageToken); }} loader={<Fluent.Shimmer />}>
				<Fluent.Stack horizontal wrap tokens={{ childrenGap: 15 }} className={`blogs`}>
					{
						posts && posts.items && posts.items.map((item: any) => (
							<Fluent.StackItem grow key={`bloghead-${item.id}`} tokens={{ padding: 20 }} styles={styles.blogItem} className={`blogitem`}>
								<Controls.RouterLink to={`/blogs/${bloggerID}/${convertFromPermalink(item.url)}`} className={`blogtitlelink`}><h1 className={`blogtitle`}>{item.title}</h1></Controls.RouterLink>
								<Fluent.Stack horizontal wrap tokens={{ childrenGap: 10 }} className={`blogtags`}>
									{
										item.labels && item.labels.map((label: string) => <Fluent.Stack.Item key={`bloghead-${item.id}-${uuidv4()}`} className={`blogtag`} styles={styles.blogTag}>{label}</Fluent.Stack.Item>)
									}
								</Fluent.Stack>
								{
									firstImageUrl(item.content) && (
										<Fluent.Image src={firstImageUrl(item.content)?.src} imageFit={Fluent.ImageFit.cover} height={150} styles={styles.blogImage} className={`blogimage`} />
									)
								}
								<Fluent.Persona imageUrl={item.author.image.url} text={item.author.displayName} size={Fluent.PersonaSize.size40} secondaryText={`Written on ${(new Date(item.published)).toDateString()}`} />
							</Fluent.StackItem>
						))
					}
				</Fluent.Stack>
			</InfiniteScroll>

			{
				isLoading && (
					<Fluent.ProgressIndicator label="Fetching" description="Fetching blog posts" />
				)
			}
		</React.Fragment>
	);
};

export const BlogDetails: React.FunctionComponent = () => {
	const [post, setPost] = React.useState<any>(undefined);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const bloggerAPIKey = process.env.REACT_APP_GOOGLEAPI_KEY;
	const params = Router.useParams();
	const location = Router.useLocation();

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
						<Controls.CodeBlock hidden={true} language={node.children[0].attribs.style} style={codeStyles.dracula}>
							{node.children[0].children[0].data}
						</Controls.CodeBlock>
					</React.Fragment>
				);
			}
			else if (node.type === "tag" && node.name === "a" && node.children.length > 0 && node.children[0].type === "text") {
				const parseURL = new URL(node.attribs.href);
				if (parseURL.hostname.endsWith(`.blogspot.com`)) {
					return (<Fluent.Link href={`/#/blogs/${params.blogId}/${convertFromPermalink(node.attribs.href)}`}>{node.children[0].data}</Fluent.Link>);
				} else {
					return (<Fluent.Link href={node.attribs.href}>{node.children[0].data}</Fluent.Link>);
				}
			}
			else if (node.type === "tag" && node.name === "img") {
				const imgsrc = (node.attribs.src as string).startsWith(`http://`) ? (node.attribs.src as string).replace(`http://`, `https://`) : node.attribs.src as string; //fixing 403 forbidden
				const imageStyle: Fluent.IImageStyles = {
					root: {
						display: 'flex',
						justifyContent: 'center'
					},
					image: {
						width: 'auto',
						maxWidth: '100%'
					}
				};
				return (<Fluent.Image alt={node.attribs.alt} src={imgsrc} styles={imageStyle} imageFit={Fluent.ImageFit.cover} />);
			}
		}
	};

	React.useEffect(() => {
		setIsLoading(true);
		const blogUrl = convertToPermalink(params.blogUrl as string);
		const fetchUrl = `https://www.googleapis.com/blogger/v3/blogs/${params.blogId}/posts/bypath?path=${blogUrl}&key=${bloggerAPIKey}`;
		fetch(fetchUrl).then(response => response.json()).then(data => {
			setPost(data);
			document.title = `${Configs.config.title} - ${data.title}`;
		}).finally(() => setIsLoading(false));

	}, [bloggerAPIKey, params.blogUrl, params.blogId]);


	return (
		<React.Fragment>
			<Controls.GoogleAnalytics />
			{
				isLoading && (
					<Fluent.ProgressIndicator label="Fetching" description="Fetching a specific blog post" />
				)
			}
			{
				!isLoading && post && post.title && (
					<React.Fragment>
						<Controls.GoogleAnalytics pageTitle={post.title} />
						<h1>{post.title}</h1>
						<div>
							<Controls.RouterIconButton iconProps={{ iconName: "NavigateBack" }} to={`/blogs`} title={`back`} />
							<Fluent.IconButton iconProps={{ iconName: "FileSymlink" }} href={post.url} target={`_blank`} title={`go to the original blog`} />
						</div>
						<div>Written by {post.author.displayName} on {(new Date(post.published)).toDateString()}</div>
						<Fluent.Text key={uuidv4()} styles={{ root: breakText }}>
							{Parser.default(post.content, parserOptions)}
						</Fluent.Text>
						<Controls.FacebookLikes href={fbBaseCommentHref()} />
						<Controls.FacebookComments href={fbBaseCommentHref()} numPosts={Configs.config.facebookFeature.Comments.numberOfComments} width={`100%`} />
					</React.Fragment>
				)
			}
		</React.Fragment>
	);
};
//document.location.href

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
		const random = Math.floor(Math.random() * lostGIFs.length);
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
	const [isLoading, { toggle: toggleIsLoading }] = Hooks.useBoolean(false);

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
		toggleIsLoading();
		fetch(`https://random-word-api.herokuapp.com/word?number=2`).then(response => response.json()).then(data => {
			setDesiredPhrase(data.map((item: string) => (item.charAt(0).toUpperCase() + item.slice(1))).join(''));
		}).finally(toggleIsLoading);
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
				<React.Fragment>
					<Fluent.Text id={lblResult} style={generatedPasswordStyle} onClick={() => { Utility.copyToClipboard(lblResult); toggleIsCalloutVisible(); setTimeout(toggleIsCalloutVisible, 1000); }}>
						{
							isLoading && (`generating...`)
						}
						{!isLoading && (password)}
					</Fluent.Text>
					{
						isCalloutVisible && (
							<Fluent.Callout target={`#${lblResult}`}>
								<Fluent.Text>Password is copied to the clipboard.</Fluent.Text>
							</Fluent.Callout>
						)
					}
					<Fluent.IconButton primary onClick={generatePassword} iconProps={{ iconName: "Refresh" }}></Fluent.IconButton>
				</React.Fragment>

			</p>

			<Controls.FacebookLikes href={fbBaseCommentHref()} />
			<Controls.FacebookComments href={fbBaseCommentHref()} numPosts={Configs.config.facebookFeature.Comments.numberOfComments} width={`100%`} />
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

export const URIEncodeDecode: React.FunctionComponent = () => {

	const [convertedText, setConvertedText] = React.useState<string>("");
	const [originalText, setOriginalText] = React.useState<string>("");
	const [isURIComponent, { toggle: toggleIsURIComponent }] = Hooks.useBoolean(true);
	const [isEncode, { toggle: toggleIsEncode }] = Hooks.useBoolean(true);
	const rows = 10;

	React.useEffect(() => {
		if (isEncode && isURIComponent) {
			setConvertedText(encodeURIComponent(originalText as string));
		} else if (!isEncode && isURIComponent) {
			setConvertedText(decodeURIComponent(originalText as string));
		} else if (isEncode && !isURIComponent) {
			setConvertedText(encodeURI(originalText as string));
		} else if (!isEncode && !isURIComponent) {
			setConvertedText(decodeURI(originalText as string));
		} else {
			setConvertedText("");
		}
	}, [originalText, isEncode, isURIComponent]);

	return (
		<React.Fragment>
			<h1>URI Encoder-Decoder</h1>
			<Fluent.Stack tokens={{ childrenGap: 10 }}>
				<Fluent.TextField label={`Text to ${isEncode ? `en` : `de`}code`} rows={rows} multiline autoAdjustHeight onChange={(ev, newText) => { setOriginalText(newText ?? ``); }} />
				<Fluent.Stack grow horizontal tokens={{ childrenGap: 10 }}>
					<Fluent.StackItem grow>
						<Fluent.Toggle onText='URI Component' offText='URI' defaultChecked={isURIComponent} onChange={toggleIsURIComponent} />
					</Fluent.StackItem>
					<Fluent.StackItem grow>
						<Fluent.Toggle onText='Encode' offText='Decode' defaultChecked={isEncode} onChange={toggleIsEncode} />
					</Fluent.StackItem>
				</Fluent.Stack>
				<Fluent.TextField label={`${isEncode ? `En` : `De`}coded text`} rows={rows} multiline readOnly autoAdjustHeight value={convertedText} />
			</Fluent.Stack>
		</React.Fragment>
	);
};


export const BloggerEditor: React.FunctionComponent = () => {
	const { profile, setProfile } = React.useContext(GoogleUserContext);
	const [headers, setHeaders] = React.useState([]);
	const apiKey = process.env.REACT_APP_GOOGLEAPI_KEY;

	React.useEffect(() => {
		const auth2 = gapi.auth2?.getAuthInstance();
	}, []);

	return (
		<React.Fragment>
			<h1>Google Blogger</h1>
			<Controls.GoogleAccount
				authenticated={
					<React.Fragment>
						<Controls.CommonGoogleAuthenticated />
						<Fluent.CompoundButton onClick={() => {
							//console.log(gapi);
							gapi.client.blogger.blogs.listByUser({
								userId: `self`
							}).then((res:any) => {
								console.log(res);
							});
						}}>
							Get Status
						</Fluent.CompoundButton>
						<Fluent.Text>
							{profile?.googleId}
						</Fluent.Text>
					</React.Fragment>
				}
				unauthenticated={
					<React.Fragment>
						<Controls.CommonGoogleUnauthenticated />
					</React.Fragment>
				}
			/>
		</React.Fragment>
	);
};

export const DriveEditor: React.FunctionComponent = () => {
	return (
		<React.Fragment>
			<h1>Google Drive</h1>
			<Controls.GoogleAccount
				authenticated={
					<React.Fragment>
						<Controls.CommonGoogleAuthenticated />
					</React.Fragment>
				}
				unauthenticated={
					<React.Fragment>
						<Controls.CommonGoogleUnauthenticated />
					</React.Fragment>
				}
			/>
		</React.Fragment>
	);
};

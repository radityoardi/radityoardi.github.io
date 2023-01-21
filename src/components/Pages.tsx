import React from 'react';
import * as Fluent from '@fluentui/react';
import * as MUI from '@mui/material';
import * as Hooks from '@fluentui/react-hooks';
import * as Router from 'react-router-dom';
import * as styles from '../App.styles';
import * as Types from './Types';
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
import he from 'he';
import * as datefunctions from 'date-fns';
import EditorJS, { API } from '@editorjs/editorjs';
import edjsParser from 'editorjs-parser';
import { customEdjsParsers } from './utils/EditorJS/editorjs-constants';


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
		const fetchUrl = `https://www.googleapis.com/blogger/v3/blogs/${bloggerID}/posts?fetchImages=true&key=${bloggerAPIKey}&maxResults=12${(pageToken ? `&pageToken=${pageToken}` : ``)}`;
		fetch(fetchUrl).then(response => response.json()).then(data => {
			console.log(`Blog Data: `, data);
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
		const fetchUrl = `https://www.googleapis.com/blogger/v3/blogs/${bloggerID}/posts/search?fetchImages=true&key=${bloggerAPIKey}&q=${encodeURIComponent(newvalue)}`;

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
				<Fluent.Stack key={`blogs-${uuidv4()}`} horizontal wrap tokens={{ childrenGap: 15 }} className={`blogs`}>
					{
						posts && posts.items && posts.items.map((item: any) => (
							<Fluent.StackItem grow key={`bloghead-${item.id}-${uuidv4()}`} tokens={{ padding: 20 }} styles={styles.blogItem} className={`blogitem`}>
								<Controls.RouterLink to={`/blogs/${bloggerID}/${convertFromPermalink(item.url)}`} className={`blogtitlelink`}><h1 className={`blogtitle`}>{item.title}</h1></Controls.RouterLink>
								<Fluent.Stack horizontal wrap tokens={{ childrenGap: 10 }} className={`blogtags`}>
									{
										item.labels && item.labels.map((label: string) => <Fluent.Stack.Item key={`bloghead-${item.id}-${uuidv4()}`} className={`blogtag`} styles={styles.blogTag}>{label}</Fluent.Stack.Item>)
									}
								</Fluent.Stack>
								{
									item.images && item.images.length && item.images.length > 0 && (
										<Fluent.Image src={item.images[0].url} imageFit={Fluent.ImageFit.cover} height={150} styles={styles.blogImage} className={`blogimage`} />
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
			<img src='ToonRadityoCircle.png' alt="Radityo Ardi" style={myPhoto} />
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
	const [expanded, setExpanded] = React.useState<string | false>(false);

	const [myBlogs, setMyBlogs] = React.useState([]);
	const [activeBlog, setActiveBlog] = React.useState<any>();
	const [myPosts, setMyPosts] = React.useState([]);
	const [activePost, setActivePost] = React.useState<any>();
	const [tags, setTags] = React.useState<string[]>([]);
	const [dialogProps, setDialogProps] = React.useState<Types.ICommonDialogProps>({ hidden: true });

	const [nextPageToken, setNextPageToken] = React.useState<string>();
	const [prevPageToken, setPrevPageToken] = React.useState<string>();

	const parser = React.useRef(new edjsParser(undefined, customEdjsParsers));

	const blogsID = Hooks.useId('blogs'), articlesID = Hooks.useId('articles'), editorID = Hooks.useId('editor');
	const editor = React.createRef<EditorJS>();
	let txtBlogTitle = React.createRef<Fluent.ITextField>();

	const blogsColumns: Fluent.IColumn[] = [
		{ key: 'name', name: 'Blog Name', fieldName: 'name', minWidth: 100, maxWidth: 400, isResizable: true },
		{ key: 'description', name: 'Description', fieldName: 'description', minWidth: 100, maxWidth: 500, isResizable: true },
		{
			key: 'actions', name: 'Actions', minWidth: 25, maxWidth: 75, isResizable: false,
			onRender: (item?: any, index?: number, column?: Fluent.IColumn) => {
				return (<Fluent.IconButton iconProps={{ iconName: `DoubleChevronDown8` }} title={`Select this blog and proceed to post list.`} onClick={onSelectBlog(item)}></Fluent.IconButton>);
			}
		},
	];
	const postsColumns: Fluent.IColumn[] = [
		{
			key: 'imageRef', name: '', minWidth: 100, maxWidth: 100, isResizable: false,
			onRender: (item?: any, index?: number, column?: Fluent.IColumn) => {
				const firstImg = item.images && item.images.length > 0 && item.images[0].url;
				return (<Fluent.Image src={firstImg} imageFit={Fluent.ImageFit.centerContain} height={50} />);
			}
		},
		{ key: 'name', name: 'Title', fieldName: 'title', minWidth: 100, maxWidth: 400, isResizable: true },
		{
			key: 'publishedDate', name: 'Published', minWidth: 100, maxWidth: 200, isResizable: true,
			onRender: (item?: any, index?: number, column?: Fluent.IColumn) => {
				const pubDate = item.published ? datefunctions.format(new Date(item.published), `dd MMM yyyy KK:mm`) : ``;
				return (<Fluent.Text block nowrap variant={`xSmall`}>{pubDate}</Fluent.Text>);
			}
		},
		{
			key: 'author', name: 'Author', minWidth: 100, maxWidth: 200, isResizable: true,
			onRender: (item?: any, index?: number, column?: Fluent.IColumn) => {
				return (<Fluent.Persona size={Fluent.PersonaSize.size24} text={item.author && item.author.displayName}></Fluent.Persona>);
			}
		},
		{
			key: 'actions', name: 'Actions', minWidth: 70, maxWidth: 70, isResizable: false,
			onRender: (item?: any, index?: number, column?: Fluent.IColumn) => {
				return (
					<Fluent.Stack tokens={{ childrenGap: 10 }} horizontal>
						<Fluent.IconButton iconProps={{ iconName: `EditNote` }} title={`Edit this post.`} onClick={onSelectPost(item)}></Fluent.IconButton>
						<Fluent.IconButton iconProps={{ iconName: `RedEye` }} title={`View post.`} src={item.url}></Fluent.IconButton>
					</Fluent.Stack>
				);
			}
		},
	];

	const postsCommandBar: Fluent.ICommandBarItemProps[] = [
		{
			key: `newpost`,
			text: `New Post`,
			iconProps: { iconName: `Add` },
			onClick: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, item?: Fluent.IContextualMenuItem) => {
				setActivePost(undefined);
				editor.current?.clear();
				setExpanded(editorID);
			}
		},
		{
			key: `editpost`,
			text: `Edit`,
			iconProps: { iconName: `EditNote` },
			onClick: () => {
				setExpanded(editorID);
			}
		},
	];

	const saveOrCreatePost = async (isDraft: boolean = true) => {
		if (gapi.client && gapi.client.blogger) {
			const parsedHTML = await extractHtml();
			const postData = {
				blogId: activeBlog.id,
				content: parsedHTML,
				title: activePost.title,
				labels: activePost.labels,
				isDraft: isDraft,
			};
			console.log(postData);
			if (activePost.id) {
				console.log(`Update`);
				return gapi.client.blogger.posts.update({
					...postData,
					postId: activePost.id,
				}).then((res: any) => {
					setActivePost(res.result);
					return res.result;
				});
			} else {
				console.log(`Insert`);
				return gapi.client.blogger.posts.insert(postData).then((res: any) => {
					setActivePost(res.result);
					return res.result;
				});
			}
		}
	};

	const showDialog = (message: string, title?: string, showControl?: boolean) => {
		setDialogProps({
			...dialogProps,
			hidden: false,
			showControl: showControl,
			dialogContentProps: {
				type: Fluent.DialogType.largeHeader,
				title: title,
				subText: message,
			},
		});

		if (dialogProps.duration !== undefined) {
			setTimeout(() => {
				setDialogProps({
					...dialogProps,
					hidden: true,
				});
			}, dialogProps.duration);
		}
	};

	const hideDialog = () => {
		setDialogProps({
			...dialogProps,
			hidden: true,
		});
	};

	const postEditorCommandBar: Fluent.ICommandBarItemProps[] = [
		{
			key: `savepostdraft`,
			text: `Save as Draft`,
			iconProps: { iconName: `Save` },
			onClick: async (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, item?: Fluent.IContextualMenuItem) => {
				showDialog(`Saving your post...`, `Save`);
				await saveOrCreatePost().then(hideDialog);
			}
		},
		{
			key: `cleareditor`,
			text: `Clear`,
			iconProps: { iconName: `Delete` },
			onClick: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, item?: Fluent.IContextualMenuItem) => {
				editor.current?.clear();
			}
		},
		{
			key: `publish`,
			text: `Publish`,
			iconProps: { iconName: `PublishContent` },
			onClick: async (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, item?: Fluent.IContextualMenuItem) => {
				if (gapi.client && gapi.client.blogger) {
					showDialog(`Publishing your post...`, `Publish`);
					await saveOrCreatePost(false)
					/*
					.then(res => {
						const postData = {
							blogId: activeBlog.id,
							postId: res.id,
						};
						return gapi.client.blogger.posts.publish(postData);
					})
					*/
					.then((res: any) => {
						setActivePost(undefined);
						setActiveBlog(undefined);
						setExpanded(blogsID);
						showDialog(`Your post is published.`, `Publish`, true);
					}).catch((err: any) => {
						console.error(err);
						showDialog(`There's an error publishing your post.`, `Error`, true);
					});
				}
			}
		},
	];

	const loadBlogs = (userId?: string) => {
		return gapi.client.blogger.blogs.listByUser({
			userId: userId ?? `self`
		});
	};

	const loadPosts = (blogID: string) => {
		return gapi.client.blogger.posts.list({
			blogId: blogID,
			fetchImages: true,
			status: [`DRAFT`, `LIVE`, `SCHEDULED`],
		});
	};

	const onAccordionExpand = (current: string) => (event: React.SyntheticEvent<Element, Event>, isExpanded: boolean) => {
		setExpanded(expanded ? current : false);
		if (current === blogsID) {
			setActivePost(undefined);
			setActiveBlog(undefined);
		} else if (current === articlesID) {
			setActivePost(undefined);
		} else if (current === editorID) {
			setActivePost(undefined);
		}
	};

	const onSelectBlog = (ab: any) => (event: any) => {
		setActiveBlog(ab);
		if (gapi.client && gapi.client.blogger) {
			loadPosts(ab.id).then((res: any) => {
				console.log(res.result.items);
				setMyPosts(res.result.items);
				setExpanded(articlesID);
			});
		}
	};

	const onSelectPost = (p: any) => (event: any) => {
		setActivePost(p);
		setExpanded(editorID);
	};

	const onActivePostChanged = (item?: any, index?: number, ev?: React.FocusEvent<HTMLElement>) => {
		setActivePost(item);
	};

	const extractHtml = () => {
		return editor.current?.saver.save().then((output: any) => {
			var ret = parser.current.parse(output);
			console.log(`ret: `, ret, ` output: `, output);
			return ret;
		});
	};

	React.useEffect(() => {
		if (gapi.client && gapi.client.blogger && profile) {
			loadBlogs().then((res: any) => {
				if (res && res.result && res.result.items && res.result.items.length > 0) {
					setMyBlogs(res.result.items);
					setExpanded(blogsID);
				}
			});
		}
	}, [gapi.client, profile]);

	return (
		<React.Fragment>
			<h1>Blogger Editor</h1>
			<div className={`blogger`}>
				<Controls.GoogleAccount
					authenticatedHeader={
						<Controls.CommonGoogleAuthenticated />
					}
					authenticated={
						<React.Fragment>
							<Fluent.Stack tokens={{ childrenGap: 20 }}>
								<Fluent.StackItem>
									<Fluent.MessageBar messageBarType={Fluent.MessageBarType.warning}>
										<p>
											Since Blogger Editor is in beta, there might be some issues.
										</p>
										<ul>
											<li>
												Direct image uploading is not supported, but you can paste a public-accessible image URL in the editor directly,
												and the editor will be able to render as the usual images.

											</li>
											<li>
												Google login works for only 1 hour and there still some issues with login state. If something is not
												working, you can press Ctrl + F5 to refresh the entire page.
											</li>
										</ul>
										<p>
											Other than that, the entire normal usage (save draft, publish, new blog) are working just fine.
										</p>
									</Fluent.MessageBar>
								</Fluent.StackItem>
								<Fluent.StackItem>
									<MUI.Accordion id={blogsID} onChange={onAccordionExpand(blogsID)} expanded={expanded === blogsID}>
										<MUI.AccordionSummary style={styles.bloggerEditorHeader}>
											My Blogs
										</MUI.AccordionSummary>
										<MUI.AccordionDetails>
											<Fluent.DetailsList compact columns={blogsColumns} items={myBlogs} selectionMode={Fluent.SelectionMode.single} checkboxVisibility={Fluent.CheckboxVisibility.hidden}>
											</Fluent.DetailsList>
										</MUI.AccordionDetails>
									</MUI.Accordion>
								</Fluent.StackItem>
								<Fluent.StackItem>
									<MUI.Accordion id={articlesID} onChange={onAccordionExpand(articlesID)} expanded={expanded === articlesID}>
										<MUI.AccordionSummary style={styles.bloggerEditorHeader}>
											My Articles {activeBlog && activeBlog.name && ` on ${activeBlog.name}`}
										</MUI.AccordionSummary>
										<MUI.AccordionDetails>
											<Fluent.CommandBar items={postsCommandBar} />
											<Fluent.DetailsList compact columns={postsColumns} items={myPosts} checkboxVisibility={Fluent.CheckboxVisibility.hidden} onActiveItemChanged={onActivePostChanged} />
										</MUI.AccordionDetails>
									</MUI.Accordion>
								</Fluent.StackItem>
								<Fluent.StackItem>
									<MUI.Accordion id={editorID} onChange={onAccordionExpand(editorID)} expanded={expanded === editorID}>
										<MUI.AccordionSummary style={styles.bloggerEditorHeader}>
											Blog Editor
										</MUI.AccordionSummary>
										<MUI.AccordionDetails>
											<Fluent.Stack>
												<Fluent.StackItem>
													<Fluent.Label>Blog Title</Fluent.Label>
													<Fluent.TextField
														key={(activePost && `${activePost.id}-title`) ?? `newpost-title-${uuidv4()}`}
														componentRef={txtBlogTitle}
														value={activePost && activePost.title}
														onChange={(ev: any, newText?: string) => {
															setActivePost({
																...activePost,
																title: newText,
															});
														}}
														underlined
														iconProps={{ iconName: `CommentSolid` }} />
												</Fluent.StackItem>
												<Fluent.StackItem>
													<Fluent.Label>Blog Tags</Fluent.Label>
													<Controls.TagEditor tags={activePost && activePost.labels} onChange={(tags) => {
														setActivePost({
															...activePost,
															labels: tags,
														});
													}} />
												</Fluent.StackItem>
												<Fluent.StackItem grow disableShrink>
													<Controls.ReactEditor
														label={`Blog Editor`}
														contentHTML={activePost && activePost.content}
														style={styles.reactEditor}
														ref={editor}
													/>
												</Fluent.StackItem>
												<Fluent.StackItem>
													<Fluent.CommandBar items={postEditorCommandBar} />
												</Fluent.StackItem>
											</Fluent.Stack>
										</MUI.AccordionDetails>
									</MUI.Accordion>
								</Fluent.StackItem>
							</Fluent.Stack>
							<Fluent.Dialog {...dialogProps}>
								{dialogProps.showControl && (
									<Fluent.DialogFooter>
										<Fluent.PrimaryButton text='OK' onClick={() => hideDialog()} />
									</Fluent.DialogFooter>
								)}
							</Fluent.Dialog>
						</React.Fragment>
					}
					unauthenticatedHeader={
						<Controls.CommonGoogleUnauthenticated />
					}
					unauthenticated={
						<React.Fragment>
						</React.Fragment>
					}
				/>
			</div>
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


export const TagEditorPage: React.FunctionComponent = () => {
	//this page variable
	const [text, setText] = React.useState<string>("");
	const [tags, setTags] = React.useState<string[]>([
		"C#",
		"SharePoint",
		"Database",
	]);

	/*
	React.useEffect(() => {
		setTags([
			"C#",
			"SharePoint",
			"Database",
		]);
	}, []);
	*/

	//variable to be incorporated with the control

	return (
		<React.Fragment>
			{text}
			<Controls.TagEditor tags={tags} onChange={(tg) => {
				if (tg) {
					setText(`Values from outside: ${tg.join(', ')}`);
					setTags(tg);
					console.log(`changed, now ${tg.length} element(s)`);
				}
			}} />
			<Fluent.PrimaryButton text='Click' onClick={() => { setTags([...tags, "Mama", "Papa", "Sambel"]); }} />
		</React.Fragment>
	);
};
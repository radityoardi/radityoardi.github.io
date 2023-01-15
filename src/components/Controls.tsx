import React from 'react';
import * as Fluent from '@fluentui/react';
import * as MUI from '@mui/material';
import * as Router from 'react-router-dom';
import * as Types from './Types';
import * as styles from '../App.styles';
import * as MyHooks from './Hooks';
import * as codeStyles from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter, { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import * as Hooks from '@fluentui/react-hooks';
import { v4 as uuidv4 } from 'uuid';
import Markdown from 'marked-react';
import * as Cookie from 'typescript-cookie';
import { List } from 'linqts';
import * as Configs from './configs/config';
import * as G from 'react-google-login';
import { gapi } from 'gapi-script';
import { GoogleUserContext } from './utils/GoogleUserContext';
import EditorJS, { API } from '@editorjs/editorjs';
import { Blocks } from './utils/EditorJS/editorjs-constants';
import e from 'express';

export const RouterIconButton = React.forwardRef<Fluent.IconButton, Types.IIconButtonProps>(
  function ButtonWithRef(
    { onClick, reloadDocument, replace = false, state, target, to, ...rest },
    ref) {
    let href = Router.useHref(to);
    let internalOnClick = Router.useLinkClickHandler(to, { replace, state, target });;
    function handleClick(
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented && !reloadDocument) {
        internalOnClick(event);
      }
    }

    return (
      <Fluent.IconButton
        {...rest}
        href={href}
        onClick={handleClick}
        ref={ref}
        target={target}
      />
    );
  }
);

export const RouterActionButton = React.forwardRef<Fluent.ActionButton, Types.IActionButtonProps>(
  function ButtonWithRef(
    { onClick, reloadDocument, replace = false, state, target, to, ...rest },
    ref) {
    let href = Router.useHref(to);
    let internalOnClick = Router.useLinkClickHandler(to, { replace, state, target });;
    function handleClick(
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented && !reloadDocument) {
        internalOnClick(event);
      }
    }

    return (
      <Fluent.ActionButton
        {...rest}
        href={href}
        onClick={handleClick}
        ref={ref}
        target={target}
      />
    );
  }
);

export const RouterLink = React.forwardRef<HTMLElement, Types.ILinkProps>(
  function LinkWithRef(
    { onClick, reloadDocument, replace = false, state, target, to, ...rest },
    ref) {
    let href = Router.useHref(to);
    let internalOnClick = Router.useLinkClickHandler(to, { replace, state, target });
    function handleClick(
      event: any
    ) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented && !reloadDocument) {
        internalOnClick(event);
      }
    }

    return (
      <Fluent.Link
        {...rest}
        href={href}
        onClick={handleClick}
        ref={ref}
        target={target}
      />
    );
  }
);

export const RouterDocumentCard = React.forwardRef<Fluent.IDocumentCard, Types.IDocumentCardProps>(
  function LinkWithRef(
    { onClick, reloadDocument, replace = false, state, to, ...rest }, ref) {
    let href = Router.useHref(to);
    let internalOnClick = Router.useLinkClickHandler(to, { replace, state });
    function handleClick(
      event: any
    ) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented && !reloadDocument) {
        internalOnClick(event);
      }
    }

    return (
      <Fluent.DocumentCard
        {...rest}
        onClickHref={href}
        onClick={handleClick}
      />
    );
  }
);

export interface CodeBlockProps extends SyntaxHighlighterProps {
  hidden?: boolean;
  hiddenCodeText?: string;
  hideCodeText?: string;
  showCodeText?: string;
  codeCopiedNotificationText?: string;
  notificationTimeout?: number;
  commandBarButtonHeight?: number | string;
}

export const CodeBlock = React.forwardRef<SyntaxHighlighter, CodeBlockProps>(
  function SynHighlighter({ ...rest }, ref) {
    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = Hooks.useBoolean(false);
    const [isCodeHidden, { toggle: toggleIsCodeHidden }] = Hooks.useBoolean(rest.hidden ?? true);
    const btnCopy = Hooks.useId('btnCopy');
    const [targetControlId, setTargetControlId] = React.useState<string>();
    const defaultCommandBarButtonHeight = '40px';

    return (
      <React.Fragment>
        <Fluent.CommandBarButton text={isCodeHidden ? rest.showCodeText ?? `Show code` : rest.hideCodeText ?? `Hide code`} iconProps={{ iconName: isCodeHidden ? `RedEye` : `Hide` }} styles={{ root: { height: rest.commandBarButtonHeight ?? defaultCommandBarButtonHeight } }} key={uuidv4()} onClick={() => {
          toggleIsCodeHidden();
        }} />
        {
          isCodeHidden && <Fluent.Separator>{rest.hiddenCodeText ?? `collapsed code`}</Fluent.Separator>
        }
        {
          !isCodeHidden && (
            <Fluent.CommandBarButton text={`Copy to clipboard`} iconProps={{ iconName: "Copy" }} styles={{ root: { height: rest.commandBarButtonHeight ?? defaultCommandBarButtonHeight } }} id={btnCopy} key={uuidv4()} onClick={() => {
              setTargetControlId(btnCopy);
              navigator.clipboard.writeText(rest.children as string);
              toggleIsCalloutVisible();
              setTimeout(toggleIsCalloutVisible, rest.notificationTimeout ?? 1000);
            }} />
          )
        }
        {
          isCalloutVisible && targetControlId && (
            <Fluent.Callout target={`#${targetControlId}`} key={uuidv4()}>
              <Fluent.Text>{rest.codeCopiedNotificationText ?? `The code below is now in the clipboard.`}</Fluent.Text>
            </Fluent.Callout>
          )
        }
        {
          !isCodeHidden && (
            <SyntaxHighlighter {...rest} ref={ref}>
            </SyntaxHighlighter>
          )
        }

      </React.Fragment>
    );
  }
);

export const RdzMarkdown: React.FunctionComponent<{ require: any, gfm?: boolean }> = ({ children, require, gfm }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [markdown, setMarkdown] = React.useState<any>();

  React.useEffect(() => {
    setIsLoading(true);
    fetch(require).then(response => response.text()).then(text => {
      setMarkdown(text);
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <React.Fragment>
      {
        isLoading && (
          <Fluent.ProgressIndicator label="Fetching" description="Fetching the markdown content..." />
        )
      }
      {
        !isLoading && (
          <div className={`rdzmd`}>
            <Markdown value={markdown} gfm={(gfm === undefined ? true : gfm)} />
          </div>
        )
      }

    </React.Fragment>
  );
};


export const FacebookComments: React.FunctionComponent<{ href?: string, numPosts?: number | string, width?: number | string }> = ({ href, numPosts, width }) => {
  console.log(`FB Comments: `, href);
  React.useEffect(() => {
    const fb = (window as any).FB;
    if (fb) {
      fb.XFBML.parse();
    }
  }, []);
  return (
    <React.Fragment>
      <div className="fb-comments" data-href={href} data-width={width} data-numposts={numPosts}></div>
    </React.Fragment>
  );
};

export const FacebookLikes: React.FunctionComponent<{ href?: string, width?: number | string }> = ({ href, width }) => {
  return (
    <React.Fragment>
      <div className="fb-like" data-href={href} data-width={width} data-layout="standard" data-action="like" data-size="large" data-share="true"></div>
    </React.Fragment>
  );
};

export const GoogleAccount: React.FunctionComponent<Types.IGoogleAccount> = (ga: Types.IGoogleAccount) => {
  /*
  Reference:
  https://dev.to/sivaneshs/add-google-login-to-your-react-apps-in-10-mins-4del
  https://blog.logrocket.com/guide-adding-google-login-react-app/
  https://github.com/partnerhero/gapi-script
  https://github.com/LucasAndrad/gapi-script-live-example/blob/master/src/components/GoogleLogin.js
  */
  const { profile, setProfile } = React.useContext(GoogleUserContext);

  React.useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENTID as string,
        scope: process.env.REACT_APP_GOOGLE_OAUTH_SCOPES as string,
        apiKey: process.env.REACT_APP_GOOGLEAPI_KEY as string,
        discoveryDocs: (process.env.REACT_APP_GOOGLE_OAUTH_DISCOVERYDOCS as string).split(` `)
      });
    });
  }, []);

  return (
    <React.Fragment>
      {
        profile ? (
          <React.Fragment>
            <Fluent.Stack tokens={{ childrenGap: 10 }}>
              <Fluent.Stack horizontal>
                <Fluent.StackItem grow={2}>
                  {ga.authenticatedHeader}
                </Fluent.StackItem>
                <Fluent.StackItem disableShrink>
                  <G.GoogleLogout
                    clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENTID as string}
                    buttonText={`Logout`}
                    onLogoutSuccess={() => {
                      setProfile(undefined);
                    }}
                  />
                </Fluent.StackItem>
              </Fluent.Stack>
              {ga.authenticated}

            </Fluent.Stack>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Fluent.Stack tokens={{ childrenGap: 10 }}>
              <Fluent.Stack horizontal>
                <Fluent.StackItem grow={2}>
                  {ga.unauthenticatedHeader}
                </Fluent.StackItem>
                <Fluent.StackItem disableShrink>
                  <G.GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENTID as string}
                    buttonText={`Login`}
                    onSuccess={(res: any) => {
                      setProfile(res.profileObj);
                      fetch(res.profileObj.imageUrl, { headers: { 'Origin': process.env.REACT_APP_AZUREAD_APP_REDIRECTURL as string } });
                      //please visit next time to fix the CORS issue when loading picture images
                    }}
                    onFailure={(err) => {
                      console.error(`Google sign in error.`, err);
                    }}
                    scope={process.env.REACT_APP_GOOGLE_OAUTH_SCOPES as string}
                  />

                </Fluent.StackItem>
              </Fluent.Stack>
              {ga.unauthenticated}
            </Fluent.Stack>
          </React.Fragment>
        )
      }



    </React.Fragment>
  );
};

export const CommonGoogleAuthenticated: React.FunctionComponent = () => {
  const { profile, setProfile } = React.useContext(GoogleUserContext);
  return (
    <React.Fragment>
      <Fluent.Persona text={profile?.name} imageUrl={profile?.imageUrl} secondaryText={profile?.email} size={Fluent.PersonaSize.size24} />
    </React.Fragment>
  );
};

export const CommonGoogleUnauthenticated: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <Fluent.Text>
        Apparently, I need your permission to write blog on your behalf. Click on the sign in button and ensure the permission to blogger and drive are selected.
      </Fluent.Text>
    </React.Fragment>
  );
};

export const StackWallpaper: React.FunctionComponent<Fluent.IStackProps> = (props) => {
  const pixabayAPIKey = process.env.REACT_APP_PIXABAYAPI_KEY;
  const [imageWallpaper, setImageWallpaper] = React.useState<string>();
  const cookieName = `background-image`;

  const searchedKeywords = [`flowers`, `animals`, `nature`];
  const randomIndex = Math.floor(Math.random() * searchedKeywords.length);
  const pickedKeyword = searchedKeywords[randomIndex];

  React.useEffect(() => {
    const fetchUrl = `https://pixabay.com/api/?key=${pixabayAPIKey}&q=${pickedKeyword}&image_type=photo&order=latest&editors_choice=true`;

    if (Cookie.getCookie(cookieName)) {
      setImageWallpaper(Cookie.getCookie(cookieName));
    } else {
      fetch(fetchUrl).then(response => response.json()).then(data => {
        const randomImages = Math.floor(Math.random() * data.hits.length);
        const pickedImage = data.hits[randomImages];
        setImageWallpaper(pickedImage.largeImageURL);
        Cookie.setCookie(cookieName, pickedImage.largeImageURL, { expires: 3 });
      });
    }

  }, []);

  const stackStyles: Fluent.IStackStyles = {
    root: {
      background: `url('${imageWallpaper}') no-repeat center center fixed`,
      backgroundSize: 'cover',
      minHeight: `100vh`
    }
  };

  return (
    <Fluent.Stack {...props} styles={stackStyles}>
    </Fluent.Stack>
  );
};

export interface IGoogleAnalyticsProps {
  pageTitle?: string;
  pageUrl?: string;
  eventName?: string;
};

export const GoogleAnalytics: React.FunctionComponent<IGoogleAnalyticsProps> = (props: IGoogleAnalyticsProps) => {
  const location = Router.useLocation();

  const [pageTitle, setPageTitle] = React.useState<string>();

  const getTitleFromConfigs = (url: string, menuitem?: List<Configs.IAppMenu>): string | undefined => {
    if (menuitem !== undefined) {
      const lookup = menuitem?.Where(x => (x?.type === undefined || x?.type === Types.CommandType.Normal) && x?.url === url);
      if (lookup === undefined || lookup?.Count() === 0) {
        const labels = menuitem?.Select((x: Configs.IAppMenu) => getTitleFromConfigs(url, x.submenu));
        return (labels !== undefined ? labels.First() : undefined);
      } else {
        return lookup?.Select(x => x.label).First();
      }
    }
  };


  React.useEffect(() => {
    let pt = props.pageTitle ?? getTitleFromConfigs(location.pathname, Configs.config.appIcons);

    if (pt && location.pathname !== `/`) {
      setPageTitle(`${Configs.config.title} - ${pt}`);
    } else if (location.pathname === `/`) {
      setPageTitle(`${Configs.config.title}`);
    }
  }, [location]);

  React.useEffect(() => {
    if (pageTitle) {
      //send google analytics event
      gtag(`event`, props.eventName ?? `page_view`, {
        page_location: window.location.href,
        page_title: pageTitle
      });

      //set window title
      document.title = pageTitle;
    }
  }, [pageTitle]);

  return (
    <React.Fragment>
    </React.Fragment>
  );
};

export const ReactEditor = React.forwardRef<EditorJS, Types.IEditorJs>((props: Types.IEditorJs, ref: React.ForwardedRef<EditorJS>) => {
  const [editor, setEditor] = React.useState<EditorJS>();
  const edjsID = Hooks.useId(`editorjs`);

  React.useEffect(() => {
    if (!editor) {
      const _ed = new EditorJS({
        holder: props.id ?? edjsID,
        onReady: props.onReady,
        onChange: props.onChange,
        tools: {
          ...Blocks,
          ...props.Blocks,
        },
        autofocus: props.autofocus ?? false,
      });
      console.log(_ed);
      _ed.styles = props.editorJsStyles ?? _ed.styles;
      setEditor(_ed);
    }
  }, []);

  React.useEffect(() => {
    if (editor) {
      if (props.contentHTML) {
        editor.blocks.renderFromHTML(props.contentHTML); //load from HTML
      } else {
        editor.clear(); //clear everything
      }

    } else {
      console.log(`Editor is not initialized.`);
    }
  }, [props.contentHTML]);

  React.useImperativeHandle(ref, () => (editor as EditorJS));

  return (
    <React.Fragment>
      <Fluent.Label>
        {props.label}
      </Fluent.Label>
      <div id={props.id ?? edjsID} style={props.style}></div>
    </React.Fragment>
  );
});


export const TagEditor: React.FunctionComponent<Types.ITagEditorProps> = (props: Types.ITagEditorProps) => {
  const txtRef = React.createRef<Fluent.ITextField>();
  const [text, setText] = React.useState<string|undefined>("");
  const [update, setUpdate] = React.useState<boolean>(false);
  //const [tags, setTags] = React.useState<string[]>(props.tags);
  const tags = React.useRef<string[]>(props.tags);

  const forceUpdate = () => {
    setUpdate(!update);
  };

  const tageditorTags: Fluent.IStackItemStyles = {
    root: {
      backgroundColor: styles.appTheme.palette.themeDark,
      color: styles.appTheme.palette.themeLight,
      padding: 5,
      borderRadius: 5,
      justifyContent: 'center'
    }
  };
  const tageditorTagsInside: Fluent.IStackItemStyles = {
    root: {
      justifyContent: 'center'
    }
  };
  const onKeyDown = (event?: React.KeyboardEvent) => {
    /*
    */
    if (event?.key == "Enter") {
      //tags.current = [...tags.current, text as string];
      if (tags.current === undefined) {
        tags.current = [];
      }
      tags.current.push(text as string);
      setText(""); //set text to empty
      if (props.onChange != undefined) {
        props.onChange(tags.current);
      }
    }
  };
  const onChange = (event?: React.FormEvent, newValue?: string) => {
    setText(newValue);
  };

  const onRemove = (item: string) => (event:any) => {
    var _index = tags.current.indexOf(item);
    if (_index > -1) {
      tags.current.splice(_index, 1);
      if (props.onChange != undefined) {
        props.onChange(tags.current);
      }
      forceUpdate();
    }
  };

  React.useEffect(() => {
    tags.current = props.tags;
    forceUpdate();
  }, [props.tags]);

  return (
    <React.Fragment>
      <Fluent.Stack horizontal horizontalAlign='center' wrap tokens={{ childrenGap: 10 }}>
        {
          tags && tags.current && tags.current.length > 0 && tags.current.map((item: string, index: number) => {
            return (
              <Fluent.StackItem key={`blogtageditor-${uuidv4()}`} align='center' styles={tageditorTags}>
                <Fluent.Stack horizontal horizontalAlign='center' wrap tokens={{ childrenGap: 10 }}>
                  <Fluent.StackItem align='center' styles={tageditorTagsInside}>
                    {item}
                  </Fluent.StackItem>
                  <Fluent.StackItem styles={tageditorTagsInside}>
                    <Fluent.IconButton iconProps={{ iconName: `Cancel` }} title="Remove" ariaLabel="Remove" onClick={onRemove(item)} />
                  </Fluent.StackItem>
                </Fluent.Stack>
              </Fluent.StackItem>
            );
          })
        }
        <Fluent.StackItem key={`blogtageditor-input-info`} align='center'>
          <Fluent.TextField placeholder='add a tag here...' componentRef={txtRef} onKeyDown={onKeyDown} onChange={onChange} value={text} iconProps={{ iconName: `TagSolid` }} />
        </Fluent.StackItem>
      </Fluent.Stack>
    </React.Fragment>
  );
};
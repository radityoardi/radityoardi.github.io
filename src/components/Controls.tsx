import React from 'react';
import * as Fluent from '@fluentui/react';
import * as Router from 'react-router-dom';
import * as Types from './Types';
import * as MyHooks from './Hooks';
import * as codeStyles from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter, { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import * as Hooks from '@fluentui/react-hooks';
import { v4 as uuidv4 } from 'uuid';
import Markdown from 'marked-react';
import * as Cookie from 'typescript-cookie';
import * as Helmet from 'react-helmet';
import { List } from 'linqts';
import * as Configs from './configs/config';
import * as G from 'react-google-login';
import { gapi } from 'gapi-script';
import { GoogleUserContext } from './utils/GoogleUserContext';

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
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENTID as string,
        scope: process.env.REACT_APP_GOOGLE_OAUTH_SCOPES as string,
        apiKey: process.env.REACT_APP_GOOGLEAPI_KEY as string,
        discoveryDocs: [`https://blogger.googleapis.com/$discovery/rest?version=v3`, `https://www.googleapis.com/discovery/v1/apis/drive/v3/rest`]
      });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  return (
    <React.Fragment>
      {
        profile ? (
          <React.Fragment>
            <Fluent.Stack horizontal>
              <Fluent.StackItem grow={2}>
                {ga.authenticated}
              </Fluent.StackItem>
              <Fluent.StackItem disableShrink>
                <G.GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENTID as string}
                  onLogoutSuccess={() => {
                    setProfile(undefined);
                  }}
                />
              </Fluent.StackItem>
            </Fluent.Stack>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Fluent.Stack horizontal>
              <Fluent.StackItem grow={2}>
                {ga.unauthenticated}
              </Fluent.StackItem>
              <Fluent.StackItem disableShrink>
                <G.GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENTID as string}
                  onSuccess={(res: any) => {
                    setProfile(res.profileObj);
                  }}
                  onFailure={(err) => {
                    console.error(`Google sign in error.`, err);
                  }}
                  scope={process.env.REACT_APP_GOOGLE_OAUTH_SCOPES as string}
                />

              </Fluent.StackItem>
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
      <Fluent.Persona text={profile?.name} imageUrl={profile?.imageUrl} secondaryText={profile?.email} />
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

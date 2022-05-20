import React from 'react';
import * as Fluent from '@fluentui/react';
import * as Hooks from '@fluentui/react-hooks';
import * as styles from './App.styles';
import * as Configs from './components/configs/config';
import * as Router from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as Controls from './components/Controls';
import * as MSALBrowser from '@azure/msal-browser';
import * as MSALReact from '@azure/msal-react';
import * as Types from './components/Types';
import * as Pages from './components/Pages';

const App: React.FunctionComponent = () => {
  ///////////////////////////// Variables
  const [isOpen, { setTrue: openPanel, setFalse: closePanel }] = Hooks.useBoolean(false);
  const location = Router.useLocation();
  const isAuthenticated = MSALReact.useIsAuthenticated();
  const msalInstance = MSALReact.useMsal();
  const appVersion = process.env.REACT_APP_VERSION;

  ///////////////////////////// FUNCTIONS
   const isDisplayed = (displayMode?: Types.DisplayMode): boolean => {
    return (displayMode === undefined || (isAuthenticated && displayMode === Types.DisplayMode.AuthenticatedOnly) || (!isAuthenticated && displayMode === Types.DisplayMode.UnauthenticatedOnly));
  };

  ///////////////////////////// App
  return (
    <React.Fragment>
      <Controls.GoogleAnalytics />
      <Controls.StackWallpaper styles={styles.divBody}>
        <Fluent.Stack horizontal styles={styles.appBar} tokens={{ childrenGap: 0, padding: 0 }}>
          <Fluent.Stack.Item grow styles={styles.titleBar}>
            <Fluent.Image src={"ToonRadityoCircle.png"} imageFit={Fluent.ImageFit.contain} styles={styles.siteIcon} alt={Configs.config.title} />
            <Controls.RouterLink style={styles.titleBlock} to={"/"} underline={false} className={`sitetitle`}>
              {Configs.config.title}
            </Controls.RouterLink>
          </Fluent.Stack.Item>
          <Fluent.Stack.Item disableShrink styles={styles.appLauncher}>
            <Fluent.IconButton iconProps={{ iconName: "AppIconDefaultList" }} title="App Launcher" ariaLabel="App Launcher" styles={styles.appLauncherButton} onClick={event => {
              openPanel();
              event.stopPropagation();
            }} />
            <Fluent.Panel headerText={Configs.config.rightPanelTitle} type={Fluent.PanelType.smallFixedFar} isBlocking={false} isOpen={isOpen} onDismiss={closePanel} closeButtonAriaLabel="Close">
              <Fluent.Stack tokens={{ childrenGap: 20 }}>
                {
                  Configs.config.appIcons.Where(x => isDisplayed(x?.displayMode)).ToArray().map((heading: Configs.IAppMenu) => (
                    <Fluent.Stack.Item key={uuidv4()}>
                      {
                        heading.label && (
                          <Fluent.Text variant={'mediumPlus'} nowrap block>{heading.label}</Fluent.Text>
                        )
                      }
                      <Fluent.Stack horizontal wrap tokens={{ childrenGap: 10 }}>
                        {
                          heading.submenu?.Where(x => isDisplayed(x?.displayMode)).ToArray().map((item: Configs.IAppMenu) => (
                            <Fluent.StackItem grow disableShrink styles={styles.appBlock} key={`navigation-${item.key}`}>
                              {
                                item.url === undefined && (
                                  <React.Fragment>
                                    <Fluent.IconButton iconProps={{ iconName: item.iconName }} title={item.label} ariaLabel={item.label} styles={styles.appIconButton} onClick={ev => {
                                      if (item.onClick !== undefined) {
                                        item.onClick(ev, msalInstance);
                                      }
                                      closePanel();
                                    }} />
                                    <Fluent.Text nowrap block variant={'small'} styles={styles.appLabel}>{item.label}</Fluent.Text>
                                  </React.Fragment>
                                )
                              }
                              {
                                item.url !== undefined && (
                                  <React.Fragment>
                                    <Controls.RouterIconButton iconProps={{ iconName: item.iconName }} title={item.label} ariaLabel={item.label} styles={styles.appIconButton} to={(item.url as Router.To)} onClick={closePanel} />
                                    <Fluent.Text nowrap block variant={'small'} styles={styles.appLabel}>{item.label}</Fluent.Text>
                                  </React.Fragment>

                                )
                              }
                            </Fluent.StackItem>
                          ))
                        }
                      </Fluent.Stack>
                    </Fluent.Stack.Item>
                  ))
                }
              </Fluent.Stack>
            </Fluent.Panel>
          </Fluent.Stack.Item>
        </Fluent.Stack>
        <div style={styles.divContent}>
          <Fluent.Stack styles={styles.stackBody} className={`stack-body`}>
            <Fluent.Stack.Item styles={styles.stackItemBody}>
              <React.Suspense fallback={(<Fluent.ProgressIndicator label="Loading" description="Loading the page component..." />)}>
                <Router.Routes>
                  {
                    Configs.config.appIcons.ToArray().map((heading: Configs.IAppMenu) => (
                      heading.submenu?.Where(x => x?.pageComponent !== undefined).ToArray().map((item: Configs.IAppMenu) => (
                        <Router.Route key={`routerl1-${item.key}`} path={(item.url as string)} element={item.pageComponent}>
                          {
                            item.submenu?.ToArray().map((itemL2: Configs.IAppMenu) => (
                              <Router.Route key={`routerl2-${itemL2.key}`} path={(itemL2.url as string)} index={itemL2.isRouterIndex} element={itemL2.pageComponent} />
                            ))
                          }
                        </Router.Route>
                      ))
                    ))
                  }
                  <Router.Route key={uuidv4()} path={"*"} element={<Pages.NotFound404 />} />
                </Router.Routes>
              </React.Suspense>
            </Fluent.Stack.Item>
          </Fluent.Stack>
          <div style={styles.copyright}>
            Published under Ms-PL (version {appVersion})
          </div>
        </div>
      </Controls.StackWallpaper>
    </React.Fragment>
  );
};
export default App;
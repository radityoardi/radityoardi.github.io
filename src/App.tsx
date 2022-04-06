import React from 'react';
import * as Fluent from '@fluentui/react';
import * as Hooks from '@fluentui/react-hooks';
import * as styles from './App.styles';
import * as Configs from './components/configs/config';
import * as Router from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as Controls from './components/Controls';

const App: React.FunctionComponent = () => {
  ///////////////////////////// Variables
  const [isOpen, { setTrue: openPanel, setFalse: closePanel }] = Hooks.useBoolean(false);
  const location = Router.useLocation();

  ///////////////////////////// FUNCTIONS
  React.useEffect(() => {
    //console.log(`currentLocation`, location);
  }, [location])


  ///////////////////////////// App
  return (
    <React.Fragment>
      <div style={styles.divBody}>
        <Fluent.Stack horizontal styles={styles.appBar} tokens={{ childrenGap: 0, padding: 0 }}>
          <Fluent.Stack.Item grow styles={styles.titleBar}>
            <Fluent.Link style={styles.titleBlock} href={"/"}>
              {Configs.config.title}
            </Fluent.Link>
          </Fluent.Stack.Item>
          <Fluent.Stack.Item disableShrink styles={styles.appLauncher}>
            <Fluent.IconButton iconProps={{ iconName: "AppIconDefaultList", style: styles.appLauncherIcon }} title="App Launcher" ariaLabel="App Launcher" style={styles.appLauncherButton} onClick={event => {
              openPanel();
              event.stopPropagation();
            }} />
            <Fluent.Panel headerText="Apps" type={Fluent.PanelType.smallFixedFar} isBlocking={false} isOpen={isOpen} onDismiss={closePanel} closeButtonAriaLabel="Close">
              <Fluent.Stack horizontal wrap tokens={{ childrenGap: 10 }}>
                {
                  Configs.config.appIcons.ToArray().map((item: Configs.IAppMenu) => (
                    <Fluent.StackItem grow disableShrink style={styles.appBlock} key={uuidv4()}>
                      <Controls.RouterIconButton iconProps={{ iconName: item.iconName, style: styles.appIcons }} title={item.label} ariaLabel={item.label} style={styles.appLauncherButton} to={(item.url as Router.To)} onClick={closePanel} />
                    </Fluent.StackItem>
                  ))
                }
              </Fluent.Stack>
            </Fluent.Panel>
          </Fluent.Stack.Item>
        </Fluent.Stack>
        <div style={styles.divContent}>
          <Fluent.Stack styles={styles.stackBody}>
            <Fluent.Stack.Item styles={styles.stackItemBody}>
              <React.Suspense fallback={(<Fluent.ProgressIndicator label="Loading" description="Loading the page component..." />)}>
                <Router.Routes>
                  {
                    Configs.config.appIcons.Where(x => x?.component != undefined).ToArray().map((item: Configs.IAppMenu) => (<Router.Route key={uuidv4()} path={(item.url as string)} element={item.component} />))
                  }
                </Router.Routes>
              </React.Suspense>
            </Fluent.Stack.Item>
          </Fluent.Stack>
          <div style={styles.copyright}>
            Licensed under Ms-PL
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default App;
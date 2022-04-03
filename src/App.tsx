import React, { lazy, useEffect, useState } from 'react';
import * as Fluent from '@fluentui/react';
import * as Hooks from '@fluentui/react-hooks';
import * as styles from './App.styles';
import * as Configs from './components/configs/config';

const App: React.FunctionComponent = () => {
  const [componentName, setComponentName] = React.useState<string | undefined>("Default");
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = Hooks.useBoolean(false);

  ///////////////////////////// FUNCTIONS
  const ContentComponent = lazy(() => import(`./components/Home/${componentName}`));
  ///////////////////////////// App

  return (
    <React.Fragment>
      <Fluent.ThemeProvider theme={styles.appTheme}>
        <div style={styles.divBody}>
          <Fluent.Stack horizontal styles={styles.appBar} tokens={{ childrenGap: 0, padding: 0 }}>
            <Fluent.Stack.Item grow styles={styles.titleBar}>
              <div style={styles.titleBlock}>
                {Configs.config.title}
              </div>
            </Fluent.Stack.Item>
            <Fluent.Stack.Item disableShrink styles={styles.appLauncher}>
              <Fluent.IconButton iconProps={{ iconName: "WebAppBuilderModule", style: styles.appLauncherIcon }} title="App Launcher" ariaLabel="App Launcher" style={styles.appLauncherButton} onClick={openPanel} />
              <Fluent.Panel headerText="Apps" type={Fluent.PanelType.smallFixedFar} isBlocking={false} isOpen={isOpen} onDismiss={dismissPanel} closeButtonAriaLabel="Close">
                <Fluent.Stack horizontal wrap tokens={{ childrenGap: 10 }}>
                  {
                    Configs.config.appIcons.map((item:Configs.IAppMenu, index) => {
                      const onClickIconButton = (ev: any) => {
                        if (item.componentName) {
                          setComponentName(item.componentName);
                        }
                        
                        dismissPanel();
                      };
                      return (
                        <Fluent.StackItem grow disableShrink style={styles.appBlock} key={index}>
                          <Fluent.IconButton iconProps={{ iconName: item.iconName, style: styles.appIcons }} title={item.label} ariaLabel={item.label} style={styles.appLauncherButton} onClick={onClickIconButton.bind(this)} />
                        </Fluent.StackItem>
                      )
                    })
                  }
                </Fluent.Stack>
              </Fluent.Panel>
            </Fluent.Stack.Item>
          </Fluent.Stack>
          <div style={styles.divContent}>
            <Fluent.Stack styles={styles.stackBody}>
              <Fluent.Stack.Item styles={styles.stackItemBody}>
                <React.Suspense fallback="Loading...">
                  <ContentComponent />
                </React.Suspense>
              </Fluent.Stack.Item>
            </Fluent.Stack>
            <div style={styles.copyright}>
              Licensed under Ms-PL
            </div>
          </div>
        </div>

      </Fluent.ThemeProvider>
    </React.Fragment>
  );
};
export default App;
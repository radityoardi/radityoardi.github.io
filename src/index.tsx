import React from 'react';
import ReactDOM from 'react-dom';
import * as Fluent from '@fluentui/react';
import './index.scss';
import App from './App';
import * as styles from './App.styles';
import reportWebVitals from './reportWebVitals';
import * as Router from 'react-router-dom';
import * as MSALBrowser from '@azure/msal-browser';
import * as MSALReact from '@azure/msal-react';
import * as Configs from './components/configs/config';


const msalInstance = new MSALBrowser.PublicClientApplication(Configs.config.msal.msalConfig);

ReactDOM.render(
  <React.StrictMode>
    <Fluent.ThemeProvider theme={styles.appTheme}>
      <Router.HashRouter>
        <MSALReact.MsalProvider instance={msalInstance}>
          <App />
        </MSALReact.MsalProvider>
      </Router.HashRouter>
    </Fluent.ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

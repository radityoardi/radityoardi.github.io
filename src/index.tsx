import React from 'react';
import ReactDOM from 'react-dom';
import * as Fluent from '@fluentui/react';
import './index.scss';
import App from './App';
import * as styles from './App.styles';
import reportWebVitals from './reportWebVitals';
import * as Router from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Fluent.ThemeProvider theme={styles.appTheme}>
      <Router.BrowserRouter>
        <App />
      </Router.BrowserRouter>
    </Fluent.ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

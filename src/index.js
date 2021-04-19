import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1381B9'
    },
    secondary: {
      main: '#fff'
    }
  },
  typography: {
    h1: {
      fontFamily: 'Ubuntu'
    },
    h2: {
      fontFamily: 'Ubuntu'
    },
    h3: {
      fontFamily: 'Ubuntu'
    },
    h4: {
      fontFamily: 'Ubuntu'
    },
    h5: {
      fontFamily: 'Ubuntu'
    },
    h6: {
      fontFamily: 'Ubuntu'
    },
    subtitle1: {
      fontFamily: 'verdana'
    },
    body1: {
      fontFamily: 'verdana'
    },
    body2: {
      fontFamily: 'verdana'
    },
    caption: {
      fontFamily: 'verdana'
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

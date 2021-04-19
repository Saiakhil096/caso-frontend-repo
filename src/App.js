import React from 'react';
import * as Sentry from '@sentry/browser';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Dashboard from './dashboard/Dashboard';

function App() {
  Sentry.init({ dsn: 'https://54c338f32527403a8648f6b75e5ab5cd@o395506.ingest.sentry.io/5247413' });

  const [open, setOpen] = React.useState(false);
  const [messageKey, setMessageKey] = React.useState(null);
  const [messageText, setMessageText] = React.useState('');
  const [messageType, setMessageType] = React.useState('');

  const handleShowMessage = (text, type) => {
    setMessageKey(new Date().getTime());

    if (text === 'Error undefined: undefined') {
      setMessageText('You do not have permission to access this App');
      setMessageType(type);
      setOpen(true);
    } else {
      setMessageText(text);
      setMessageType(type);
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dashboard onMessage={handleShowMessage} />
      <Snackbar key={messageKey} open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={messageType}>
          {messageText}
        </MuiAlert>
      </Snackbar>
    </React.Fragment>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';

import AppProvider from '@hooks/index';
import GlobalStyle from './styles/global';

function App() {
  return (
    <AppProvider>
      <Router>
        <GlobalStyle />
        <Routes />
      </Router>
    </AppProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';

import AppProvider from '@hooks/index';
import AuthProvider from '@contexts/AuthContext';
import GlobalStyle from './styles/global';

function App() {
  return (
    <Router>
      <AppProvider>
        <AuthProvider>
          <GlobalStyle />
          <Routes />
        </AuthProvider>
      </AppProvider>
    </Router>
  );
}

export default App;

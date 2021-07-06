import React, { FC } from 'react';

import { SnackbarProvider } from './useSnackbar';

const AppProvider: FC = ({ children }) => {
  return (
    <SnackbarProvider>
      {children}
    </SnackbarProvider>
  );
};

export default AppProvider;
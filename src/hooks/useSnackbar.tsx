import React, { FC, useState, useEffect, createContext, useContext } from 'react';

import Snackbar from '@material-ui/core/Snackbar';

type SnackbarMessage = {
  id: number;
  message: string;
}

type SnackbarContextData = {
  addSnackbar(message: string): void;
  // removeSnackbar(id: number): void;
}

const SnackbarContext = createContext<SnackbarContextData>({} as SnackbarContextData);

const SnackbarProvider: FC = (props) => {
  const { children } = props;

  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [activeSnackbar, setActiveSnackbar] = useState<SnackbarMessage | null>(null);

  useEffect(() => {
    if (snackbars.length && !activeSnackbar) {
      setActiveSnackbar({ ...snackbars[0] });
      setSnackbars((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackbars.length && activeSnackbar && open) {
      setOpen(false);
    }
  }, [snackbars, open, activeSnackbar]);

  const addSnackbar = (message: string) => {
    setSnackbars((prev) => [...prev, { id: Date.now(), message }]);
  }

  // const removeSnackbar = ()

  return (
    <SnackbarContext.Provider value={{ addSnackbar }}>
      {children}
      <Snackbar
        key={activeSnackbar ? activeSnackbar.id : null}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        onExited={() => setActiveSnackbar(null)}
        message={activeSnackbar ? activeSnackbar.message : null}
      />
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => {
  return useContext(SnackbarContext);
}

export { SnackbarProvider, useSnackbar };
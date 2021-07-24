import React, { FC, useRef, useEffect, useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import MaterialAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';

type SalesSearchBarProps = {
  open: boolean;
  value: string;
  onClose(): void;
  onSubmit?(value: string): void;
  onClear?(): void;
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  toolbar: {
    paddingLeft: 0,
    paddingRight: theme.spacing(1),
    zIndex: theme.zIndex.appBar + 1
  },
  input: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    color: '#fff',
    background: '#0002'
  },
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0.5),
    paddingLeft: 0,
    cursor: 'pointer',
    background: '#0002',
    border: 'none'
  }
}));

const SalesSearchBar: FC<SalesSearchBarProps> = (props) => {
  const { open, value, onClose, onSubmit, onClear } = props;

  const classes = useStyles();

  const inputRef = useRef<any>(null);

  const [_value, setValue] = useState(value);

  const close = () => {
    onClose();
  };

  const clearValue = () => {
    // inputRef.current.value = '';
    setValue('');
    inputRef.current.focus();

    if (onClear) onClear();
  };

  useEffect(() => {
    const input = inputRef.current;

    const handleKeydown = (e: any) => {
      if (e.keyCode === 13) {
        setValue(input.value);
        if (onSubmit) onSubmit(input.value);
        input.blur();
      }
    };

    if (inputRef.current) {
      input.addEventListener('keydown', handleKeydown);
    }

    return () => {
      if (input) input.removeEventListener('keydown', handleKeydown);
    }
  }, [inputRef, onSubmit, setValue]);

  return open ? (
    <MaterialAppBar elevation={0}>
      <Toolbar variant="dense" className={classes.toolbar}>
        <IconButton onClick={close}>
          <ArrowBackIcon htmlColor="#fff" />
        </IconButton>

        <Input
          type="search"
          value={_value}
          inputRef={inputRef}
          autoFocus
          disableUnderline
          className={classes.input}
          placeholder="Pesquisar"
          onChange={(e) => setValue(e.target.value)}
        />

        {_value && (
          <button className={classes.clearButton} onClick={clearValue}>
            <CloseIcon htmlColor="#fff" />
          </button>
        )}
      </Toolbar>
    </MaterialAppBar>
  ) : null;
};

export default SalesSearchBar;
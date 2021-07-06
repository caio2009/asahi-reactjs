import React, { FC } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

type ProgressBackdropProps = {
  open: boolean;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

const ProgressBackdrop: FC<ProgressBackdropProps> = (props) => {
  const { open } = props;

  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default ProgressBackdrop;
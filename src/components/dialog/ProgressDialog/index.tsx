import React, { FC } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

type ProgressDialogProps = {
  open: boolean;
  text: string;
  onClose?(): void;
}

const ProgressDialog: FC<ProgressDialogProps> = (props) => {
  const { open, text, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Grid container>
          <Grid item xs={4}>
            <CircularProgress />
          </Grid>
          <Grid item xs={8}>
            <DialogContentText>{text}</DialogContentText>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressDialog;
import React, { FC, useState, useEffect, useRef } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText'

type AlertDialogProps = {
  message: string;
  onConfirmation(): void;
}

const AlertDialog: FC<AlertDialogProps> = (props) => {
  const { message, onConfirmation } = props;

  const dialogRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(true);

  const closeDialog = () => {
    setOpen(false);
  };

  const handleConfirmation = () => {
    onConfirmation();
    closeDialog();
  };

  useEffect(() => {
    // The parent node of this component
    // let parentNode: Node | null = null;

    // console.log(dialogRef.current);

    // if (dialogRef.current) {
    //   parentNode = dialogRef.current.parentNode;
    // }

    return () => {
      // When this component get unmounted, we need to remove the component's parent node
      // The parent of this component's parent is the body element
      // if (parentNode && parentNode.parentNode) {
      //   parentNode.parentNode.removeChild(parentNode);
      // }
      document.getElementById('alert_dialog_container')?.remove();
    }
  }, [open, dialogRef]);

  return open ? (
    <Dialog ref={dialogRef} open={true} onClose={closeDialog}>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={closeDialog}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleConfirmation}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  ) : null;
};

export default AlertDialog;
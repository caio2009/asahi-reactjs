import ReactDOM from 'react-dom';

import AlertDialog from '@components/dialog/AlertDialog';

type AlertDialogData = {
  message: string;
  onConfirmation(): void;
}

export const alertDialog = (data: AlertDialogData) => {
  const { message, onConfirmation } = data;

  const div = document.createElement('div');
  div.id = 'alert_dialog_container';
  document.body.appendChild(div);

  ReactDOM.render(
    <AlertDialog message={message} onConfirmation={onConfirmation} />,
    div
  );
};
import React, { FC, useEffect, useState, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';
import { alertDialog } from '@hooks/useAlertDialog';

import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import AppBar from '@components/base/AppBar';
import ProgressDialog from '@components/dialog/ProgressDialog';
import FlexBox from '@components/base/FlexBox';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';
import { format as formatDate } from 'date-fns';
import ProgressBackdrop from '@components/base/ProgressBackdrop';

type SaleDetailsDialogProps = {
  saleId?: string | null;
  editable?: boolean;
  onClose(): void;
  onEdit?(): void;
  onDelete?(id: string): void;
  onPaymenStatusChange?(sale: Sale): void;
};

type Sale = {
  id: string;
  date: Date;
  number: number;
  totalValue: number;
  paymentStatus: string;
  deliveryStatus: string;
  clientName: string;
  saleItems: Array<{
    unitPrice: number;
    quantity: number;
    harvest: {
      date: Date;
      ruralProperty: {
        name: string;
      };
      field: {
        name: string;
      };
      cultivation: {
        name: string;
      };
      classification: {
        name: string;
      };
      unit: {
        name: string;
        abbreviation: string;
      }
    }
  }>;
};

const deliveryStatus: { [key: string]: string } = {
  dispatched: 'Despachado',
  waiting: 'Esperando'
};

const paymentStatus: { [key: string]: string } = {
  paid: 'Pago',
  pending: 'N??o Pago'
};

const SaleDetailsDialog: FC<SaleDetailsDialogProps> = (props) => {
  const {
    saleId,
    editable = true,
    onClose,
    onEdit,
    onDelete,
    onPaymenStatusChange
  } = props;

  const history = useHistory();
  const { path } = useRouteMatch();
  const { addSnackbar } = useSnackbar();

  const [sale, setSale] = useState<Sale | null>(null);

  const [deleteProgress, setDeleteProgress] = useState(false);

  const getSale = useCallback(() => {
    if (saleId) {
      api.get(`sales/${saleId}`)
        .then((res) => {
          setSale(res.data);
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
        });
    }
    // eslint-disable-next-line
  }, [saleId]);

  const goBack = () => {
    handleOnClose();
  };

  const editSale = () => {
    handleOnClose();
    if (onEdit) onEdit();
  };

  const deleteSale = () => {
    alertDialog({
      message: 'Tem certeza que quer apagar essa venda?',
      onConfirmation: () => {
        setDeleteProgress(true);
        api.delete(`/sales/${saleId}`)
          .then(() => {
            addSnackbar('Venda apagada com sucesso!');
            handleOnClose();
            if (onDelete && saleId) onDelete(saleId);
          })
          .catch((err) => handleAxiosError(err, addSnackbar))
          .finally(() => setDeleteProgress(false));
      }
    });
  };

  const handleOnClose = () => {
    onClose();
    setSale(null);
  };

  const handlePaymentStatusChange = () => {
    if (sale) {
      const paymentStatus = sale.paymentStatus === 'paid' ? 'pending' : 'paid';

      api.patch(`sales/${sale.id}/payment-status`, { paymentStatus })
        .then(() => {
          setSale((prev) => prev ? ({
            ...prev,
            paymentStatus
          }) : null);

          if (onPaymenStatusChange) onPaymenStatusChange({ ...sale, paymentStatus });
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
        });
    }
  }

  useEffect(() => {
    const unblock = history.block((location, action) => {
      if (action === 'POP') {
        handleOnClose();
        return undefined;
      }
    });

    return () => unblock();
    // eslint-disable-next-line
  }, [history, onClose]);

  useEffect(() => {
    history.replace(path);
  }, [history, path]);

  useEffect(() => {
    getSale();
  }, [getSale]);

  return (
    <Dialog
      fullScreen
      open={true}
      onClose={handleOnClose}
    >
      <ProgressBackdrop open={!sale} />

      <AppBar
        title="Detahes da Venda"
        backButton
        goBack={goBack}
        moreOptions={editable && [
          <MenuItem dense key={0} onClick={editSale}>
            Editar
          </MenuItem>,
          <MenuItem dense key={1} onClick={deleteSale}>
            Deletar
          </MenuItem>
        ]}
      />

      <Box mt={12} mb={4}>
        <FlexBox>
          <Button
            variant="outlined"
            color={sale?.paymentStatus === 'paid' ? 'secondary' : 'primary'}
            onClick={handlePaymentStatusChange}
          >
            {sale?.paymentStatus === 'paid' ? 'Mudar para n??o pago' : 'Mudar para pago'}
          </Button>
        </FlexBox>

        <br />

        <Box mx={2}>
          <Typography variant="h6">Dados da Venda</Typography>
        </Box>
        <Divider />

        <br />

        {sale && (
          <Box mx={2}>
            <Grid container>
              <Grid item xs={4}>
                <Typography>N?? da Venda</Typography>
                <Typography color="textSecondary">{sale.number}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>Data</Typography>
                <Typography color="textSecondary">{formatDate(new Date(sale.date), 'dd/MM/yyyy')}</Typography>
              </Grid>
            </Grid>

            <br />

            <Box>
              <Typography>Cliente</Typography>
              <Typography color="textSecondary">{sale.clientName}</Typography>
            </Box>

            <br />

            <Grid container>
              <Grid item xs={4}>
                <Typography>Total</Typography>
                <Typography color="textSecondary">{sale.totalValue}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>Pagamento</Typography>
                <Typography color="textSecondary">{paymentStatus[sale.paymentStatus]}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>Entrega</Typography>
                <Typography color="textSecondary">{deliveryStatus[sale.deliveryStatus]}</Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        <br />
        <br />

        <Box mx={2}>
          <Typography variant="h6">Itens da Venda</Typography>
        </Box>
        <Divider />

        {sale?.saleItems && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Quantidade</TableCell>
                <TableCell align="right">Pre??o</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sale.saleItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="caption">{item.harvest.ruralProperty.name} {'>'} {item.harvest.field.name}</Typography>
                    <Typography variant="body2">{item.harvest.cultivation.name} {item.harvest.classification.name}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {item.quantity}
                      <Typography variant="caption" color="textSecondary" component="span" style={{ marginLeft: 4 }}>
                        {item.harvest.unit.abbreviation}
                      </Typography>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{item.unitPrice}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      <ProgressDialog
        open={deleteProgress}
        text="Aguarde. Apagando venda."
        onClose={() => setDeleteProgress(false)}
      />
    </Dialog>
  );
};

export default SaleDetailsDialog;
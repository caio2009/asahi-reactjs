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

import AppBar from '@components/base/AppBar';
import ProgressDialog from '@components/dialog/ProgressDialog';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';
import { format as formatDate } from 'date-fns';

type SaleDetailsDialogProps = {
  open: boolean;
  saleId?: string | null;
  onClose(): void;
  onEdit(): void;
  onDelete(id: string): void;
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
  pending: 'Não Pago'
};

const SaleDetailsDialog: FC<SaleDetailsDialogProps> = (props) => {
  const { open, saleId, onClose, onEdit, onDelete } = props;

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
    onClose();
  }

  const editSale = () => {
    onClose();
    onEdit();
  };

  const deleteSale = () => {
    alertDialog({
      message: 'Tem certeza que quer apagar essa venda?',
      onConfirmation: () => {
        setDeleteProgress(true);
        api.delete(`/sales/${saleId}`)
          .then(() => {
            addSnackbar('Venda apagada com sucesso!');
            onClose();
            if (saleId) onDelete(saleId);
          })
          .catch((err) => handleAxiosError(err, addSnackbar))
          .finally(() => setDeleteProgress(false));
      }
    });
  };

  useEffect(() => {
    if (open) {
      const unblock = history.block((location, action) => {
        if (action === 'POP') {
          onClose();
          return open ? false : undefined;
        }
      });

      return () => unblock();
    }
    // eslint-disable-next-line
  }, [history, onClose]);

  useEffect(() => {
    history.replace(path);
  }, [history, path]);

  useEffect(() => {
    getSale();
  }, [getSale]);

  return open ? (
    <Dialog
      fullScreen
      open={true}
      onClose={onClose}
    >
      <AppBar
        title="Detahes da Venda"
        backButton
        goBack={goBack}
        moreOptions={[
          <MenuItem dense key={0} onClick={editSale}>
            Editar
          </MenuItem>,
          <MenuItem dense key={1} onClick={deleteSale}>
            Deletar
          </MenuItem>
        ]}
      />

      <Box mt={8} mb={4}>
        <Box mx={2}>
          <Typography variant="h6">Dados da Venda</Typography>
        </Box>
        <Divider />

        <br />

        {sale && (
          <Box mx={2}>
            <Grid container>
              <Grid item xs={4}>
                <Typography>Nº da Venda</Typography>
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
                <TableCell align="right">Preço</TableCell>
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
  ) : null;
};

export default SaleDetailsDialog;
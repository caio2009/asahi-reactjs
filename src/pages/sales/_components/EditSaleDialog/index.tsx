import React, { FC, useState, useCallback, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';

import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AppBar from '@components/base/AppBar';
import SaleForm from '../SaleForm';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';

type EditSaleDialogProps = {
  open: boolean;
  saleId?: string | null;
  onClose(): void;
  onEdited(): void;
};

type Sale = {
  id: string;
  date: Date;
  clientName: string;
  paymentStatus: string;
  deliveryStatus: string;
  saleItems: Array<{
    id: string;
    unitPrice: number;
    quantity: number;
    harvest: {
      id: string;
      date: Date;
      inStock: number;
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
      };
    };
  }>;
};


const EditSaleDialog: FC<EditSaleDialogProps> = (props) => {
  const { open, saleId, onClose, onEdited } = props;

  const history = useHistory();
  const { path } = useRouteMatch();
  const { addSnackbar } = useSnackbar();

  const [sale, setSale] = useState<Sale | null>(null);

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
  };

  const handleSaleEdited = () => {
    onClose();
    onEdited();
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
        title="Editar Venda"
        goBack={goBack}
        extra={
          <>
            <Button type="submit" form="saleForm" color="inherit">
              Salvar
            </Button>
          </>
        }
      />

      <Box mt={10}>
        {sale && (
          <SaleForm
            saleId={saleId || undefined}
            initialValues={{
              date: sale.date,
              clientName: sale.clientName,
              paymentStatus: sale.paymentStatus,
              deliveryStatus: sale.deliveryStatus,
              saleItems: sale.saleItems
            }}
            onEdited={handleSaleEdited}
          />
        )}
      </Box>
    </Dialog>
  ) : null;
};

export default EditSaleDialog;
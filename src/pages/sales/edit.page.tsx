import React, { FC, useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AppBar from '@components/base/AppBar';
import SaleForm from './_components/SaleForm';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';

type Params = {
  id: string;
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

const EditSalePage: FC = () => {
  const history = useHistory();
  const { id } = useParams() as Params;
  const { addSnackbar } = useSnackbar();

  const [sale, setSale] = useState<Sale | null>(null);

  const getSale = useCallback(() => {
    api.get(`sales/${id}`)
      .then((res) => {
        setSale(res.data);
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
      })
    // eslint-disable-next-line
  }, [id]);

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    getSale();
  }, [getSale]);

  return (
    <div>
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
            saleId={id}
            initialValues={{
              date: sale.date,
              clientName: sale.clientName,
              paymentStatus: sale.paymentStatus,
              deliveryStatus: sale.deliveryStatus,
              saleItems: sale.saleItems
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default EditSalePage;
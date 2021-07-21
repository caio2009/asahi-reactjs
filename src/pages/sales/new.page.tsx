import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AppBar from '@components/base/AppBar';
import SaleForm from './_components/SaleForm';

const NewSalePage: FC = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <AppBar
        title="Nova Venda"
        goBack={goBack}
        extra={
          <>
            <Button type="submit" form="saleForm" color="inherit">
              Criar
            </Button>
          </>
        }
      />

      <Box mt={10}>
        <SaleForm />
      </Box>
    </div>
  );
};

export default NewSalePage;
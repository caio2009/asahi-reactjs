import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import SalesList from './_components/SalesList';

const DispatchSalesPage: FC = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <AppBar
        title="Expedição de Vendas"
        backButton
        goBack={goBack}
      />

      <Box mt={10}>
        <SalesList />
      </Box>
    </div>
  );
};

export default DispatchSalesPage;
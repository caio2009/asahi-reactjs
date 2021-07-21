import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AddIcon from '@material-ui/icons/Add';

import AppBar from '@components/base/AppBar';
import Fab from '@components/base/Fab';
import SalesList from './_components/SalesList';

const SalesPage: FC = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const newSale = () => {
    history.push('/sales/new');
  };

  return (
    <div>
      <AppBar
        title="Vendas"
        backButton
        goBack={goBack}
      />

      <Box mt={6}>
        <SalesList />
      </Box>

      <Fab bottom={8} color="primary" onClick={newSale}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default SalesPage;
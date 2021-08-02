import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import StockItemsList from './_components/StockItemsList';

const StockPage: FC = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <AppBar
        title="Estoque"
        backButton
        goBack={goBack}
      />

      <Box mt={8}>
        <StockItemsList />
      </Box>
    </div>
  );
};

export default StockPage;
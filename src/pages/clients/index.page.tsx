import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AddOutlined from '@material-ui/icons/AddOutlined';

import AppBar from '@components/base/AppBar';
import Fab from '@components/base/Fab';
import UnitsList from './_components/ClientsList';

const ClientsPage: FC = () => {
  const history = useHistory();

  const newUnit = () => {
    history.push('/clients/new');
  };

  const goBack = () => {
    history.goBack();
  }

  return (
    <div>
      <AppBar title="Clientes" goBack={goBack} />

      <Box mt={6}>
        <UnitsList />
      </Box>

      <Fab bottom={8} color="primary" onClick={newUnit}>
        <AddOutlined />
      </Fab>
    </div>
  );
};

export default ClientsPage;
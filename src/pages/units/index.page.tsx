import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AddIcon from '@material-ui/icons/Add';

import AppBar from '@components/base/AppBar';
import Fab from '@components/base/Fab';
import UnitsList from './_components/UnitsList';

const UnitsPage: FC = () => {
  const history = useHistory();

  const newUnit = () => {
    history.push('/units/new');
  };

  const goBack = () => {
    history.goBack();
  }

  return (
    <div>
      <AppBar title="Unidades" goBack={goBack} />

      <Box mt={8}>
        <UnitsList />
      </Box>

      <Fab bottom={8} color="primary" onClick={newUnit}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default UnitsPage;
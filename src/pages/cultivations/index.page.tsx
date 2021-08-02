import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AddIcon from '@material-ui/icons/Add';

import AppBar from '@components/base/AppBar';
import Fab from '@components/base/Fab';
import UnitsList from './_components/CultivationsList';

const CultivationsPage: FC = () => {
  const history = useHistory();

  const newUnit = () => {
    history.push('/cultivations/new');
  };

  const goBack = () => {
    history.goBack();
  }

  return (
    <div>
      <AppBar title="Culturas" goBack={goBack} />

      <Box mt={8}>
        <UnitsList />
      </Box>

      <Fab bottom={8} color="primary" onClick={newUnit}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default CultivationsPage;
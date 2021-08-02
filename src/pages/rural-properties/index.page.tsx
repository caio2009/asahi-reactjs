import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import AppBar from '@components/base/AppBar';
import Fab from '@components/base/Fab';
import RuralPropertiesList from './_components/RuralPropertiesList';

const RuralPropertiesPage: FC = () => {
  const history = useHistory();

  const newRuralProperty = () => {
    history.push('/rural-properties/new');
  };

  return (
    <div>
      <AppBar title="Propriedades Rurais" backButton={false} />

      <Box pt={2} mx={2} mb={3}>
        <Typography>
          Gerencie suas Propriedades Rurais
        </Typography>
        <Typography variant="caption">
          Clique em uma propriedade rural para fazer o seu gerenciamento.
        </Typography>
      </Box>

      <Divider />

      <RuralPropertiesList />

      <Fab bottom={68} color="primary" onClick={newRuralProperty}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default RuralPropertiesPage;
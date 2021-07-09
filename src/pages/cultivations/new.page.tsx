import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import CultivationForm from './_components/CultivationForm';

const NewCultivationtPage: FC = () => {
  const history = useHistory();

  const goBack = () => {
    history.push('/cultivations');
  };

  return (
    <div>
      <AppBar
        title="Nova Cultura"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        <CultivationForm goBack={goBack} />
      </Box>
    </div>
  );
};

export default NewCultivationtPage;
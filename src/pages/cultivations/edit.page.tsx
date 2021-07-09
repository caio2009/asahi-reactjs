import React, { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import Cultivation from './_components/CultivationForm';

type Params = {
  id: string;
}

const EditCultivationPage: FC = () => {
  const history = useHistory();
  const { id } = useParams() as Params;

  const goBack = () => {
    history.push('/cultivations');
  };

  return (
    <div>
      <AppBar
        title="Editar Cultura"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        <Cultivation goBack={goBack} cultivationId={id} />
      </Box>
    </div>
  );
};

export default EditCultivationPage;
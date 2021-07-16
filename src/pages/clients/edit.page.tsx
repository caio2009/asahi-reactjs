import React, { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import ClientForm from './_components/ClientForm';

type Params = {
  id: string;
}

const EditClientPage: FC = () => {
  const history = useHistory();
  const { id } = useParams() as Params;

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <AppBar
        title="Editar Cliente"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        <ClientForm goBack={goBack} clientId={id} />
      </Box>
    </div>
  );
};

export default EditClientPage;
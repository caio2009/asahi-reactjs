import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import ClientForm from './_components/ClientForm';

const NewClienttPage: FC = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <AppBar
        title="Novo Cliente"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        <ClientForm goBack={goBack} />
      </Box>
    </div>
  );
};

export default NewClienttPage;
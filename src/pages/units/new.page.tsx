import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import UnitForm from './_components/UnitForm';

const NewUnitPage: FC = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <AppBar
        title="Nova Unidade"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        <UnitForm goBack={goBack} />
      </Box>
    </div>
  );
};

export default NewUnitPage;
import React, { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import UnitForm from './_components/UnitForm';

type Params = {
  id: string;
}

const EditUnitPage: FC = () => {
  const history = useHistory();
  const { id } = useParams() as Params;

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <AppBar
        title="Editar Unidade"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        <UnitForm goBack={goBack} unitId={id} />
      </Box>
    </div>
  );
};

export default EditUnitPage;
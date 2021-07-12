import React, { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import RuralPropertyForm from './_components/RuralPropertyForm';

type Params = {
  id: string;
}

const EditRuralPropertyPage: FC = () => {
  const history = useHistory();
  const { id } = useParams() as Params;

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <AppBar
        title="Editar Propriedade Rural"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        <RuralPropertyForm goBack={goBack} ruralPropertyId={id} />
      </Box>
    </div>
  );
};

export default EditRuralPropertyPage;
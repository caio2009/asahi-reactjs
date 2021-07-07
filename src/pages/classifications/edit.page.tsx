import React, { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import UnitForm from './_components/ClassificationForm';

type Params = {
  id: string;
}

const EditClassificationPage: FC = () => {
  const history = useHistory();
  const { id } = useParams() as Params;

  const goBack = () => {
    history.push('/classifications');
  };

  return (
    <div>
      <AppBar
        title="Editar Classificação"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        <UnitForm goBack={goBack} classificationId={id} />
      </Box>
    </div>
  );
};

export default EditClassificationPage;
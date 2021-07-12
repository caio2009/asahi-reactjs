import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import ClassificationForm from './_components/ClassificationForm';

const NewClassificationtPage: FC = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <AppBar
        title="Nova Classificação"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        <ClassificationForm goBack={goBack} />
      </Box>
    </div>
  );
};

export default NewClassificationtPage;
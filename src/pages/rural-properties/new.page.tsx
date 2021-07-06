import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import RuralPropertyForm from './_components/RuralPropertyForm';

const NewRuralPropertyPage: FC = () => {
  const history = useHistory();

  const goBack = () => {
    history.push('/rural-properties');
  };

  return (
    <div>
      <AppBar
        title="Nova Propriedade Rural"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        <RuralPropertyForm goBack={goBack} />
      </Box>
    </div>
  );
};

export default NewRuralPropertyPage;
import React, { FC, useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import ProgressBackdrop from '@components/base/ProgressBackdrop'; 
import FieldForm from './_components/FieldForm';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';

type Params = {
  ruralPropertyId: string;
}

type RuralProperty = {
  id: string;
  name: string;
}

const NewFieldPage: FC = () => {
  const history = useHistory();
  const { ruralPropertyId } = useParams() as Params;
  const { addSnackbar } = useSnackbar();

  const [ruralProperty, setRuralProperty] = useState<RuralProperty | null>(null);

  const [backdrop, setBackdrop] = useState(true);

  const getRuralProperty = useCallback(() => {
    api.get(`rural-properties/${ruralPropertyId}`)
      .then((res) => {
        setRuralProperty(res.data);
      })
      .catch((err) => handleAxiosError(err, addSnackbar))
      .finally(() => setBackdrop(false));
      // eslint-disable-next-line
  }, [ruralPropertyId]);

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    getRuralProperty();
  }, [getRuralProperty]);

  return (
    <div>
      <ProgressBackdrop open={backdrop} />

      <AppBar
        title={ruralProperty ? ruralProperty.name : ''}
        subTitle="Novo Talhão"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        <FieldForm 
          goBack={goBack}
          initialValues={{ ruralPropertyId }}
        />
      </Box>
    </div>
  );
};

export default NewFieldPage;
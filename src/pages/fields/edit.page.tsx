import React, { FC, useCallback, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';

import Box from '@material-ui/core/Box';

import ProgressBackdrop from '@components/base/ProgressBackdrop';
import AppBar from '@components/base/AppBar';
import FieldForm from './_components/FieldForm';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';

type Params = {
  id: string;
}

type Field = {
  id: string;
  name: string;
  ruralProperty: {
    id: string;
    name: string;
  };
  cultivation: {
    id: string;
  };
}

const EditFieldPage: FC = () => {
  const history = useHistory();
  const { id } = useParams() as Params;
  const { addSnackbar } = useSnackbar();

  const [field, setField] = useState<Field>();

  const [backdrop, setBackdrop] = useState(true);

  const getField = useCallback(() => {
    api.get(`fields/${id}`)
      .then((res) => {
        setField(res.data);
      })
      .catch((err) => handleAxiosError(err, addSnackbar))
      .then(() => setBackdrop(false));
    // eslint-disable-next-line
  }, [id]);

  const goBack = () => {
    history.goBack();
  }

  useEffect(() => {
    getField()
  }, [getField]);

  return (
    <div>
      <ProgressBackdrop open={backdrop} />

      <AppBar
        title={field ? field.ruralProperty.name : ''}
        subTitle="Editar Talhão"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        {field && (
          <FieldForm
            goBack={goBack}
            fieldId={id}
            initialValues={{
              name: field.name,
              ruralPropertyId: field.ruralProperty.id,
              cultivationId: field.cultivation.id
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default EditFieldPage;
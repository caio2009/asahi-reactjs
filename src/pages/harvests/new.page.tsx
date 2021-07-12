import React, { FC, useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import ProgressBackdrop from '@components/base/ProgressBackdrop';
import HarvestForm from './_components/HarvestForm';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';

type Params = {
  fieldId: string;
};

type Field = {
  id: string;
  name: string;
  ruralProperty: {
    id: string;
    name: string;
  };
  cultivation: {
    id: string;
    name: string;
  };
};

const NewHarvestPage: FC = () => {
  const history = useHistory();
  const { fieldId } = useParams() as Params;
  const { addSnackbar } = useSnackbar();

  const [field, setField] = useState<Field | null>(null);

  const [backdrop, setBackdrop] = useState(true);

  const getField = useCallback(() => {
    api.get(`fields/${fieldId}`)
      .then((res) => {
        setField(res.data);
      })
      .catch((err) => handleAxiosError(err, addSnackbar))
      .finally(() => setBackdrop(false));
    // eslint-disable-next-line
  }, [fieldId]);

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    getField();
  }, [getField]);

  return (
    <div>
      <ProgressBackdrop open={backdrop} />

      <AppBar
        title={field ? `${field.ruralProperty.name} > ${field.name}` : ''}
        subTitle="Nova Colheita"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        {field && (
          <HarvestForm
            goBack={goBack}
            initialValues={{
              fieldId,
              cultivationName: field.cultivation.name
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default NewHarvestPage;
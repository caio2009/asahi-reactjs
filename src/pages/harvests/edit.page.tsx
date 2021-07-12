import React, { FC, useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';

import Box from '@material-ui/core/Box';

import AppBar from '@components/base/AppBar';
import ProgressBackdrop from '@components/base/ProgressBackdrop';
import HarvestForm from './_components/HarvestForm';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';
import { format as formatDate } from 'date-fns';

type Params = {
  id: string;
};

type Harvest = {
  id: string;
  date: Date;
  quantity: number;
  ruralProperty: {
    name: string;
  };
  field: {
    id: string;
    name: string;
  };
  cultivation: {
    name: string;
  };
  classification: {
    id: string;
  };
  unit: {
    id: string;
  };
};

const EditHarvestPage: FC = () => {
  const history = useHistory();
  const { id } = useParams() as Params;
  const { addSnackbar } = useSnackbar();

  const timezoneOffset = new Date().getTimezoneOffset();

  const [harvest, setHarvest] = useState<Harvest | null>(null);

  const [backdrop, setBackdrop] = useState(true);

  const getHarvest = useCallback(() => {
    api.get(`harvests/${id}`)
      .then((res) => {
        setHarvest(res.data);
      })
      .catch((err) => handleAxiosError(err, addSnackbar))
      .finally(() => setBackdrop(false));
    // eslint-disable-next-line
  }, [id]);

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    getHarvest();
  }, [getHarvest]);

  return (
    <div>
      <ProgressBackdrop open={backdrop} />

      <AppBar
        title={harvest ? `${harvest.ruralProperty.name} > ${harvest.field.name}` : ''}
        subTitle="Editar Colheita"
        goBack={goBack}
      />

      <Box mt={10} mx={1}>
        {harvest && (
          <HarvestForm
            harvestId={id}
            goBack={goBack}
            initialValues={{
              date: formatDate(new Date(new Date(harvest.date).getTime() + (timezoneOffset * 60 * 1000)), 'yyyy-MM-dd'),
              quantity: harvest.quantity,
              fieldId: harvest.field.id,
              classificationId: harvest.classification.id,
              unitId: harvest.unit.id,
              cultivationName: harvest.cultivation.name
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default EditHarvestPage;
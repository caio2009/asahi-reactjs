import React, { FC, useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from '@hooks/useSnackbar';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import ProgressBackdrop from '@components/base/ProgressBackdrop';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';

type UnitFormProps = {
  unitId?: string;
  goBack(): void;
}

type Inputs = {
  name: string;
  abbreviation: string;
}

const UnitForm: FC<UnitFormProps> = (props) => {
  const { unitId, goBack } = props;

  const history = useHistory();
  const { control, handleSubmit, setValue } = useForm<Inputs>();
  const { addSnackbar } = useSnackbar();

  const [backdrop, setBackdrop] = useState(!!unitId);

  const initForm = useCallback(() => {
    if (unitId) {
      api.get(`units/${unitId}`)
        .then(res => {
          const ruralProperty = res.data;
          setValue('name', ruralProperty.name);
          setValue('abbreviation', ruralProperty.abbreviation);
        })
        .catch((err) => handleAxiosError(err, addSnackbar))
        .finally(() => setBackdrop(false));
    }
    // eslint-disable-next-line
  }, [unitId, setValue]);

  const onSubmit = (data: Inputs) => {
    setBackdrop(true);

    if (unitId) {
      api.put(`units/${unitId}`, data)
        .then(() => {
          addSnackbar('Unidade editada com sucesso!');
          history.push('/units');
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar)
          setBackdrop(false);
        });
      return;
    }

    api.post('units', data)
      .then(() => {
        addSnackbar('Unidade criada com sucesso!');
        history.push('/units');
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar)
        setBackdrop(false);
      });
  };

  useEffect(() => {
    initForm();
  }, [initForm]);

  return (
    <div>
      <ProgressBackdrop open={backdrop} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: 'Nome é um campo obrigatório' }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <TextField
              label="Nome *"
              fullWidth
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />

        <br /><br /><br />

        <Controller
          name="abbreviation"
          control={control}
          defaultValue=""
          rules={{ required: 'Abreviação é um campo obrigatório' }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <TextField 
              label="Abreviação *" 
              fullWidth 
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null} 
            />
          )}
        />

        <br /><br /><br />

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button variant="outlined" color="secondary" fullWidth onClick={goBack}>
              Cancelar
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {unitId ? 'Salvar' : 'Criar'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default UnitForm;
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

type RuralPropertyFormProps = {
  ruralPropertyId?: string;
  goBack(): void;
}

type Inputs = {
  name: string;
  description: string;
}

const RuralPropertyForm: FC<RuralPropertyFormProps> = (props) => {
  const { ruralPropertyId, goBack } = props;

  const history = useHistory();
  const { control, handleSubmit, setValue } = useForm<Inputs>();
  const { addSnackbar } = useSnackbar();

  const [backdrop, setBackdrop] = useState(!!ruralPropertyId);

  const initForm = useCallback(() => {
    if (ruralPropertyId) {
      api.get(`rural-properties/${ruralPropertyId}`)
        .then(res => {
          const ruralProperty = res.data;
          setValue('name', ruralProperty.name);
          setValue('description', ruralProperty.description);
        })
        .catch((err) => handleAxiosError(err, addSnackbar))
        .finally(() => setBackdrop(false));
    }
    // eslint-disable-next-line
  }, [ruralPropertyId, setValue]);

  const onSubmit = (data: Inputs) => {
    setBackdrop(true);

    if (ruralPropertyId) {
      api.put(`rural-properties/${ruralPropertyId}`, data)
        .then(() => {
          addSnackbar('Propriedade rural editada com sucesso!');
          history.push('/rural-properties');
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
          setBackdrop(false);
        });
      return;
    }

    api.post('rural-properties', data)
      .then(() => {
        addSnackbar('Propriedade rural criada com sucesso!');
        history.push('/rural-properties');
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
              value={value}
              onChange={onChange}
              fullWidth
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />

        <br /><br /><br />

        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <TextField 
              label="Descrição" 
              fullWidth 
              multiline 
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
              {ruralPropertyId ? 'Salvar' : 'Criar'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default RuralPropertyForm;
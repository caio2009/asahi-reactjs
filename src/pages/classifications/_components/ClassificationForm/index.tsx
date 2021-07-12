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

type ClassificationFormProps = {
  classificationId?: string;
  goBack(): void;
}

type Inputs = {
  name: string;
}

const ClassificationForm: FC<ClassificationFormProps> = (props) => {
  const { classificationId, goBack } = props;

  const history = useHistory();
  const { control, handleSubmit, setValue } = useForm<Inputs>();
  const { addSnackbar } = useSnackbar();

  const [backdrop, setBackdrop] = useState(!!classificationId);

  const initForm = useCallback(() => {
    if (classificationId) {
      api.get(`classifications/${classificationId}`)
        .then(res => {
          const ruralProperty = res.data;
          setValue('name', ruralProperty.name);
        })
        .catch((err) => handleAxiosError(err, addSnackbar))
        .finally(() => setBackdrop(false));
    }
    // eslint-disable-next-line
  }, [classificationId, setValue]);

  const onSubmit = (data: Inputs) => {
    setBackdrop(true);

    if (classificationId) {
      api.put(`classifications/${classificationId}`, data)
        .then(() => {
          addSnackbar('Classificação editada com sucesso!');
          history.goBack();
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar)
          setBackdrop(false);
        });
      return;
    }

    api.post('classifications', data)
      .then(() => {
        addSnackbar('Classificação criada com sucesso!');
        history.goBack();
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

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button variant="outlined" color="secondary" fullWidth onClick={goBack}>
              Cancelar
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {classificationId ? 'Salvar' : 'Criar'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default ClassificationForm;
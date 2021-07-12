import React, { FC, useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from '@hooks/useSnackbar';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import ProgressBackdrop from '@components/base/ProgressBackdrop';
import FlexBox from '@components/base/FlexBox';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';

type FieldFormProps = {
  fieldId?: string;
  initialValues?: Inputs;
  goBack(): void;
};

type Cultivation = {
  id: string;
  name: string;
};

type Inputs = {
  name?: string;
  ruralPropertyId?: string;
  cultivationId?: string;
};

type LoadingProgress = {
  cultivation: boolean;
};

const FieldForm: FC<FieldFormProps> = (props) => {
  const { fieldId, initialValues, goBack } = props;

  const history = useHistory();
  const { control, handleSubmit, setValue } = useForm<Inputs>();
  const { addSnackbar } = useSnackbar();

  const [cultivations, setCultivations] = useState<Cultivation[]>([]);

  const [backdrop, setBackdrop] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    cultivation: true
  });

  const initForm = useCallback(() => {
    if (initialValues) {
      setValue('name', initialValues.name || '');
      setValue('ruralPropertyId', initialValues.ruralPropertyId || '');
      setValue('cultivationId', initialValues.cultivationId || '');
    }
    // eslint-disable-next-line
  }, [initialValues, setValue]);

  const getCultivations = useCallback(() => {
    api.get('cultivations')
      .then((res) => {
        setCultivations(res.data);
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
      })
      .finally(() => setLoadingProgress((prev) => ({ ...prev, cultivation: false })));
    // eslint-disable-next-line
  }, [])

  const onSubmit = (data: Inputs) => {
    setBackdrop(true);

    if (fieldId) {
      api.put(`fields/${fieldId}`, data)
        .then(() => {
          addSnackbar('Talhão editado com sucesso!');
          history.goBack();
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
          setBackdrop(false);
        });
      return;
    }

    api.post('fields', data)
      .then(() => {
        addSnackbar('Talhão criado com sucesso!');
        history.goBack();
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
        setBackdrop(false);
      });
  };

  useEffect(() => {
    initForm();
  }, [initForm]);

  useEffect(() => {
    getCultivations();
  }, [getCultivations])

  return (
    <div>
      <ProgressBackdrop open={backdrop} />

      {loadingProgress.cultivation ? (
        <FlexBox>
          <CircularProgress />
        </FlexBox>
      ) : (
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
            name="cultivationId"
            control={control}
            defaultValue=""
            rules={{ required: 'Cultura é um campo obrigatório' }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <FormControl
                fullWidth
                error={!!error}
              >
                <InputLabel htmlFor="cultivation-input">Cultura *</InputLabel>
                <Select
                  inputProps={{ id: 'cultivation-input' }}
                  value={value}
                  onChange={onChange}
                >
                  {cultivations.length === 0 && <MenuItem>Vazio</MenuItem>}
                  {cultivations.map(cultivation => (
                    <MenuItem key={cultivation.id} value={cultivation.id}>{cultivation.name}</MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
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
                {fieldId ? 'Salvar' : 'Criar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </div>
  );
};

export default FieldForm;
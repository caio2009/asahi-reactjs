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
import { format as formatDate } from 'date-fns';

type HarvestFormProps = {
  harvestId?: string;
  initialValues?: Inputs;
  goBack(): void;
};

type Classification = {
  id: string;
  name: string;
};

type Unit = {
  id: string;
  abbreviation: string;
};

type Inputs = {
  cultivationName?: string;
  date?: string | Date;
  quantity?: number | string;
  fieldId?: string;
  classificationId?: string;
  unitId?: string;
};

type LoadingProgress = {
  classification: boolean;
  unit: boolean;
};

const HarvestForm: FC<HarvestFormProps> = (props) => {
  const { harvestId, initialValues, goBack } = props;

  const history = useHistory();
  const { control, handleSubmit, setValue } = useForm<Inputs>();
  const { addSnackbar } = useSnackbar();

  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const [backdrop, setBackdrop] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    classification: true,
    unit: true
  });

  const initForm = useCallback(() => {
    const iv = initialValues;

    if (iv) {
      iv.cultivationName && setValue('cultivationName', iv.cultivationName);
      iv.date && setValue('date', iv.date);
      iv.quantity && setValue('quantity', iv.quantity);
      iv.fieldId && setValue('fieldId', iv.fieldId);
      iv.classificationId && setValue('classificationId', iv.classificationId);
      iv.unitId && setValue('unitId', iv.unitId);
    }
    // eslint-disable-next-line
  }, [initialValues, setValue]);

  const getClassifications = () => {
    api.get('classifications')
      .then((res) => {
        setClassifications(res.data);
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
      })
      .finally(() => setLoadingProgress((prev) => ({ ...prev, classification: false })));
  };

  const getUnits = () => {
    api.get('units')
      .then((res) => {
        setUnits(res.data);
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
      })
      .finally(() => setLoadingProgress((prev) => ({ ...prev, unit: false })));
  };

  const onSubmit = (data: Inputs) => {
    // setBackdrop(true);

    if (data.date) {
      data.date = new Date(data.date);
    }

    if (harvestId) {
      api.put(`harvests/${harvestId}`, data)
        .then(() => {
          addSnackbar('Colheita editada com sucesso!');
          history.goBack();
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
          setBackdrop(false);
        });
      return;
    }

    api.post('harvests', data)
      .then(() => {
        addSnackbar('Colheita criada com sucesso!');
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
    getClassifications();
    getUnits();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <ProgressBackdrop open={backdrop} />

      {loadingProgress.classification || loadingProgress.unit ? (
        <FlexBox>
          <CircularProgress />
        </FlexBox>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="cultivationName"
            control={control}
            defaultValue=""
            render={({ field: { value, onChange }, fieldState: { error }}) => (
              <TextField
                label="Cultura"
                fullWidth
                InputProps={{ readOnly: true }}
                value={value}
                onChange={onChange}
              />
            )}
          />

          <br /><br /><br />

          <Controller
            name="date"
            control={control}
            defaultValue={formatDate(new Date(), 'yyyy-MM-dd')}
            rules={{ required: 'Data é um campo obrigatório' }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                label="Data *"
                type="date"
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
              <Controller
                name="classificationId"
                control={control}
                defaultValue=""
                rules={{ required: 'Classificação é um campo obrigatório' }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    error={!!error}
                  >
                    <InputLabel htmlFor="classification-input">Classificação *</InputLabel>
                    <Select
                      inputProps={{ id: 'classification-input' }}
                      value={value}
                      onChange={onChange}
                    >
                      {classifications.length === 0 && <MenuItem value="">Vazio</MenuItem>}
                      {classifications.map(classification => (
                        <MenuItem key={classification.id} value={classification.id}>{classification.name}</MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="unitId"
                control={control}
                defaultValue=""
                rules={{ required: 'Unidade é um campo obrigatório' }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    error={!!error}
                  >
                    <InputLabel htmlFor="unit-input">Unidade *</InputLabel>
                    <Select
                      inputProps={{ id: 'unit-input' }}
                      value={value}
                      onChange={onChange}
                    >
                      {units.length === 0 && <MenuItem value="">Vazio</MenuItem>}
                      {units.map(unit => (
                        <MenuItem key={unit.id} value={unit.id}>{unit.abbreviation}</MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          <br /><br /><br />

          <Controller
            name="quantity"
            control={control}
            defaultValue=""
            rules={{ required: 'Quantidade é um campo obrigatório' }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                label="Quantidade *"
                fullWidth
                inputProps={{ inputMode: 'numeric', onFocus: (e) => e.target.select() }}
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
                {harvestId ? 'Salvar' : 'Criar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </div>
  );
};

export default HarvestForm;
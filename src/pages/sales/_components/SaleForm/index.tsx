import React, { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form'
import { useSnackbar } from '@hooks/useSnackbar';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';

import { Input, DecimalInput } from './styles';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';
import { format as formatDate } from 'date-fns';

type SaleFormProps = {
  saleId?: string;
  initialValues?: InitialValuesData;
};

type Inputs = {
  date: string | Date;
  clientName: string;
  paymentStatus: string;
  deliveryStatus: string;
};

type Harvest = {
  id: string;
  date: Date;
  inStock: number;
  ruralProperty: {
    name: string;
  };
  field: {
    name: string;
  };
  cultivation: {
    name: string;
  };
  classification: {
    name: string;
  };
  unit: {
    name: string;
    abbreviation: string;
  };
};

type Client = {
  id: string;
  name: string;
};

interface InitialValuesData extends Inputs {
  saleItems: Array<{
    id: string;
    unitPrice: number;
    quantity: number;
    harvest: Harvest;
  }>;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  tdWithInput: {
    position: 'relative',
    padding: 0
  }
}));

const SaleForm: FC<SaleFormProps> = (props) => {
  const { saleId, initialValues } = props;

  const history = useHistory();
  const { control, handleSubmit, register, setValue, getValues, formState: { errors } } = useForm<Inputs>();
  const { addSnackbar } = useSnackbar();
  const classes = useStyles();

  const [clients, setClients] = useState<Client[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  const initForm = useCallback(() => {
    const iv = initialValues;

    if (iv) {
      iv.date && setValue('date', formatDate(new Date(iv.date), 'yyyy-MM-dd'));
      iv.clientName && setValue('clientName', iv.clientName);
      iv.paymentStatus && setValue('paymentStatus', iv.paymentStatus);
      iv.deliveryStatus && setValue('deliveryStatus', iv.deliveryStatus);
    }
  }, [initialValues, setValue]);

  const getClients = () => {
    api.get('clients')
      .then((res) => {
        setClients(res.data);
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
      });
  };

  const getHarvests = () => {
    api.get('harvests/with-stock')
      .then((res) => {
        setHarvests(res.data);
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
      });
  };

  const setQuantity = (key: string, value: string) => {
    setQuantities((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const getQuantity = (key: string) => {
    const quantity = quantities[key];

    return quantity || 0;
  };

  const setPrice = (key: string, value: string) => {
    setPrices((prev) => ({ ...prev, [key]: Number(value.replace(',', '.')) }));
  }

  const onSubmit = (data: Inputs) => {
    const saleItems = [];

    for (const key in quantities) {
      if (quantities[key] > 0) {
        saleItems.push({
          quantity: quantities[key],
          unitPrice: prices[key],
          harvestId: key
        });
      }
    }

    const clientId = clients.find((client) => client.name === data.clientName)?.id;

    if (data.date) {
      const date = new Date(data.date);
      const timezoneOffset = date.getTimezoneOffset();
      data.date = new Date(date.getTime() + (timezoneOffset * 60 * 1000));
    }

    const payload = { ...data, totalValue, clientId, saleItems };

    if (saleId) {
      api.put(`sales/${saleId}`, payload)
        .then(() => {
          addSnackbar('Venda editada com sucesso!');
          history.goBack();
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
        });
      return;
    }

    api.post('sales', payload)
      .then(() => {
        addSnackbar('Venda criada com sucesso!');
        history.goBack();
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
      });
  };

  const memoHarvests = useMemo(() => {
    const memoHarvests = [...harvests];

    const iv = initialValues;

    if (iv) {
      iv.saleItems.forEach((item) => {
        if (item.harvest.inStock === 0) {
          memoHarvests.push(item.harvest);
        }
      });
    }

    memoHarvests.sort((a, b) => a.cultivation.name.localeCompare(b.cultivation.name, 'pt'));

    return memoHarvests;
  }, [harvests, initialValues]);

  const totalValue = useMemo(() => {
    let total = 0;

    for (const key in quantities) {
      total += (quantities[key] || 0) * (prices[key] || 0);
    }

    return total;
  }, [quantities, prices]);

  const quantityDefaultValue = useCallback((harvestId: string) => {
    if (!initialValues) return 0;
    return initialValues.saleItems.find((item) => item.harvest.id === harvestId)?.quantity || 0;
  }, [initialValues]);

  const priceDefaultValue = useCallback((harvestId: string) => {
    if (!initialValues) return '0,00';
    return initialValues.saleItems.find((item) => item.harvest.id === harvestId)?.unitPrice.toString().replace('.', ',') || '0,00';
  }, [initialValues]);

  const getSaleItemQuantity = useCallback((harvestId: string) => {
    if (!initialValues) return 0;

    const saleItem = initialValues.saleItems.find((saleItem) => saleItem.harvest.id === harvestId);

    if (!saleItem) return 0;

    return saleItem.quantity;
  }, [initialValues]);

  useEffect(() => {
    initForm();
  }, [initForm]);

  useEffect(() => {
    register('clientName', { validate: (value) => !!value || 'Cliente é um campo obrigatório' });
  }, [register]);

  useEffect(() => {
    getClients();
    getHarvests();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Box mx={1}>
        <form id="saleForm" onSubmit={handleSubmit(onSubmit)}>
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

          <Autocomplete
            freeSolo
            options={clients.map((client) => client.name)}
            onChange={(e, value) => setValue('clientName', value || '')}
            onInputChange={(e, value) => setValue('clientName', value || '')}
            value={getValues('clientName') || ''}
            renderInput={(params) => (
              <TextField
                label="Cliente *"
                {...params}
                error={!!errors?.clientName}
                helperText={errors?.clientName?.message}
              />
            )}
          />

          <br /><br /><br />

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Controller
                name="paymentStatus"
                control={control}
                defaultValue="pending"
                rules={{ required: 'Classificação é um campo obrigatório' }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    error={!!error}
                  >
                    <InputLabel htmlFor="classification-input">Status Pagamento *</InputLabel>
                    <Select
                      inputProps={{ id: 'classification-input' }}
                      value={value}
                      onChange={onChange}
                    >
                      <MenuItem value="paid">Pago</MenuItem>
                      <MenuItem value="pending">Pendente</MenuItem>
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="deliveryStatus"
                control={control}
                defaultValue="waiting"
                rules={{ required: 'Unidade é um campo obrigatório' }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    error={!!error}
                  >
                    <InputLabel htmlFor="unit-input">Status Entrega *</InputLabel>
                    <Select
                      inputProps={{ id: 'unit-input' }}
                      value={value}
                      onChange={onChange}
                    >
                      <MenuItem value="completed">Finalizado</MenuItem>
                      <MenuItem value="waiting">Esperando</MenuItem>
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </form>
      </Box>

      <br /><br />

      <Box mx={1}>
        <Typography variant="h6">Carrinho</Typography>
        <Typography variant="body2">Valor total: {totalValue}</Typography>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Produto</TableCell>
            <TableCell align="center">Estoque</TableCell>
            <TableCell align="center">Quantidade</TableCell>
            <TableCell align="center">Preço</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {memoHarvests.map((harvest) => (
            <TableRow key={harvest.id}>
              <TableCell>
                <Typography variant="caption">{harvest.ruralProperty.name} {'>'} {harvest.field.name}</Typography>
                <Typography>{harvest.cultivation.name} {harvest.classification.name}</Typography>
              </TableCell>
              <TableCell align="center">
                {harvest.inStock + (getSaleItemQuantity(harvest.id) - getQuantity(harvest.id))}
              </TableCell>
              <TableCell className={classes.tdWithInput}>
                <Input
                  type="text"
                  defaultValue={quantityDefaultValue(harvest.id)}
                  inputMode="numeric"
                  onChange={e => setQuantity(harvest.id, e.target.value)}
                  onClick={(e) => e.currentTarget.select()}
                  onBlur={e => !e.target.value && (e.target.value = '0')}
                />
              </TableCell>
              <TableCell className={classes.tdWithInput}>
                <DecimalInput
                  defaultValue={priceDefaultValue(harvest.id)}
                  onChange={(value) => setPrice(harvest.id, value)}
                  onClick={(e) => e.currentTarget.select()}
                  onBlur={(e) => !e.target.value && (e.target.value = '0,00')}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SaleForm;
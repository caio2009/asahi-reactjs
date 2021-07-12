import React, { FC, useState, useCallback, useEffect, useRef, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from '@hooks/useSnackbar';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Photo from '@material-ui/icons/Photo';

import { CultivationImageInput } from './styles';
import ProgressBackdrop from '@components/base/ProgressBackdrop';
import Fab from '@components/base/Fab';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';
import defaultCultivationIcon from '@assets/icons/vegetables.svg';

type CultivationFormProps = {
  cultivationId?: string;
  goBack(): void;
}

type Inputs = {
  name: string;
}

const CultivationForm: FC<CultivationFormProps> = (props) => {
  const { cultivationId, goBack } = props;

  const history = useHistory();
  const { control, handleSubmit, setValue } = useForm<Inputs>();
  const { addSnackbar } = useSnackbar();

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [backdrop, setBackdrop] = useState(!!cultivationId);

  const initForm = useCallback(() => {
    if (cultivationId) {
      api.get(`cultivations/${cultivationId}`)
        .then(res => {
          const cultivation = res.data;
          setValue('name', cultivation.name);
          setImageDataUrl(cultivation.image);
        })
        .catch((err) => handleAxiosError(err, addSnackbar))
        .finally(() => setBackdrop(false));
    }
    // eslint-disable-next-line
  }, [cultivationId, setValue]);

  const onSubmit = (data: Inputs) => {
    setBackdrop(true);

    const formData = new FormData();
    formData.append('name', data.name);
    if (imageFile) formData.append('image', imageFile);

    if (cultivationId) {
      api.put(`cultivations/${cultivationId}`, formData)
        .then(() => {
          addSnackbar('Cultura editada com sucesso!');
          history.goBack();
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
          setBackdrop(false);
        });
      return;
    }

    api.post('cultivations', formData)
      .then(() => {
        addSnackbar('Cultura criada com sucesso!');
        history.goBack();
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
        setBackdrop(false);
      });
  };

  const handleAddImageButtonClick = () => {
    if (imageInputRef.current) {
      const input = imageInputRef.current;
      input.click();
    }
  };

  const handleImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif'
    ];

    if (e.target.files) {
      const file = e.target.files[0];

      if (file) {
        if (!allowedTypes.includes(file.type)) {
          addSnackbar('Tipo do arquivo é inválido!');
          return;
        }

        // if (file.size / 1024 ** 2 > 1) {
        //   addSnackbar('Tamanho máximo suportado da imagem é de 1MB');
        //   return;
        // }

        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setImageDataUrl(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  useEffect(() => {
    initForm();
  }, [initForm]);

  return (
    <div>
      <ProgressBackdrop open={backdrop} />

      <CultivationImageInput>
        <img
          src={imageDataUrl || defaultCultivationIcon}
          alt="cultivation_image"
          height="168"
        />

        <Fab position="absolute" bottom={-28} color="primary" onClick={handleAddImageButtonClick}>
          <Photo />
        </Fab>

        <input
          ref={imageInputRef}
          id="cultivationImage"
          type="file"
          onChange={handleImageInputChange}
        />
      </CultivationImageInput>

      <br /><br />

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
              {cultivationId ? 'Salvar' : 'Criar'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CultivationForm;
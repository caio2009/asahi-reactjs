import React, { FC, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from '@hooks/useSnackbar';
import { AuthContext } from '@contexts/AuthContext';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

type Inputs = {
  username: string;
  password: string;
};

const SignInPage: FC = () => {
  const { control, handleSubmit } = useForm<Inputs>();
  const { addSnackbar } = useSnackbar();
  const { signIn } = useContext(AuthContext);

  const onSubmit = (data: Inputs) => {
    const { username, password } = data;

    signIn({ username, password }, (err) => {
      addSnackbar(err.response.data.message);
    });
  };

  return (
    <div>
      <br />
      <Typography variant="h5" align="center">Asahi Frutas</Typography>
      <br />

      <Divider />

      <Box m={2}>
        <Typography variant="h6" align="center" color="primary">Entrar</Typography>
        <br />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: 'Usuário deve ser preenchido' }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                label="Usuário *"
                value={value}
                onChange={onChange}
                fullWidth
                inputProps={{
                  autoCapitalize: 'none'
                }}
                variant="filled"
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />

          <br /><br /><br />

          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: 'Senha deve ser preenchida' }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                type="password"
                label="Senha *"
                value={value}
                onChange={onChange}
                fullWidth
                variant="filled"
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />

          <br /><br /><br />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Entrar
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default SignInPage;
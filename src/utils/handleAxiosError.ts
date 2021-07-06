const handleAxiosError = (err: any, enqueueSnackbar: Function) => {
  if (err.response) {
    enqueueSnackbar(err.response.data.message, {
      variant: 'error'
    });
  } else if (err.request) {
    enqueueSnackbar('Problema na conexão com o servidor!', {
      variant: 'error'
    });
  } else {
    enqueueSnackbar(err.message, {
      variant: 'error'
    });
  }
};

export default handleAxiosError;
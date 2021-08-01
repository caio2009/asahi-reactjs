const handleAxiosError = (err: any, addSnackbar: Function) => {
  if (err.response) {
    // console.log(err.response.data);
    addSnackbar(err.response.data.message, {
      variant: 'error'
    });
  } else if (err.request) {
    addSnackbar('Problema na conexão com o servidor!', {
      variant: 'error'
    });
  } else {
    addSnackbar(err.message, {
      variant: 'error'
    });
  }
};

export default handleAxiosError;
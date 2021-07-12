import React, { FC, useState, useCallback, ChangeEvent } from 'react';
import { useHistory, useParams, useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';
import { alertDialog } from '@hooks/useAlertDialog';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuItem from '@material-ui/core/MenuItem';

import AppBar from '@components/base/AppBar';
import ProgressDialog from '@components/dialog/ProgressDialog';
import FieldHarvestsPage from '@pages/fields/harvests/index.page';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';
import { useEffect } from 'react';

type Params = {
  id: string;
}

type Field = {
  id: string;
  name: string;
  ruralProperty: {
    name: string;
  };
}

const ManageFieldPage: FC = () => {
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { id } = useParams() as Params;
  const { addSnackbar } = useSnackbar();

  const [field, setField] = useState<Field | null>(null);

  const [tabValue, setTabValue] = useState('harvests');
  const [deleteProgress, setDeleteProgress] = useState(false);

  const getRuralProperties = useCallback(() => {
    api.get(`fields/${id}`).then(res => {
      setField(res.data);
    })
      .catch((err) => handleAxiosError(err, addSnackbar));
    // eslint-disable-next-line
  }, [id]);

  const goBack = () => {
    history.goBack();
  };

  const handleTabChange = (e: ChangeEvent<{}>, newValue: string) => {
    setTabValue(newValue);
    history.push(`${url}/${newValue}`);
  };

  const editField = () => {
    history.push(`/fields/edit/${id}`);
  };

  const deleteField = () => {
    alertDialog({
      message: 'Tem certeza que quer apagar esse talhão?',
      onConfirmation: () => {
        setDeleteProgress(true);
        api.delete(`/fields/${id}`)
          .then(() => {
            addSnackbar('Talhão apagado com sucesso!');
            history.goBack();
          })
          .catch((err) => {
            handleAxiosError(err, addSnackbar);
            setDeleteProgress(false);
          });
      }
    });
  };

  useEffect(() => {
    getRuralProperties();
  }, [getRuralProperties]);

  return (
    <div>
      <AppBar
        title={field ? `${field.ruralProperty.name} > ${field.name}` : ''}
        subTitle="Gerenciar Talhão"
        goBack={goBack}
        moreOptions={[
          <MenuItem key={0} dense onClick={editField}>
            Editar
          </MenuItem>,
          <MenuItem key={1} dense onClick={deleteField}>
            Apagar
          </MenuItem>
        ]}
      />

      <Box mt={6}>
        <Paper square>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab value="harvests" label="COLHEITAS" />
          </Tabs>
        </Paper>
      </Box>

      <Switch>
        <Route exact path={`${path}`}>
          <Redirect to={`${url}/harvests`} />
        </Route>

        <Route path={`${path}/harvests`}>
          <FieldHarvestsPage fieldId={id} />
        </Route>
      </Switch>

      <ProgressDialog
        open={deleteProgress}
        text="Aguarde. Apagando talhão."
        onClose={() => setDeleteProgress(false)}
      />
    </div>
  );
};

export default ManageFieldPage;
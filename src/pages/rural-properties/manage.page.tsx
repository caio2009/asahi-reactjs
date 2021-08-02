import React, { FC, useState, useCallback, ChangeEvent } from 'react';
import { useHistory, useParams, useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';
import { alertDialog } from '@hooks/useAlertDialog';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import AppBar from '@components/base/AppBar';
import ProgressDialog from '@components/dialog/ProgressDialog';
import RuralPropertyFieldsPage from '@pages/rural-properties/fields/index.page';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';
import { useEffect } from 'react';

type Params = {
  id: string;
}

type RuralProperty = {
  id: string;
  name: string;
  description: string;
}

const ManageRuralPropertyPage: FC = () => {
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { id } = useParams() as Params;
  const { addSnackbar } = useSnackbar();

  const [ruralProperty, setRuralProperty] = useState<RuralProperty | null>(null);

  const [tabValue, setTabValue] = useState('fields');
  const [deleteProgress, setDeleteProgress] = useState(false);

  const getRuralProperties = useCallback(() => {
    api.get(`rural-properties/${id}`).then(res => {
      setRuralProperty(res.data);
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

  const editRuralProperty = () => {
    history.push(`/rural-properties/edit/${id}`);
  };

  const deleteRuralProperty = () => {
    alertDialog({
      message: 'Tem certeza que quer apagar essa propriedade rural?',
      onConfirmation: () => {
        setDeleteProgress(true);
        api.delete(`/rural-properties/${id}`)
          .then(() => {
            addSnackbar('Propriedade rural apagada com sucesso!');
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
        title={ruralProperty ? ruralProperty.name : ''}
        subTitle="Gerenciar Propriedade Rural"
        goBack={goBack}
        moreOptions={[
          <MenuItem key={0} dense onClick={editRuralProperty}>
            Editar
          </MenuItem>,
          <MenuItem key={1} dense onClick={deleteRuralProperty}>
            Apagar
          </MenuItem>
        ]}
      />

      <Box mt={8}>
        <Paper square>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab value="fields" label="TALHÕES" />
            <Tab value="harvests" label="COLHEITAS" />
          </Tabs>
        </Paper>
      </Box>

      <Switch>
        <Route exact path={`${path}`}>
          <Redirect to={`${url}/fields`} />
        </Route>

        <Route path={`${path}/fields`}>
          <RuralPropertyFieldsPage ruralPropertyId={id} />
        </Route>

        <Route path={`${path}/harvests`}>
          <Typography>Em desenvolvimento...</Typography>
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

export default ManageRuralPropertyPage;
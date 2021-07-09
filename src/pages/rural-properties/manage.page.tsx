import React, { FC, useState, useCallback, ChangeEvent } from 'react';
import { useHistory, useParams, useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import AppBar from '@components/base/AppBar';
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

  const getRuralProperties = useCallback(() => {
    api.get(`rural-properties/${id}`).then(res => {
      setRuralProperty(res.data);
    })
      .catch((err) => handleAxiosError(err, addSnackbar));
    // eslint-disable-next-line
  }, [id]);

  const goBack = () => {
    history.push('/rural-properties');
  };

  const handleTabChange = (e: ChangeEvent<{}>, newValue: string) => {
    setTabValue(newValue);
    history.push(`${url}/${newValue}`);
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
      />

      <Box mt={6}>
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
          <Typography>In development...</Typography>
        </Route>
      </Switch>

    </div>
  );
};

export default ManageRuralPropertyPage;
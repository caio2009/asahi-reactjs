import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import MainPage from '@pages/main/index.page';

import NewRuralPropertyPage from '@pages/rural-properties/new.page';
import EditRuralPropertyPage from '@pages/rural-properties/edit.page';

import UnitsPage from '@pages/units/index.page';
import NewUnitPage from '@pages/units/new.page';
import EditUnitPage from '@pages/units/edit.page';

const Routes: FC = () => {
  return (
    <Switch>
      <Route path="/rural-properties/new" component={NewRuralPropertyPage} />
      <Route path="/rural-properties/edit/:id" component={EditRuralPropertyPage} />

      <Route exact path="/units" component={UnitsPage} />
      <Route path="/units/new" component={NewUnitPage} />
      <Route path="/units/edit/:id" component={EditUnitPage} />

      <Route path="/" component={MainPage} />
    </Switch>
  );
};

export default Routes;
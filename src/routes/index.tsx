import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import MainPage from '@pages/main/index.page';

import NewRuralPropertyPage from '@pages/rural-properties/new.page';
import EditRuralPropertyPage from '@pages/rural-properties/edit.page';

import UnitsPage from '@pages/units/index.page';
import NewUnitPage from '@pages/units/new.page';
import EditUnitPage from '@pages/units/edit.page';

import ClassificationsPage from '@pages/classifications/index.page';
import NewClassificationPage from '@pages/classifications/new.page';
import EditClassificationPage from '@pages/classifications/edit.page';

const Routes: FC = () => {
  return (
    <Switch>
      <Route path="/rural-properties/new" component={NewRuralPropertyPage} />
      <Route path="/rural-properties/edit/:id" component={EditRuralPropertyPage} />

      <Route exact path="/units" component={UnitsPage} />
      <Route path="/units/new" component={NewUnitPage} />
      <Route path="/units/edit/:id" component={EditUnitPage} />

      <Route exact path="/classifications" component={ClassificationsPage} />
      <Route path="/classifications/new" component={NewClassificationPage} />
      <Route path="/classifications/edit/:id" component={EditClassificationPage} />

      <Route path="/" component={MainPage} />
    </Switch>
  );
};

export default Routes;
import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import MainPage from '@pages/main/index.page';

import NewRuralPropertyPage from '@pages/rural-properties/new.page';
import EditRuralPropertyPage from '@pages/rural-properties/edit.page';

const Routes: FC = () => {
  return (
    <Switch>
      <Route path="/rural-properties/new" component={NewRuralPropertyPage} />
      <Route path="/rural-properties/edit/:id" component={EditRuralPropertyPage} />

      <Route path="/" component={MainPage} />
    </Switch>
  );
};

export default Routes;
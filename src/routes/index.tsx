import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import MainPage from '@pages/main/index.page';

import NewRuralPropertyPage from '@pages/rural-properties/new.page';
import EditRuralPropertyPage from '@pages/rural-properties/edit.page';
import ManageRuralPropertyPage from '@pages/rural-properties/manage.page';

import UnitsPage from '@pages/units/index.page';
import NewUnitPage from '@pages/units/new.page';
import EditUnitPage from '@pages/units/edit.page';

import ClassificationsPage from '@pages/classifications/index.page';
import NewClassificationPage from '@pages/classifications/new.page';
import EditClassificationPage from '@pages/classifications/edit.page';

import CultivationsPage from '@pages/cultivations/index.page';
import NewCultivationPage from '@pages/cultivations/new.page';
import EditCultivationPage from '@pages/cultivations/edit.page';

import NewFieldPage from '@pages/fields/new.page';
import EditFieldPage from '@pages/fields/edit.page';
import ManageFieldPage from '@pages/fields/manage';

import NewHarvestPage from '@pages/harvests/new.page';
import EditHarvestPage from '@pages/harvests/edit.page';

import ClientsPage from '@pages/clients/index.page';
import NewClientPage from '@pages/clients/new.page';
import EditClientPage from '@pages/clients/edit.page';

const Routes: FC = () => {
  return (
    <Switch>
      <Route path="/rural-properties/new" component={NewRuralPropertyPage} />
      <Route path="/rural-properties/edit/:id" component={EditRuralPropertyPage} />
      <Route path="/rural-properties/manage/:id" component={ManageRuralPropertyPage} />

      <Route exact path="/units" component={UnitsPage} />
      <Route path="/units/new" component={NewUnitPage} />
      <Route path="/units/edit/:id" component={EditUnitPage} />

      <Route exact path="/classifications" component={ClassificationsPage} />
      <Route path="/classifications/new" component={NewClassificationPage} />
      <Route path="/classifications/edit/:id" component={EditClassificationPage} />

      <Route exact path="/cultivations" component={CultivationsPage} />
      <Route path="/cultivations/new" component={NewCultivationPage} />
      <Route path="/cultivations/edit/:id" component={EditCultivationPage} />

      <Route path="/rural-properties/:ruralPropertyId/fields/new" component={NewFieldPage} />
      <Route path="/fields/edit/:id" component={EditFieldPage} />
      <Route path="/fields/manage/:id" component={ManageFieldPage} />

      <Route path="/fields/:fieldId/harvests/new" component={NewHarvestPage} />
      <Route path="/harvests/edit/:id/" component={EditHarvestPage} />

      <Route exact path="/clients" component={ClientsPage} />
      <Route path="/clients/new" component={NewClientPage} />
      <Route path="/clients/edit/:id" component={EditClientPage} />

      <Route path="/" component={MainPage} />
    </Switch>
  );
};

export default Routes;
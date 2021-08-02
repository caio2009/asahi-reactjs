import React, { FC, useContext } from 'react';
import { Switch, Route as ReactDOMRoute, RouteProps as ReactDOMRouteProps, Redirect } from 'react-router-dom';
import { AuthContext } from '@contexts/AuthContext';

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

import StockPage from '@pages/stock/index.page';

import SalesPage from '@pages/sales/index.page';
import NewSalePage from '@pages/sales/new.page';
import EditSalePage from '@pages/sales/edit.page';
import DispatchSalesPage from '@pages/sales/dispatch/index.page';

import SignInPage from '@pages/signin';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!isAuthenticated ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/signin' : '/',
              state: { from: location }
            }}
          />
        )
      }}
    />
  )
};

const Routes: FC = () => {
  return (
    <Switch>
      <Route path="/signin" component={SignInPage} />

      <Route isPrivate path="/rural-properties/new" component={NewRuralPropertyPage} />
      <Route isPrivate path="/rural-properties/edit/:id" component={EditRuralPropertyPage} />
      <Route isPrivate path="/rural-properties/manage/:id" component={ManageRuralPropertyPage} />

      <Route isPrivate exact path="/units" component={UnitsPage} />
      <Route isPrivate path="/units/new" component={NewUnitPage} />
      <Route isPrivate path="/units/edit/:id" component={EditUnitPage} />

      <Route isPrivate exact path="/classifications" component={ClassificationsPage} />
      <Route isPrivate path="/classifications/new" component={NewClassificationPage} />
      <Route isPrivate path="/classifications/edit/:id" component={EditClassificationPage} />

      <Route isPrivate exact path="/cultivations" component={CultivationsPage} />
      <Route isPrivate path="/cultivations/new" component={NewCultivationPage} />
      <Route isPrivate path="/cultivations/edit/:id" component={EditCultivationPage} />

      <Route isPrivate path="/rural-properties/:ruralPropertyId/fields/new" component={NewFieldPage} />
      <Route isPrivate path="/fields/edit/:id" component={EditFieldPage} />
      <Route isPrivate path="/fields/manage/:id" component={ManageFieldPage} />

      <Route isPrivate path="/fields/:fieldId/harvests/new" component={NewHarvestPage} />
      <Route isPrivate path="/harvests/edit/:id/" component={EditHarvestPage} />

      <Route isPrivate exact path="/clients" component={ClientsPage} />
      <Route isPrivate path="/clients/new" component={NewClientPage} />
      <Route isPrivate path="/clients/edit/:id" component={EditClientPage} />

      <Route isPrivate path="/stock" component={StockPage} />

      <Route isPrivate exact path="/sales" component={SalesPage} />
      <Route isPrivate path="/sales/new" component={NewSalePage} />
      <Route isPrivate path="/sales/edit/:id" component={EditSalePage} />
      
      <Route isPrivate exact path="/sales/dispatch" component={DispatchSalesPage} />


      <Route isPrivate path="/" component={MainPage} />
    </Switch>
  );
};

export default Routes;
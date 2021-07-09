import React, { FC, useState } from 'react';

import { 
  Switch, 
  Route, 
  Redirect, 
  useHistory
} from 'react-router-dom';

import { MainContainer, ContentContainer } from './styles'

import BottomNavigation from './_components/BottomNavigation';
import HomePage from '@pages/home/index.page';
import RuralPropertiesPage from '@pages/rural-properties/index.page';
import CeasaPage from '@pages/ceasa/index.page';

const MainPage: FC = () => {
  const history = useHistory();
  const pathname = history.location.pathname;

  const [bottomNavigationValue, setBottomNavigationValue] = useState(pathname.replace('/', ''));

  const handleBottomNavigationChange = (newValue: string) => {
    setBottomNavigationValue(newValue);
    history.push(`/${newValue}`);
  }

  return (
    <MainContainer>
      <ContentContainer>
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>

          <Route path="/home">
            <HomePage setBottomNavigationValue={setBottomNavigationValue} />
          </Route>

          <Route path="/rural-properties" component={RuralPropertiesPage} />

          <Route path="/ceasa" component={CeasaPage} />
        </Switch>
      </ContentContainer>

      <BottomNavigation value={bottomNavigationValue} onChange={handleBottomNavigationChange} />
    </MainContainer>
  );
};

export default MainPage;
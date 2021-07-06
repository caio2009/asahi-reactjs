import React, { FC, useState, Dispatch, SetStateAction } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import AppBar from '@components/base/AppBar';
import Drawer from './_components/Drawer';

type HomePageProps = {
  setBottomNavigationValue: Dispatch<SetStateAction<string>>;
}

const HomePage: FC<HomePageProps> = (props) => {
  const { setBottomNavigationValue } = props;

  const [drawerState, setDrawerState] = useState(false);

  const handleMenuClick = () => {
    setDrawerState(prev => !prev);
  }

  return (
    <div>
      <AppBar title="Asahi" menuButton onMenuClick={handleMenuClick} />

      <Box mx={2}>
        <Typography align="center">Seja bem-vindo ao sistema da Asahi!</Typography>
      </Box>

      <Drawer
        open={drawerState}
        onClose={() => setDrawerState(false)}
        setDrawerState={setDrawerState}
        setBottomNavigationValue={setBottomNavigationValue}
      />
    </div>
  );
};

export default HomePage;
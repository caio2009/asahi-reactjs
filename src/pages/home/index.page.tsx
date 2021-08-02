import React, { FC, useState, Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { AuthContext } from '@contexts/AuthContext';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import AppBar from '@components/base/AppBar';
import Drawer from './_components/Drawer';

type HomePageProps = {
  setBottomNavigationValue: Dispatch<SetStateAction<string>>;
}

const HomePage: FC<HomePageProps> = (props) => {
  const { setBottomNavigationValue } = props;

  const { user, signOut } = useContext(AuthContext);

  const [drawerState, setDrawerState] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<any | null>(null);

  const getNameInitials = useMemo(() => {
    if (!user) return 'A';

    const parts = user.name.split(' ');

    return `${parts[0][0]}${parts[parts.length - 1][0]}`;
  }, [user]);

  const handleMenuClick = () => {
    setDrawerState(prev => !prev);
  }

  const closeUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleUserMenuClick = (e: any) => {
    setUserMenuAnchor(e.currentTarget);
  }

  return (
    <div>
      <AppBar
        title="Asahi"
        menuButton
        onMenuClick={handleMenuClick}
        extra={
          <>
            <IconButton onClick={handleUserMenuClick}>
              <Avatar>
                {getNameInitials}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={userMenuAnchor}
              keepMounted
              open={!!userMenuAnchor}
              onClose={closeUserMenu}
            >
              <MenuItem dense onClick={() => signOut()}>Sair</MenuItem>
            </Menu>
          </>
        }
      />

      <Box mt={2} mx={2}>
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
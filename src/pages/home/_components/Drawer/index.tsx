import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import MaterialDrawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

interface DrawerProps {
  open: boolean;
  onClose?(): void;
  setDrawerState(state: boolean): void;
  setBottomNavigationValue(state: string): void;
}

const Drawer: FC<DrawerProps> = (props) => {
  let { open, onClose, setDrawerState, setBottomNavigationValue } = props;

  const history = useHistory();

  if (!onClose) onClose = () => null;

  const menuItems = {
    part1: [{
      text: 'Propriedades Rurais',
      path: '/rural-properties'
    }, {
      text: 'CEASA',
      path: '/ceasa'
    }, {
      text: 'Ver Estoque',
      path: '/stock'
    }],
    part2: [{
      text: 'Culturas',
      path: '/cultivations'
    }, {
      text: 'Classificações',
      path: '/classifications'
    }, {
      text: 'Unidades',
      path: '/units'
    }]
  };

  const goTo = (path: string) => {
    if (['/home', '/rural-properties', '/ceasa'].includes(path)) setBottomNavigationValue(path.replace('/', ''));
    setDrawerState(false);
    history.push(path);
  };

  return (
    <MaterialDrawer anchor="top" open={open} onClose={onClose}>
      <Box p={1}>
        <Button color="primary" onClick={() => goTo('/home')}>
          Asahi
        </Button>
      </Box>

      <Divider />

      <List>
        {menuItems.part1.map((item: any) => (
          <ListItem button key={item.text} onClick={() => goTo(item.path)}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {menuItems.part2.map((item: any) => (
          <ListItem button key={item.text}>
            <ListItemText primary={item.text} onClick={() => goTo(item.path)} />
          </ListItem>
        ))}
      </List>
    </MaterialDrawer>
  );
};

export default Drawer;
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import AppBar from '@components/base/AppBar';

const CeasaPage: FC = () => {
  const history = useHistory();

  const menuItems = [
    { text: 'Gerenciar Vendas', path: '/sales' },
    { text: 'Expedição', path: '/sales/dispatch' },
    { text: 'Estoque', path: '/stock' },
    { text: 'Clientes', path: '/clients' }
  ];

  const goTo = (path: string) => {
    history.push(path);
  };

  return (
    <div>
      <AppBar title="CEASA" backButton={false} />

      <Box pt={2} pb={3} px={2}>
        <Typography>
          Módulo da CEASA.
        </Typography>
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} button onClick={() => goTo(item.path)}>
            <ListItemText primary={item.text} />

            <IconButton>
              <ChevronRightIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CeasaPage;
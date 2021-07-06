import React, { FC, useState, useEffect, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';
import { alertDialog } from '@hooks/useAlertDialog';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import MoreVert from '@material-ui/icons/MoreVert'

import ProgressDialog from '@components/dialog/ProgressDialog';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';

type RuralProperty = {
  id: string;
  name: string;
  description: string;
}

const RuralPropertiesList: FC = () => {
  const history = useHistory();
  const { addSnackbar } = useSnackbar();

  const [ruralProperties, setRuralProperties] = useState<RuralProperty[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [deleteProgress, setDeleteProgress] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // eslint-disable-next-line
  const getRuralProperties = () => {
    api.get('rural-properties')
      .then(res => {
        setRuralProperties(res.data);
      })
      .catch((err) => handleAxiosError(err, addSnackbar))
      .finally(() => setLoadingProgress(false));
  }

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const editRuralProperty = () => {
    closeMenu();
    history.push(`rural-properties/edit/${selectedId}`);
  }

  const deleteRuralProperty = () => {
    closeMenu();
    alertDialog({
      message: 'Tem certeza que quer apagar essa propriedade rural?',
      onConfirmation: () => {
        setDeleteProgress(true);
        api.delete(`rural-properties/${selectedId}`)
          .then(() => {
            addSnackbar('Propriedade rural apagada com sucesso!');
            setRuralProperties(prev => prev.filter(ruralProperty => ruralProperty.id !== selectedId));
          })
          .catch((err) => handleAxiosError(err, addSnackbar))
          .finally(() => setDeleteProgress(false));
      }
    });
  };

  const handleMenuClick = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    setMenuAnchor(e.currentTarget);
    setSelectedId(id);
  }

  useEffect(() => {
    getRuralProperties();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <List>
        {ruralProperties.map(ruralProperty => (
          <ListItem button key={ruralProperty.id}>
            <ListItemText
              primary={ruralProperty.name}
              secondary={ruralProperty.description || 'Sem descrição'}
            />

            <ListItemSecondaryAction>
              <IconButton size="small" onClick={(e) => handleMenuClick(e, ruralProperty.id)}>
                <MoreVert />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {loadingProgress && (
        <Box mx="auto" py={20} width={100}>
          <CircularProgress />
        </Box>
      )}

      <Menu
        anchorEl={menuAnchor}
        keepMounted
        open={!!menuAnchor}
        onClose={closeMenu}
      >
        <MenuItem dense onClick={editRuralProperty}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteRuralProperty}>
          Apagar
        </MenuItem>
      </Menu>

      <ProgressDialog
        open={deleteProgress}
        text="Aguarde. Apagando propriedade rural."
        onClose={() => setDeleteProgress(false)}
      />
    </div>
  );
};

export default RuralPropertiesList;
import React, { FC, useState, useEffect } from 'react';
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
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import MoreVert from '@material-ui/icons/MoreVert';

import ProgressDialog from '@components/dialog/ProgressDialog';
import FlexBox from '@components/base/FlexBox';

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
  const [contextMenu, setContextMenu] = useState<any>({ mouseX: null, mouseY: null });
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
  };

  const manageRuralProperty = (id?: string) => {
    history.push(`/rural-properties/manage/${id || selectedId}`);
  };

  const editRuralProperty = () => {
    history.push(`/rural-properties/edit/${selectedId}`);
  };

  const deleteRuralProperty = () => {
    closeMenu();
    closeContextMenu();
    alertDialog({
      message: 'Tem certeza que quer apagar essa propriedade rural?',
      onConfirmation: () => {
        setDeleteProgress(true);
        api.delete(`/rural-properties/${selectedId}`)
          .then(() => {
            addSnackbar('Propriedade rural apagada com sucesso!');
            setRuralProperties(prev => prev.filter(ruralProperty => ruralProperty.id !== selectedId));
          })
          .catch((err) => handleAxiosError(err, addSnackbar))
          .finally(() => setDeleteProgress(false));
      }
    });
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const handleMenuClick = (e: any, id: string) => {
    setMenuAnchor(e.currentTarget);
    setSelectedId(id);
  };

  const closeContextMenu = () => {
    setContextMenu({ mouseX: null, mouseY: null });
  };

  const handleContextMenu = (e: any, id: string) => {
    e.preventDefault();
    setContextMenu({ mouseX: e.clientX - 2, mouseY: e.clientY - 4 });
    setSelectedId(id);
  };

  useEffect(() => {
    getRuralProperties();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <List>
        {ruralProperties.map((ruralProperty) => (
          <ListItem 
            key={ruralProperty.id}
            button
            onContextMenu={(e) => handleContextMenu(e, ruralProperty.id)}
            onClick={() => manageRuralProperty(ruralProperty.id)}
          >
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

      {!loadingProgress && ruralProperties.length === 0 && (
        <Typography variant="h6" align="center" color="textSecondary">
          Não há propriedades rurais cadastradas...
        </Typography>
      )}

      {loadingProgress && (
        <FlexBox>
          <CircularProgress />
        </FlexBox>
      )}

      <Menu
        anchorEl={menuAnchor}
        keepMounted
        open={!!menuAnchor}
        onClose={closeMenu}
      >
        <MenuItem dense onClick={() => manageRuralProperty()}>
          Gerenciar
        </MenuItem>
        <MenuItem dense onClick={editRuralProperty}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteRuralProperty}>
          Apagar
        </MenuItem>
      </Menu>

      <Menu
        keepMounted
        open={!!contextMenu.mouseY}
        onClose={closeContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          !!contextMenu.mouseY && !!contextMenu.mouseX
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem dense onClick={() => manageRuralProperty()}>
          Gerenciar
        </MenuItem>
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
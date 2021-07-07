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
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import MoreVert from '@material-ui/icons/MoreVert'

import ProgressDialog from '@components/dialog/ProgressDialog';
import FlexBox from '@components/base/FlexBox';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';

type Unit = {
  id: string;
  name: string;
  abbreviation: string;
}

const UnitsList: FC = () => {
  const history = useHistory();
  const { addSnackbar } = useSnackbar();

  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [contextMenu, setContextMenu] = useState<any>({mouseX: null, mouseY: null });
  const [deleteProgress, setDeleteProgress] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // eslint-disable-next-line
  const getRuralProperties = () => {
    api.get('units')
      .then(res => {
        setUnits(res.data);
      })
      .catch((err) => handleAxiosError(err, addSnackbar))
      .finally(() => setLoadingProgress(false));
  }

  const editUnit = () => {
    history.push(`units/edit/${selectedId}`);
  }

  const deleteUnit = () => {
    closeMenu();
    closeContextMenu();
    alertDialog({
      message: 'Tem certeza que quer apagar essa unidade?',
      onConfirmation: () => {
        setDeleteProgress(true);
        api.delete(`units/${selectedId}`)
          .then(() => {
            addSnackbar('Unidade apagada com sucesso!');
            setUnits(prev => prev.filter(unit => unit.id !== selectedId));
          })
          .catch((err) => handleAxiosError(err, addSnackbar))
          .finally(() => setDeleteProgress(false));
      }
    });
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const handleMenuClick = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    setMenuAnchor(e.currentTarget);
    setSelectedId(id);
  };

  const closeContextMenu = () => {
    setContextMenu({ mouseX: null, mouseY: null });
  };

  const handleContextMenu = (e: MouseEvent, id: string) => {
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
        {units.map((unit) => (
          <ListItem onContextMenu={(e) => handleContextMenu(e, unit.id)} button key={unit.id}>
            <ListItemText
              primary={unit.name}
              secondary={unit.abbreviation || 'Sem descrição'}
            />

            <ListItemSecondaryAction>
              <IconButton size="small" onClick={(e) => handleMenuClick(e, unit.id)}>
                <MoreVert />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {!loadingProgress && units.length === 0 && (
        <Typography variant="h6" align="center" color="textSecondary">
          Não há unidades cadastradas...
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
        <MenuItem dense onClick={editUnit}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteUnit}>
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
        <MenuItem dense onClick={editUnit}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteUnit}>
          Apagar
        </MenuItem>
      </Menu>

      <ProgressDialog
        open={deleteProgress}
        text="Aguarde. Apagando unidade."
        onClose={() => setDeleteProgress(false)}
      />
    </div>
  );
};

export default UnitsList;
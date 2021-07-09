import React, { FC, useState, useEffect, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';
import { alertDialog } from '@hooks/useAlertDialog';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
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
import defaultCultivationIcon from '@assets/icons/vegetables.svg';

type Cultivation = {
  id: string;
  name: string;
  image: string;
}

const CultivationsList: FC = () => {
  const history = useHistory();
  const { addSnackbar } = useSnackbar();

  const [cultivations, setCultivations] = useState<Cultivation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [contextMenu, setContextMenu] = useState<any>({mouseX: null, mouseY: null });
  const [deleteProgress, setDeleteProgress] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // eslint-disable-next-line
  const getCultivations = () => {
    api.get('cultivations')
      .then(res => {
        setCultivations(res.data);
      })
      .catch((err) => handleAxiosError(err, addSnackbar))
      .finally(() => setLoadingProgress(false));
  }

  const editCultivation = () => {
    history.push(`cultivations/edit/${selectedId}`);
  }

  const deleteCultivation = () => {
    closeMenu();
    closeContextMenu();
    alertDialog({
      message: 'Tem certeza que quer apagar essa cultura?',
      onConfirmation: () => {
        setDeleteProgress(true);
        api.delete(`cultivations/${selectedId}`)
          .then(() => {
            addSnackbar('Cultura apagada com sucesso!');
            setCultivations(prev => prev.filter(cultivation => cultivation.id !== selectedId));
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
    getCultivations();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <List>
        {cultivations.map((cultivation) => (
          <ListItem onContextMenu={(e) => handleContextMenu(e, cultivation.id)} button key={cultivation.id}>
            <ListItemAvatar style={{ width: 76, height: 60 }}>
              <Avatar 
                style={{ width: 60, height: 60 }}
                variant="square"
                src={cultivation.image || defaultCultivationIcon} 
              />
            </ListItemAvatar>

            <ListItemText
              primary={cultivation.name}
            />

            <ListItemSecondaryAction>
              <IconButton size="small" onClick={(e) => handleMenuClick(e, cultivation.id)}>
                <MoreVert />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {!loadingProgress && cultivations.length === 0 && (
        <Typography variant="h6" align="center" color="textSecondary">
          Não há culturas cadastradas...
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
        <MenuItem dense onClick={editCultivation}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteCultivation}>
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
        <MenuItem dense onClick={editCultivation}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteCultivation}>
          Apagar
        </MenuItem>
      </Menu>

      <ProgressDialog
        open={deleteProgress}
        text="Aguarde. Apagando cultura."
        onClose={() => setDeleteProgress(false)}
      />
    </div>
  );
};

export default CultivationsList;
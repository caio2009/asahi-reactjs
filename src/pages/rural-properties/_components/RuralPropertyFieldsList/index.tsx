import React, { FC, useState, useCallback, useEffect, MouseEvent } from 'react';
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

type RuralPropertyFieldsListProps = {
  ruralPropertyId: string;
}

type Field = {
  id: string;
  name: string;
  cultivation: {
    name: string;
  };
};

const RuralPropertyFieldsList: FC<RuralPropertyFieldsListProps> = (props) => {
  const { ruralPropertyId } = props;

  const history = useHistory();
  const { addSnackbar } = useSnackbar();

  const [fields, setFields] = useState<Field[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [contextMenu, setContextMenu] = useState<any>({ mouseX: null, mouseY: null });
  const [deleteProgress, setDeleteProgress] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const getFields = useCallback(() => {
    api.get(`rural-properties/${ruralPropertyId}/fields`)
      .then((res) => {
        setFields(res.data);
      })
      .catch((err) => handleAxiosError(err, addSnackbar))
      .finally(() => setLoadingProgress(false));
      // eslint-disable-next-line
  }, [ruralPropertyId]);

  const manageField = (id?: string) => {
    history.push(`/fields/manage/${id || selectedId}`);
  };

  const editField = () => {
    history.push(`/fields/edit/${selectedId}`);
  };

  const deleteField = () => {
    closeMenu();
    closeContextMenu();
    alertDialog({
      message: 'Tem certeza que quer apagar esse talhão?',
      onConfirmation: () => {
        setDeleteProgress(true);
        api.delete(`/fields/${selectedId}`)
          .then(() => {
            addSnackbar('Talhão apagado com sucesso!');
            setFields(prev => prev.filter(field => field.id !== selectedId));
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
    getFields();
  }, [getFields]);

  return (
    <div>
      <List>
        {fields.map((field) => (
          <ListItem
            key={field.id}
            button
            onContextMenu={(e) => handleContextMenu(e, field.id)}
            onClick={() => null}
          >
            <ListItemText
              primary={field.name}
              secondary={`Cultura: ${field.cultivation.name}`}
            />

            <ListItemSecondaryAction>
              <IconButton size="small" onClick={(e) => handleMenuClick(e, field.id)}>
                <MoreVert />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {!loadingProgress && fields.length === 0 && (
        <Typography variant="h6" align="center" color="textSecondary">
          Não há talhões nessa propriedade rural...
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
        <MenuItem dense onClick={() => null}>
          Gerenciar
        </MenuItem>
        <MenuItem dense onClick={editField}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteField}>
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
        <MenuItem dense onClick={() => null}>
          Gerenciar
        </MenuItem>
        <MenuItem dense onClick={editField}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteField}>
          Apagar
        </MenuItem>
      </Menu>

      <ProgressDialog
        open={deleteProgress}
        text="Aguarde. Apagando talhão."
        onClose={() => setDeleteProgress(false)}
      />
    </div>
  );
};

export default RuralPropertyFieldsList;
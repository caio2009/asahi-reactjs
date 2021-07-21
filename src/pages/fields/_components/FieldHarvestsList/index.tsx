import React, { FC, useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from '@hooks/useSnackbar';
import { alertDialog } from '@hooks/useAlertDialog';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
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
import { format as formatDate } from 'date-fns';

type FieldHarvestsListProps = {
  fieldId: string;
}

type HarvestMappedByDate = {
  date: Date;
  harvests: Array<{
    id: string;
    quantity: number;
    ruralProperty: {
      name: string;
    };
    field: {
      name: string;
    };
    cultivation: {
      name: string;
    };
    classification: {
      name: string;
    };
    unit: {
      name: string;
      abbreviation: string;
    };
  }>;
}

const FieldHarvestsList: FC<FieldHarvestsListProps> = (props) => {
  const { fieldId } = props;

  const history = useHistory();
  const { addSnackbar } = useSnackbar();

  const [harvests, setHarvests] = useState<HarvestMappedByDate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // saving the date to help when delete a harvest

  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [contextMenu, setContextMenu] = useState<any>({ mouseX: null, mouseY: null });
  const [deleteProgress, setDeleteProgress] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const getHarvests = useCallback(() => {
    api.get(`fields/${fieldId}/harvests`)
      .then((res) => {
        setHarvests(res.data);
      })
      .catch((err) => handleAxiosError(err, addSnackbar))
      .finally(() => setLoadingProgress(false));
    // eslint-disable-next-line
  }, [fieldId]);

  const editHarvest = () => {
    history.push(`/harvests/edit/${selectedId}`);
  };

  const deleteHarvest = () => {
    closeMenu();
    closeContextMenu();
    alertDialog({
      message: 'Tem certeza que quer apagar essa colheita?',
      onConfirmation: () => {
        setDeleteProgress(true);
        api.delete(`/harvests/${selectedId}`)
          .then(() => {
            addSnackbar('Colheita apagada com sucesso!');
            setHarvests((prev) => {
              const clone = [...prev];
              const index = clone.findIndex((harvest: HarvestMappedByDate) => harvest.date === selectedDate);
              clone[index].harvests = clone[index].harvests.filter((harvest) => harvest.id !== selectedId);
              if (clone[index].harvests.length === 0) clone.splice(index, 1);
              return clone;
            })
          })
          .catch((err) => handleAxiosError(err, addSnackbar))
          .finally(() => setDeleteProgress(false));
      }
    });
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const handleMenuClick = (e: any, id: string, date: Date) => {
    setMenuAnchor(e.currentTarget);
    setSelectedId(id);
    setSelectedDate(date);
  };

  const closeContextMenu = () => {
    setContextMenu({ mouseX: null, mouseY: null });
  };

  const handleContextMenu = (e: any, id: string, date: Date) => {
    e.preventDefault();
    setContextMenu({ mouseX: e.clientX - 2, mouseY: e.clientY - 4 });
    setSelectedId(id);
    setSelectedDate(date);
  };

  useEffect(() => {
    getHarvests();
  }, [getHarvests]);

  return (
    <div>
      <List subheader={<li />}>
        {harvests.map((mappedHarvest, index) => (
          <React.Fragment key={index}>
            <li>
              <ul>
                <ListSubheader>
                  {formatDate(new Date(mappedHarvest.date), 'dd/MM/yyyy')}
                </ListSubheader>
                {mappedHarvest.harvests.map((harvest) => (
                  <ListItem
                    key={harvest.id}
                    button
                    onContextMenu={(e) => handleContextMenu(e, harvest.id, mappedHarvest.date)}
                    onClick={() => null}
                  >
                    <ListItemText
                      primary={`${harvest.cultivation.name} (${harvest.classification.name})`}
                      secondary={
                        <Typography variant="body2" color="textSecondary">
                          <strong>{harvest.quantity}</strong> {harvest.unit.abbreviation}
                        </Typography>
                      }
                    />

                    <ListItemSecondaryAction>
                      <IconButton size="small" onClick={(e) => handleMenuClick(e, harvest.id, mappedHarvest.date)}>
                        <MoreVert />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </ul>
            </li>
            {index < harvests.length - 1 && (
              <>
                <br />
                <Divider />
              </>
            )}
          </React.Fragment>
        ))}
      </List>

      {!loadingProgress && Object.keys(harvests).length === 0 && (
        <Typography variant="h6" align="center" color="textSecondary">
          Não há colheitas nesse talhão...
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
        <MenuItem dense onClick={editHarvest}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteHarvest}>
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
        <MenuItem dense onClick={editHarvest}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteHarvest}>
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

export default FieldHarvestsList;
import React, { FC, useState, useCallback, useEffect } from 'react';
import { useSnackbar } from '@hooks/useSnackbar';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';
import { format as formatDate } from 'date-fns';

type StockItemDialogProps = {
  open: boolean;
  onClose(): void;
  cultivationId?: string;
  classificationId?: string;
  unitId?: string;
};

type StockItemDetails = {
  inStock: number;
  cultivation: {
    id: string;
    name: string;
  };
  classification: {
    id: string;
    name: string;
  };
  unit: {
    id: string;
    name: string;
    abbreviation: string;
  };
  origins: Array<{
    ruralProperty: {
      name: string;
    };
    field: {
      name: string;
    };
    harvest: {
      id: string;
      date: Date;
      inStock: number;
    };
  }>;
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  listItem: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  originContainer: {
    paddingBottom: 0,
    marginBottom: 0
  }
}));

const StockItemDialog: FC<StockItemDialogProps> = (props) => {
  const {
    open,
    onClose,
    cultivationId,
    classificationId,
    unitId
  } = props;

  const classes = useStyles();
  const { addSnackbar } = useSnackbar();

  const [stockItemDetails, setStockItemDetails] = useState<StockItemDetails | null>(null);

  const getStockItemDetails = useCallback(() => {
    if (cultivationId && classificationId && unitId) {
      api.get('stock/details', {
        params: { cultivationId, classificationId, unitId }
      })
        .then((res) => {
          setStockItemDetails(res.data);
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
        });
    }
    // eslint-disable-next-line
  }, [cultivationId, classificationId, unitId]);

  useEffect(() => {
    getStockItemDetails();
  }, [getStockItemDetails]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Detalhes do Produto</DialogTitle>

      <Divider />

      <DialogContent>
        {stockItemDetails && (
          <>
            <Typography>Produto: {stockItemDetails.cultivation.name} {stockItemDetails.classification.name}</Typography>
            <Typography>Unidade: {stockItemDetails.unit.abbreviation}</Typography>
          </>
        )}
      </DialogContent>

      <Divider />

      <DialogContent className={classes.originContainer}>
        <Typography><strong>Origens</strong></Typography>
      </DialogContent>

      {stockItemDetails && (
        <List>
          {stockItemDetails.origins.map((origin, index) => (
            <React.Fragment key={origin.harvest.id}>
              <ListItem button className={classes.listItem}>
                <ListItemText
                  primary={
                    <>
                      <Typography variant="body2">{origin.ruralProperty.name} {'>'}  {origin.field.name}</Typography>
                      <Typography variant="body2" color="textSecondary">Data: {formatDate(new Date(origin.harvest.date), 'dd/MM/yyyy')}</Typography>
                      <Typography variant="body2" color="textSecondary">Qtd: {origin.harvest.inStock} {stockItemDetails.unit.abbreviation}</Typography>
                    </>
                  }
                />
              </ListItem>

              {index < stockItemDetails.origins.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}

      <DialogActions>
        <Button onClick={onClose} color="secondary">Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockItemDialog;
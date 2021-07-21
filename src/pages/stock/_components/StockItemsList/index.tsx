import React, { FC, useState, useEffect } from 'react';
import { useSnackbar } from '@hooks/useSnackbar';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import FlexBox from '@components/base/FlexBox';
import StockItemDialog from '../StockItemDialog';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';
import defaultCultivationIcon from '@assets/icons/vegetables.svg';

type StockItem = {
  inStock: number;
  cultivation: {
    id: string;
    name: string;
    image: string;
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
}

const StockItemsList: FC = () => {
  const { addSnackbar } = useSnackbar();

  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [selectedCultivationId, setSelectedCultivationId] = useState<string | undefined>(undefined);
  const [selectedClassificationId, setSelectedClassificationId] = useState<string | undefined>(undefined);
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>(undefined);

  const [loadingProgress, setLoadingProgress] = useState(true);
  const [stockItemDialog, setStockItemDialog] = useState(false);

  const getStockItems = () => {
    api.get('stock')
      .then((res) => {
        setStockItems(res.data);
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
      })
      .finally(() => setLoadingProgress(false));
  };

  const handleListItemClick = (index: number) => {
    const stockItem = stockItems[index];
    setSelectedCultivationId(stockItem.cultivation.id);
    setSelectedClassificationId(stockItem.classification.id);
    setSelectedUnitId(stockItem.unit.id);

    setStockItemDialog(true);
  }

  const handleStockItemClose = () => {
    setStockItemDialog(false);

    setSelectedCultivationId(undefined);
    setSelectedClassificationId(undefined);
    setSelectedUnitId(undefined);
  }

  useEffect(() => {
    getStockItems();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <List>
        {stockItems.map((stockItem, index) => (
          <React.Fragment key={index}>
            <ListItem button onClick={() => handleListItemClick(index)}>
              <ListItemAvatar style={{ width: 76, height: 60 }}>
                <Avatar
                  style={{ width: 60, height: 60 }}
                  variant="square"
                  src={stockItem.cultivation.image || defaultCultivationIcon}
                />
              </ListItemAvatar>

              <ListItemText
                primary={
                  <>
                    <Typography align="center">{stockItem.cultivation.name} {stockItem.classification.name}</Typography>
                    <Typography variant="h6" align="center">{stockItem.inStock}</Typography>
                    <Typography align="center">{stockItem.unit.abbreviation}</Typography>
                  </>
                }
              />
            </ListItem>

            {index < stockItems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {!loadingProgress && stockItems.length === 0 && (
        <Typography variant="h6" align="center" color="textSecondary">
          Estoque vazio...
        </Typography>
      )}

      {loadingProgress && (
        <FlexBox>
          <CircularProgress />
        </FlexBox>
      )}

      <StockItemDialog 
        open={stockItemDialog} 
        onClose={handleStockItemClose}
        cultivationId={selectedCultivationId}
        classificationId={selectedClassificationId}
        unitId={selectedUnitId}
      />
    </div>
  );
};

export default StockItemsList;
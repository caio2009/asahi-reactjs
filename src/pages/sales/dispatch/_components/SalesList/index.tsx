import React, { FC, useCallback, useState, useEffect, useRef } from 'react';
import { useSnackbar } from '@hooks/useSnackbar';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import SaleDetailsDialog from '@pages/sales/_components/SaleDetailsDialog';
import FlexBox from '@components/base/FlexBox';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';

type Sale = {
  id: string;
  number: number;
  date: Date;
  totalValue: number;
  paymentStatus: string;
  deliveryStatus: string;
  clientName: string;
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  box: {
    flexGrow: 1
  },
  dispatchedSale: {
    background: theme.palette.info.light,
    '&:hover': {
      background: theme.palette.info.light
    }
  },
  menuButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(1)
  }
}));

const deliveryStatus: { [key: string]: string } = {
  dispatched: 'Despachado',
  waiting: 'Esperando'
};

const filterText: { [key: string]: string } = {
  waiting: 'Vendas à espera',
  all: 'Todas as vendas'
}

const SalesList: FC = () => {
  const { addSnackbar } = useSnackbar();
  const classes = useStyles();

  const observer = useRef<any>();

  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState('waiting');

  const [deliveryStatusMenuAnchor, setListItemMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [saleDetailsDialog, setSaleDetailsDialog] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const getSalePages = useCallback(() => {
    if (sales.length === 0 || sales.length >= 20) setLoadingProgress(true);

    api.get('sales/pages', { params: { page } })
      .then((res) => {
        setSales((prev) => [...prev, ...res.data]);
        setHasMore(res.data.length > 0);
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
      })
      .finally(() => setLoadingProgress(false));
    // eslint-disable-next-line
  }, [page]);

  const getWaitingSales = useCallback(() => {
    setLoadingProgress(true);

    api.get('sales/waiting')
      .then((res) => {
        setSales(res.data);
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
      })
      .finally(() => setLoadingProgress(false));
    // eslint-disable-next-line
  }, []);

  const lastItemElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMore, setPage]);

  const closeDeliveryStatusMenu = () => {
    setListItemMenuAnchor(null);
  };

  const handleDeliveryStatusMenuClick = (e: any, id: string) => {
    e.stopPropagation();
    setListItemMenuAnchor(e.currentTarget);
    setSelectedId(id);
  };

  const closeFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterMenuClick = (e: any) => {
    setFilterMenuAnchor(e.currentTarget);
  };

  const handleDeliveryStatusMenuItemClick = (deliveryStatus: string) => {
    const sale = sales.find((sale) => sale.id === selectedId);

    if (sale) {
      sale.deliveryStatus = deliveryStatus;

      api.patch(`sales/${sale.id}/delivery-status`, { deliveryStatus })
        .then(() => {
          if (filter !== 'all') {
            setSales((prev) => prev.filter((sale) => sale.deliveryStatus !== deliveryStatus));
            return;
          }

          setSales((prev) => prev.map((sale) => {
            if (sale.id === selectedId) return { ...sale, deliveryStatus };
            return sale;
          }));
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
        });
    }

    closeDeliveryStatusMenu();
  };

  const handleFilterMenuItemClick = (value: string) => {
    if (value === filter) return;
    
    setFilter(value);
    setSales([]);
    setPage(1);

    closeFilterMenu();
  };

  const handleListItemClick = (id: string) => {
    setSelectedId(id);
    setSaleDetailsDialog(true);
  }

  useEffect(() => {
    if (filter === 'waiting') {
      getWaitingSales();
      return;
    }

    getSalePages();
  }, [filter, getWaitingSales, getSalePages]);

  return (
    <div>
      <Box mx={1} mb={1}>
        <ButtonBase className={classes.menuButton} onClick={handleFilterMenuClick}>
          <Typography variant="body2">MOSTRAR</Typography>
          <Typography variant="body2" color="textSecondary">{filterText[filter]}</Typography>
        </ButtonBase>
      </Box>

      <Menu
        anchorEl={filterMenuAnchor}
        keepMounted
        open={!!filterMenuAnchor}
        onClose={closeFilterMenu}
      >
        <MenuItem dense selected={filter === 'waiting'} onClick={() => handleFilterMenuItemClick('waiting')}>
          Vendas à espera
        </MenuItem>
        <MenuItem dense selected={filter === 'all'} onClick={() => handleFilterMenuItemClick('all')}>
          Todas as vendas
        </MenuItem>
      </Menu>

      <List>
        {sales.map((sale, index) => (
          <React.Fragment key={sale.id}>
            <ListItem
              ref={filter === 'all' && index === sales.length - 1 ? lastItemElementRef : null}
              button
              className={`${sale.deliveryStatus === 'dispatched' && classes.dispatchedSale}`}
              onClick={() => handleListItemClick(sale.id)}
            >
              <ListItemText
                primary={
                  <>
                    <Typography>Nº {sale.number}</Typography>
                    <Typography>Cliente: {sale.clientName}</Typography>
                  </>
                }
              />

              <ListItemSecondaryAction>
                <Button onClick={(e) => handleDeliveryStatusMenuClick(e, sale.id)}>
                  {deliveryStatus[sale.deliveryStatus]}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            {index < sales.length - 1 && (
              <Divider />
            )}
          </React.Fragment>
        ))}
      </List>

      {!loadingProgress && sales.length === 0 && (
        <Typography variant="h6" align="center" color="textSecondary">
          Vazio...
        </Typography>
      )}

      {loadingProgress && (
        <FlexBox>
          <CircularProgress />
        </FlexBox>
      )}

      <Menu
        anchorEl={deliveryStatusMenuAnchor}
        keepMounted
        open={!!deliveryStatusMenuAnchor}
        onClose={closeDeliveryStatusMenu}
      >
        <MenuItem
          selected={sales.find((sale) => sale.id === selectedId)?.deliveryStatus === 'waiting'}
          onClick={() => handleDeliveryStatusMenuItemClick('waiting')}
        >
          Esperando
        </MenuItem>
        <MenuItem
          selected={sales.find((sale) => sale.id === selectedId)?.deliveryStatus === 'dispatched'}
          onClick={() => handleDeliveryStatusMenuItemClick('dispatched')}
        >
          Despachado
        </MenuItem>
      </Menu>

      {saleDetailsDialog && (
        <SaleDetailsDialog
          editable={false}
          saleId={selectedId}
          onClose={() => setSaleDetailsDialog(false)}
        />
      )}
    </div>
  );
};

export default SalesList;
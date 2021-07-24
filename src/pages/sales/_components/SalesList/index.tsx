import React, { FC, useState, useCallback, useEffect, useRef, useMemo, SetStateAction } from 'react';
import { useSnackbar } from '@hooks/useSnackbar';
import { alertDialog } from '@hooks/useAlertDialog';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import MoreVert from '@material-ui/icons/MoreVert';

import FlexBox from '@components/base/FlexBox';
import ProgressDialog from '@components/dialog/ProgressDialog';
import SaleDetailsDialog from '../SaleDetailsDialog';
import EditSaleDialog from '../EditSaleDialog';

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';
import { format as formatDate } from 'date-fns';

type SalesListProps = {
  sales: Sale[];
  setSales(value: SetStateAction<Sale[]>): void;
  page: number;
  setPage(value: SetStateAction<number>): void;
  filter?: string;
  query?: string;
  onSaleEdited(): void;
};

type Sale = {
  id: string;
  number: number;
  date: Date;
  totalValue: number;
  paymentStatus: string;
  deliveryStatus: string;
  clientName: string;
};

type MemoSales = {
  [key: string]: Sale[];
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    flexGrow: 1,
    border: 'none'
  },
  listItem: {
    padding: 0
  }
}));

const deliveryStatus: { [key: string]: string } = {
  completed: 'Finalizado',
  waiting: 'Esperando'
};

const paymentStatus: { [key: string]: string } = {
  paid: 'Pago',
  pending: 'Não Pago'
};

const SalesList: FC<SalesListProps> = (props) => {
  const { sales, setSales, page, setPage, filter, query, onSaleEdited } = props;

  const { addSnackbar } = useSnackbar();
  const classes = useStyles();

  const observer = useRef<any>();

  // const [sales, setSales] = useState<Sale[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [contextMenu, setContextMenu] = useState<any>({ mouseX: null, mouseY: null });
  const [deleteProgress, setDeleteProgress] = useState(false);
  const [saleDetailsDialog, setSaleDetailsDialog] = useState(false);
  const [editSaleDialog, setEditSaleDialog] = useState(false);

  const getSales = useCallback(() => {
    if (!query) {
      api.get('sales/pages', { params: { page } })
        .then((res) => {
          setSales((prev: Sale[]) => [...prev, ...res.data]);
          setHasMore(res.data.length > 0);
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
        });
    }
    // eslint-disable-next-line
  }, [page, query]);

  const searchSalesByClientName = useCallback(() => {
    if (query) {
      api.get('sales/search', {
        params: {
          filter,
          clientName: query,
          page
        }
      })
        .then((res) => {
          setSales((prev: Sale[]) => [...prev, ...res.data]);
          setHasMore(res.data.length > 0);
        })
        .catch((err) => {
          handleAxiosError(err, addSnackbar);
        });
    }
    // eslint-disable-next-line
  }, [query, page]);

  const lastItemElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMore, setPage]);

  const editSale = () => {
    setEditSaleDialog(true);
    setMenuAnchor(null);
    setContextMenu({ mouseX: null, mouseY: null });
  };

  const deleteSale = () => {
    closeMenu();
    closeContextMenu();
    alertDialog({
      message: 'Tem certeza que quer apagar essa venda?',
      onConfirmation: () => {
        setDeleteProgress(true);
        api.delete(`/sales/${selectedId}`)
          .then(() => {
            addSnackbar('Venda apagada com sucesso!');
            setSales((prev: Sale[]) => prev.filter((sale: Sale) => sale.id !== selectedId));
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
    e.stopPropagation();
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

  const handleListItemClick = (id: string) => {
    setSelectedId(id);
    setSaleDetailsDialog(true);
  };

  const handleSaleDeleteFromDialog = (id: string) => {
    setSales((prev: Sale[]) => prev.filter((sale: Sale) => sale.id !== selectedId));
  };

  const handleSaleEdited = () => {
    onSaleEdited();
  };

  const memoSales = useMemo(() => {
    return sales.reduce((acc, curr) => {
      const date = formatDate(new Date(curr.date), 'dd/MM/yyyy');

      if (!acc[date]) {
        acc[date] = [];
        acc[date].push(curr);
      } else {
        acc[date].push(curr);
      }

      return acc;
    }, {} as MemoSales);
  }, [sales]);

  useEffect(() => {
    getSales();
  }, [getSales]);

  useEffect(() => {
    if (filter === 'clientName') {
      searchSalesByClientName();
    }
  }, [filter, searchSalesByClientName]);

  // useEffect(() => {
  //   setPage(1);
  //   setSales([]);
  // }, [query]);

  return (
    <div>
      <List subheader={<li />}>
        {Object.keys(memoSales).map((date, dateIndex) => (
          <React.Fragment key={dateIndex}>
            <li>
              <ul>
                <ListSubheader>
                  {date}
                </ListSubheader>
                {memoSales[date].map((sale: Sale, saleIndex: number) => (
                  <React.Fragment key={sale.id}>
                    <ListItem
                      ref={dateIndex === Object.keys(memoSales).length - 1 && saleIndex === memoSales[date].length - 1 ? lastItemElementRef : null}
                      button
                      className={classes.listItem}
                      onClick={() => handleListItemClick(sale.id)}
                    >
                      <Paper
                        className={classes.paper}
                        variant="outlined"
                        onContextMenu={(e) => handleContextMenu(e, sale.id)}
                      >
                        <FlexBox items="flex-start" content="space-between">
                          <Box m={2} style={{ flexGrow: 1 }}>
                            <FlexBox content="space-between">
                              <Typography variant="body2">Nº {sale.number}</Typography>
                              <Typography variant="body2" color="textSecondary">{deliveryStatus[sale.deliveryStatus]}</Typography>
                            </FlexBox>

                            <Typography variant="body2">
                              Cliente: <Typography component="span" variant="body2" color="primary">{sale.clientName}</Typography>
                            </Typography>

                            <FlexBox content="space-between">
                              <Typography variant="body2">
                                Total: <Typography component="span" variant="body2" color="primary">{sale.totalValue}</Typography>
                              </Typography>
                              <Typography variant="body2" color="textSecondary">{paymentStatus[sale.paymentStatus]}</Typography>
                            </FlexBox>
                          </Box>

                          <Box mt={1.5} mr={0.5}>
                            <IconButton size="small" onClick={(e) => handleMenuClick(e, sale.id)}>
                              <MoreVert />
                            </IconButton>
                          </Box>
                        </FlexBox>
                      </Paper>
                    </ListItem>
                    {saleIndex < memoSales[date].length - 1 && (
                      <>
                        <Divider />
                      </>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </li>
            {dateIndex < Object.keys(memoSales).length - 1 && (
              <>
                <br />
              </>
            )}
          </React.Fragment>
        ))}
      </List>

      <Menu
        anchorEl={menuAnchor}
        keepMounted
        open={!!menuAnchor}
        onClose={closeMenu}
      >
        <MenuItem dense onClick={editSale}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteSale}>
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
        <MenuItem dense onClick={editSale}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteSale}>
          Apagar
        </MenuItem>
      </Menu>

      <ProgressDialog
        open={deleteProgress}
        text="Aguarde. Apagando venda."
        onClose={() => setDeleteProgress(false)}
      />

      <SaleDetailsDialog
        saleId={selectedId}
        open={saleDetailsDialog}
        onClose={() => setSaleDetailsDialog(false)}
        onEdit={editSale}
        onDelete={handleSaleDeleteFromDialog}
      />

      <EditSaleDialog
        saleId={selectedId}
        open={editSaleDialog}
        onClose={() => setEditSaleDialog(false)}
        onEdited={handleSaleEdited}
      />
    </div>
  );
};

export default SalesList;
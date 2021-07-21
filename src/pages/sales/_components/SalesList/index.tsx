import React, { FC, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
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

import api from '@services/api';
import handleAxiosError from '@utils/handleAxiosError';
import { format as formatDate } from 'date-fns';

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
    border: 'none',
    // borderRadius: 0
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
  pending: 'Pendente'
};

const SalesList: FC = () => {
  const history = useHistory();
  const { addSnackbar } = useSnackbar();
  const classes = useStyles();

  const observer = useRef<any>();

  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [expandCollapse, setExpandCollapse] = useState<string[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [contextMenu, setContextMenu] = useState<any>({ mouseX: null, mouseY: null });
  const [deleteProgress, setDeleteProgress] = useState(false);

  const getSales = useCallback(() => {
    api.get('sales/pages', { params: { page } })
      .then((res) => {
        setSales((prev) => [...prev, ...res.data]);
        setHasMore(res.data.length > 0);
      })
      .catch((err) => {
        handleAxiosError(err, addSnackbar);
      });
    // eslint-disable-next-line
  }, [page]);

  const lastItemElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMore]);

  const editSale = () => {
    history.push(`/sales/edit/${selectedId}`);
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
            setSales(prev => prev.filter(sale => sale.id !== selectedId));
          })
          .catch((err) => handleAxiosError(err, addSnackbar))
          .finally(() => setDeleteProgress(false));
      }
    });
  };

  const handleExpandCollapse = (id: string) => {
    if (expandCollapse.includes(id)) {
      setExpandCollapse((prev) => prev.filter((el) => el !== id));
      return;
    }

    setExpandCollapse((prev) => [...prev, id]);
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
  }, [getSales, page]);

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
                {memoSales[date].map((sale, saleIndex) => (
                  <React.Fragment key={sale.id}>
                    <ListItem
                      ref={dateIndex === Object.keys(memoSales).length - 1 && saleIndex === memoSales[date].length - 1 ? lastItemElementRef : null}
                      button
                      className={classes.listItem}
                    >
                      <Paper
                        className={classes.paper}
                        variant="outlined"
                        onContextMenu={(e) => handleContextMenu(e, sale.id)}
                        onClick={() => handleExpandCollapse(sale.id)}
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
        {/* <MenuItem dense onClick={() => manageSale()}>
          Gerenciar
        </MenuItem> */}
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
        {/* <MenuItem dense onClick={() => manageSale()}>
          Gerenciar
        </MenuItem> */}
        <MenuItem dense onClick={editSale}>
          Editar
        </MenuItem>
        <MenuItem dense onClick={deleteSale}>
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

export default SalesList;
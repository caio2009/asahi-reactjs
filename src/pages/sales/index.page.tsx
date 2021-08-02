import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';

import AppBar from '@components/base/AppBar';
import Fab from '@components/base/Fab';
import SaleSearchBar from './_components/SalesSearchBar';
import SalesList from './_components/SalesList';

type Sale = {
  id: string;
  number: number;
  date: Date;
  totalValue: number;
  paymentStatus: string;
  deliveryStatus: string;
  clientName: string;
};

const SalesPage: FC = () => {
  const history = useHistory();

  const [page, setPage] = useState(1);
  const [sales, setSales] = useState<Sale[]>([]);

  const [salesSearchBar, setSaleSearchBar] = useState(false);
  // eslint-disable-next-line
  const [filter, setFilter] = useState('clientName');
  const [searchValue, setSearchValue] = useState('');

  const goBack = () => {
    history.goBack();
  };

  const newSale = () => {
    history.push('/sales/new');
  };

  const handleSearchSubmit = (value: string) => {
    setSales([]);
    
    if (filter === 'clientName') {
      setSearchValue(value);
    }

    setPage(1);
  };

  const handleSearchClear = () => {
    setSales([]);
    setSearchValue('');
    setPage(1);
  };

  const handleSaleEdited = () => {
    setSaleSearchBar(false);
    setSales([]);
    setSearchValue('');
    setPage(1);
  }

  return (
    <div>
      <AppBar
        title="Vendas"
        backButton
        goBack={goBack}
        extra={
          <>
            <IconButton onClick={() => setSaleSearchBar(true)}>
              <SearchIcon htmlColor="#fff" />
            </IconButton>
          </>
        }
      />

      <SaleSearchBar 
        open={salesSearchBar}
        value={searchValue}
        onClose={() => setSaleSearchBar(false)}
        onSubmit={handleSearchSubmit}
        onClear={handleSearchClear}
      />

      <Box mt={8}>
        <SalesList
          sales={sales}
          setSales={setSales}
          page={page}
          setPage={setPage}
          filter={filter}
          query={searchValue}
          onSaleEdited={handleSaleEdited}
        />
      </Box>

      <Fab bottom={8} color="primary" onClick={newSale}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default SalesPage;
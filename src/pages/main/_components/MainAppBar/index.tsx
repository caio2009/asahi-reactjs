import React, { FC } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import HideOnScroll from '@components/base/HideOnScroll';

import MenuOutlined from '@material-ui/icons/MenuOutlined';

interface MainAppBarProps {
  onMenuClick(): void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  toolbar: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0)
  }
}));

const MainAppBar: FC<MainAppBarProps> = (props) => {
  const { onMenuClick } = props;

  const classes = useStyles();

  return (
    <HideOnScroll>
      <AppBar>
        <Toolbar variant="dense" className={classes.toolbar}>
          <IconButton onClick={onMenuClick}>
            <MenuOutlined htmlColor="#fff" />
          </IconButton>

          <Typography variant="h6">
            Asahi
          </Typography>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default MainAppBar;
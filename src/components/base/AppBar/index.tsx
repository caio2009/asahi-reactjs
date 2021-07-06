import React, { FC } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import MaterialAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ArrowBack from '@material-ui/icons/ArrowBack';
import Menu from '@material-ui/icons/Menu';

import HideOnScroll from '@components/base/HideOnScroll';

interface AppBarProps {
  title: string;
  backButton?: boolean;
  menuButton?: boolean;
  goBack?(): void;
  onMenuClick?(): void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  toolbar: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0)
  }
}));

const AppBar: FC<AppBarProps> = (props) => {
  let { 
    title, 
    backButton = true, 
    menuButton = false,
    goBack = () => null,
    onMenuClick = () => null
  } = props;

  const classes = useStyles();

  return (
    <HideOnScroll>
      <MaterialAppBar>
        <Toolbar variant="dense" className={classes.toolbar}>
          {menuButton && (
            <IconButton onClick={onMenuClick}>
              <Menu htmlColor="#fff" />
            </IconButton>
          )}

          {backButton && !menuButton ? (
            <IconButton onClick={goBack}>
              <ArrowBack htmlColor="#fff" />
            </IconButton>
          ) : (
            <Box px={1}></Box>
          )}

          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </MaterialAppBar>
    </HideOnScroll>
  );
};

export default AppBar;
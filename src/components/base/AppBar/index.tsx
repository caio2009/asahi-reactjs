import React, { FC, useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import MaterialAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';

import ArrowBack from '@material-ui/icons/ArrowBack';
import MoreVert from '@material-ui/icons/MoreVert';
import MenuIcon from '@material-ui/icons/Menu';

import HideOnScroll from '@components/base/HideOnScroll';
import FlexBox from '@components/base/FlexBox';

interface AppBarProps {
  title: string;
  subTitle?: string;
  backButton?: boolean;
  menuButton?: boolean;
  moreOptions?: any;
  extra?: any;
  goBack?(): void;
  onMenuClick?(): void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  toolbar: {
    paddingLeft: 0,
    paddingRight: 0
  },
  title: {
    overflow: 'hidden',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
  }
}));

const AppBar: FC<AppBarProps> = (props) => {
  let {
    title,
    subTitle,
    backButton = true,
    menuButton = false,
    moreOptions,
    extra,
    goBack = () => null,
    onMenuClick = () => null
  } = props;

  const classes = useStyles();

  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);

  const closeMenu = () => {
    setMenuAnchor(null);
  }

  const handleMoreClick = (e: any) => {
    setMenuAnchor(e.currentTarget);
  }

  return (
    <HideOnScroll>
      <MaterialAppBar>
        <Toolbar variant="dense" className={classes.toolbar}>
          {menuButton && (
            <IconButton onClick={onMenuClick}>
              <MenuIcon htmlColor="#fff" />
            </IconButton>
          )}

          {backButton && !menuButton ? (
            <IconButton onClick={goBack}>
              <ArrowBack htmlColor="#fff" />
            </IconButton>
          ) : (
            <Box px={1}></Box>
          )}

          <FlexBox direction="column" items="flex-start" flexGrow={1} style={{ minWidth: 0 }}>
            <Typography className={classes.title}>{title}</Typography>

            {subTitle && (
              <Typography variant="caption">{subTitle}</Typography>
            )}
          </FlexBox>

          {extra && (
            <FlexBox style={{ marginRight: 8 }}>
              {extra}
            </FlexBox>
          )}

          {moreOptions && (
            <>
              <IconButton onClick={handleMoreClick}>
                <MoreVert htmlColor="#fff" />
              </IconButton>

              <Menu
                anchorEl={menuAnchor}
                keepMounted
                open={!!menuAnchor}
                onClose={closeMenu}
              >
                {moreOptions}
              </Menu>
            </>
          )}
        </Toolbar>
      </MaterialAppBar>
    </HideOnScroll>
  );
};

export default AppBar;
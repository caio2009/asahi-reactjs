import React, { FC } from 'react';

import MaterialFab, { FabProps as MaterialFabProps } from '@material-ui/core/Fab';

import { FabContainer } from './styles';

interface FabProps extends MaterialFabProps {
  bottom?: number;
}

const Fab: FC<FabProps> = (props) => {
  const { children, bottom } = props;

  return (
    <FabContainer bottom={bottom}>
      <MaterialFab {...props}>
        {children}
      </MaterialFab>
    </FabContainer>
  );
};

export default Fab;
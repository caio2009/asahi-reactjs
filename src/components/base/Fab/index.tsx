import React, { FC } from 'react';

import MaterialFab, { FabProps as MaterialFabProps } from '@material-ui/core/Fab';

import { FabContainer } from './styles';

interface FabProps extends MaterialFabProps {
  position?: 'fixed' | 'absolute';
  bottom?: number;
}

const Fab: FC<FabProps> = (props) => {
  const { children, position, bottom } = props;

  return (
    <FabContainer position={position} bottom={bottom}>
      <MaterialFab {...props}>
        {children}
      </MaterialFab>
    </FabContainer>
  );
};

export default Fab;
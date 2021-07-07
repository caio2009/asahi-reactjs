import React, { FC } from 'react';

import { FlexBoxContainer } from './styles';

type FlexBoxProps = {
  direction?: 'row' | 'column';
  items?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  content?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
}

const FlexBox: FC<FlexBoxProps> = ({ children, ...rest }) => {
  return (
    <FlexBoxContainer {...rest}>
      {children}
    </FlexBoxContainer>
  );
};

export default FlexBox;
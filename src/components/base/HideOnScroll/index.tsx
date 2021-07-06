import React, { FC } from 'react';

import Slide, { SlideProps } from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

const HideOnScroll: FC<SlideProps> = (props) => {
  const { children } = props;

  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export default HideOnScroll;
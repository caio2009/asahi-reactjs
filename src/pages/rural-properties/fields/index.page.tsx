import React, { FC } from 'react';

import Add from '@material-ui/icons/Add';

import RuralPropertyFieldsList from '../_components/RuralPropertyFieldsList';
import Fab from '@components/base/Fab';

type RuralPropertyFieldsPageProps = {
  ruralPropertyId: string;
};

const RuralPropertyFieldsPage: FC<RuralPropertyFieldsPageProps> = (props) => {
  const { ruralPropertyId } = props;

  const newField = () => {

  };

  return (
    <div>
      <RuralPropertyFieldsList ruralPropertyId={ruralPropertyId} />

      <Fab bottom={8} color="primary" onClick={newField}>
        <Add />
      </Fab>
    </div>
  );
};

export default RuralPropertyFieldsPage;
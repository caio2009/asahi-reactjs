import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import AddIcon from '@material-ui/icons/Add';

import RuralPropertyFieldsList from '../_components/RuralPropertyFieldsList';
import Fab from '@components/base/Fab';

type RuralPropertyFieldsPageProps = {
  ruralPropertyId: string;
};

const RuralPropertyFieldsPage: FC<RuralPropertyFieldsPageProps> = (props) => {
  const { ruralPropertyId } = props;

  const history = useHistory();

  const newField = () => {
    history.push(`/rural-properties/${ruralPropertyId}/fields/new`);
  };

  return (
    <div>
      <RuralPropertyFieldsList ruralPropertyId={ruralPropertyId} />

      <Fab bottom={8} color="primary" onClick={newField}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default RuralPropertyFieldsPage;
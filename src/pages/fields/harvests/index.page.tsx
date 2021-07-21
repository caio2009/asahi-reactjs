import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import AddIcon from '@material-ui/icons/Add';

import FieldHarvestsList from '../_components/FieldHarvestsList';
import Fab from '@components/base/Fab';

type FieldHarvestsPageProps = {
  fieldId: string;
};

const FieldHarvestsPage: FC<FieldHarvestsPageProps> = (props) => {
  const { fieldId } = props;

  const history = useHistory();

  const newField = () => {
    history.push(`/fields/${fieldId}/harvests/new`);
  };

  return (
    <div>
      <FieldHarvestsList fieldId={fieldId} />

      <Fab bottom={8} color="primary" onClick={newField}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default FieldHarvestsPage;
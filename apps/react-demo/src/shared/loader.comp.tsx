import { CircularProgress } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

export const LoaderComp: FunctionComponent = () => {
  return (
    <div
      style={{ display: 'flex', margin: '40px', justifyContent: 'center', alignContent: 'center' }}
    >
      <CircularProgress />
    </div>
  );
};

import { CircularProgress, Container } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

export const LoaderComp: FunctionComponent = () => {
  return (
    <Container maxWidth="md">
      <CircularProgress />
    </Container>
  );
};

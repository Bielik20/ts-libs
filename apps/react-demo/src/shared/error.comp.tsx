import { Card, CardContent, Container } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent } from 'react';

type Props = {
  error: Error;
};

export const ErrorComp: FunctionComponent<Props> = ({ error }) => {
  return (
    <Container maxWidth="md">
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Error
          </Typography>
          <Typography variant="body2" component="p">
            {JSON.stringify(error, null, 2)}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

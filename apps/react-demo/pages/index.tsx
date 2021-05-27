import { Button, Card, CardActions, CardContent, Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { examples } from 'react-demo/examples/examples';
import { Link } from 'react-demo/layout/link';

export default function Index() {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h1" component="h1">
          Reactive State
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Recipes of different complexity how to use Reactive State utilities.
        </Typography>
      </Box>
      <Grid container spacing={5}>
        {examples.map((example) => (
          <Grid item key={example.title} sm={6} xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {example.title}
                </Typography>
                <Typography variant="body2" component="p">
                  {example.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} href={example.url} size="small">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

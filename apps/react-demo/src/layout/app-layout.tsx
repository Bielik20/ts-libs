import { Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { examples } from 'react-demo/examples/examples';
import { Link } from 'react-demo/layout/link';
import { ProductsFlagsCont } from '../products/ui/products-flags.cont';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

export const AppLayout: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title} component={Link} naked href="/">
            Reactive State
          </Typography>
          {examples.map((example) => (
            <Button key={example.title} color="inherit" component={Link} naked href={example.url}>
              {example.title}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          {children}
        </Grid>
        <Grid item xs={3}>
          <ProductsFlagsCont />
        </Grid>
      </Grid>
    </>
  );
};

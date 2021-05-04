import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from 'react-demo/layout/link';

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
          <Typography variant="h6" className={classes.title}>
            Reactive Store
          </Typography>
          <Button color="inherit" component={Link} naked href="/">
            Home
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};

import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { FunctionComponent } from 'react';

type Props = {
  title: string;
  flags: string[];
};

const useStyles = makeStyles((theme) => ({
  cardMargin: {
    margin: theme.spacing(3),
  },
}));

export const ProductsFlagsCard: FunctionComponent<Props> = ({ title, flags }) => {
  const classes = useStyles();

  return (
    <Card className={classes.cardMargin}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
        <ul>
          {flags.map((flag) => (
            <li key={flag}>
              <Typography variant="body1" component="p">
                {' '}
                {flag}
              </Typography>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

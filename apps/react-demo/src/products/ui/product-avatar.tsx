import { Avatar, createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Check, Close } from '@material-ui/icons';
import { FunctionComponent } from 'react';
import { Product } from '../models/product';

type Props = {
  product: Product;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      color: theme.palette.error.contrastText,
      backgroundColor: theme.palette.error.main,
    },
    success: {
      color: theme.palette.success.contrastText,
      backgroundColor: theme.palette.success.main,
    },
  }),
);

export const ProductAvatar: FunctionComponent<Props> = ({ product }) => {
  const classes = useStyles();

  return (
    <Avatar className={product.shouldFail ? classes.error : classes.success}>
      {product.shouldFail ? <Close /> : <Check />}
    </Avatar>
  );
};

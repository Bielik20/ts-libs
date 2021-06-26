import { SupportedStyles } from '@nrwl/react/typings/style';

export interface Schema  {
  name: string;
  style: SupportedStyles;
  tags?: string;
}

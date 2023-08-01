import { SupportedStyles } from '@nx/react/typings/style';

export interface Schema {
  name: string;
  style: SupportedStyles;
  tags?: string;
}

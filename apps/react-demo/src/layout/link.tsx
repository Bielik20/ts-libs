import { LinkTypeMap } from '@material-ui/core/Link/Link';
import { OverrideProps } from '@material-ui/core/OverridableComponent';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

type AProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;
type NextComposedProps = NextLinkProps & AProps;
type MuiLinkProps = OverrideProps<LinkTypeMap, React.ElementType>;
export type LinkProps = NextComposedProps & MuiLinkProps;

export const Link = React.forwardRef(function Link(props: LinkProps, ref) {
  return <NextLink ref={ref as any} {...props} />;
});

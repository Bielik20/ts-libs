import MuiLink from '@material-ui/core/Link';
import { LinkTypeMap } from '@material-ui/core/Link/Link';
import { OverrideProps } from '@material-ui/core/OverridableComponent';
import clsx from 'clsx';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { UrlObject } from 'url';

type AProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;
type NextComposedProps = NextLinkProps & AProps;
type MuiLinkProps = OverrideProps<LinkTypeMap, React.ElementType>;
export type LinkProps = NextComposedProps & MuiLinkProps;

const NextComposed = React.forwardRef(function NextComposed(props: NextComposedProps, ref) {
  const { as, href, ...other } = props;

  return (
    <NextLink href={href} as={as}>
      <a ref={ref as any} {...other} />
    </NextLink>
  );
});

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
function StyledLink(props: LinkProps) {
  const {
    href,
    activeClassName = 'active',
    className: classNameProps,
    innerRef,
    naked,
    ...other
  } = props;

  const router = useRouter();
  const pathname = typeof href === 'string' ? href : (href as UrlObject).pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  });

  if (naked) {
    return <NextComposed className={className} ref={innerRef} href={href} {...other} />;
  }

  return (
    <MuiLink component={NextComposed} className={className} ref={innerRef} href={href} {...other} />
  );
}

export const Link = React.forwardRef(function Link(props: LinkProps, ref) {
  return <StyledLink {...props} innerRef={ref} />;
});

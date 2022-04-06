import React from 'react';
import * as Fluent from '@fluentui/react';
import * as Router from 'react-router-dom';

interface IIconButtonProps extends Omit<Fluent.IButtonProps, "href"> {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: Router.To;
}

interface IIconButtonProps2 extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: Router.To;
}

export const RdzLink = React.forwardRef<HTMLAnchorElement, Router.LinkProps>(
  function LinkWithRef(
    { onClick, reloadDocument, replace = false, state, target, to, ...rest },
    ref
  ) {
    let href = Router.useHref(to);
    let internalOnClick = Router.useLinkClickHandler(to, { replace, state, target });
    function handleClick(
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented && !reloadDocument) {
        internalOnClick(event);
      }
    }

    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a
        {...rest}
        href={href}
        onClick={handleClick}
        ref={ref}
        target={target}
      />
    );
  }
);



export const RouterIconButton = React.forwardRef<Fluent.IconButton, IIconButtonProps>(
  function ButtonWithRef(
    { onClick, reloadDocument, replace = false, state, target, to, ...rest },
    ref) {
      let href = Router.useHref(to);
      let internalOnClick = Router.useLinkClickHandler(to, { replace, state, target });
      function handleClick(
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
      ) {
        if (onClick) onClick(event);
        if (!event.defaultPrevented && !reloadDocument) {
          internalOnClick(event);
        }
      }
  
      return (
      <Fluent.IconButton
        {...rest}
        href={href}
        onClick={handleClick}
        ref={ref}
        target={target}
      />
      );
  }
);
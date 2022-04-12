import React from 'react';
import * as Fluent from '@fluentui/react';
import * as Router from 'react-router-dom';
import * as Types from './Types';

export const RouterIconButton = React.forwardRef<Fluent.IconButton, Types.IIconButtonProps>(
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

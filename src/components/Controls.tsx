import React from 'react';
import * as Fluent from '@fluentui/react';
import * as Router from 'react-router-dom';
import * as Types from './Types';
import * as codeStyles from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter, { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import * as Hooks from '@fluentui/react-hooks';
import { v4 as uuidv4 } from 'uuid';
import Markdown from 'marked-react';


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

export const RouterLink = React.forwardRef<HTMLElement, Types.ILinkProps>(
  function LinkWithRef(
    { onClick, reloadDocument, replace = false, state, target, to, ...rest },
    ref) {
      let href = Router.useHref(to);
      let internalOnClick = Router.useLinkClickHandler(to, { replace, state, target });
      function handleClick(
        event: any
      ) {
        if (onClick) onClick(event);
        if (!event.defaultPrevented && !reloadDocument) {
          internalOnClick(event);
        }
      }
  
      return (
      <Fluent.Link
        {...rest}
        href={href}
        onClick={handleClick}
        ref={ref}
        target={target}
      />
      );
  }
);

export const RouterDocumentCard = React.forwardRef<Fluent.IDocumentCard, Types.IDocumentCardProps>(
  function LinkWithRef(
    { onClick, reloadDocument, replace = false, state, to, ...rest }, ref) {
      let href = Router.useHref(to);
      let internalOnClick = Router.useLinkClickHandler(to, { replace, state });
      function handleClick(
        event: any
      ) {
        if (onClick) onClick(event);
        if (!event.defaultPrevented && !reloadDocument) {
          internalOnClick(event);
        }
      }
  
      return (
      <Fluent.DocumentCard
        {...rest}
        onClickHref={href}
        onClick={handleClick}
      />
      );
  }
);

export const CodeBlock = React.forwardRef<SyntaxHighlighter, SyntaxHighlighterProps>(
  function SynHighlighter({ ...rest }, ref) {
    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = Hooks.useBoolean(false);
    const btnCopy = Hooks.useId('btnCopy');
    const [targetControlId, setTargetControlId] = React.useState<string>();
    return (
      <React.Fragment>
        <Fluent.IconButton iconProps={{ iconName: "Copy" }} id={btnCopy} key={uuidv4()} onClick={() => {
          setTargetControlId(btnCopy);
          navigator.clipboard.writeText(rest.children as string);
          toggleIsCalloutVisible();
          setTimeout(toggleIsCalloutVisible, 1000);
        }} />
				{
					isCalloutVisible && targetControlId && (
						<Fluent.Callout target={`#${targetControlId}`} key={uuidv4()}>
							<Fluent.Text>The code below is now in the clipboard.</Fluent.Text>
						</Fluent.Callout>
					)
				}
        <SyntaxHighlighter {...rest} ref={ref}>
        </SyntaxHighlighter>
      </React.Fragment>
    );
  }
);

export const RdzMarkdown: React.FunctionComponent<{require:any}> = ({children,require}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [markdown, setMarkdown] = React.useState<any>();
  
  React.useEffect(() => {
    setIsLoading(true);
    fetch(require).then(response => response.text()).then(text => {
      setMarkdown(text);
    }).finally(() => setIsLoading(false));
  }, []);

  return (
		<React.Fragment>
      {
				isLoading && (
					<Fluent.ProgressIndicator label="Fetching" description="Fetching the markdown content..." />
				)
			}
      {
        !isLoading && (
          <Markdown value={markdown} />
        )
      }
      
		</React.Fragment>
	);
};


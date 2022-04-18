import React from 'react';
import * as Fluent from '@fluentui/react';
import * as Router from 'react-router-dom';


export interface IIconButtonProps extends Omit<Fluent.IButtonProps, "href"> {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: Router.To;
}

export interface ILinkProps extends Omit<Fluent.ILinkProps, "href"> {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: Router.To;
}

export interface IDocumentCardProps extends Omit<Fluent.IDocumentCardProps, "onClickHref"> {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: Router.To;
}

export enum DisplayMode {
	AuthenticatedOnly,
	UnauthenticatedOnly
}
export enum MsalLoginType {
	Redirect,
	Popup
}
export enum CommandType {
	Heading,
	Normal
}
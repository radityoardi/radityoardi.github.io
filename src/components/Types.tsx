import React, { CSSProperties } from 'react';
import * as Fluent from '@fluentui/react';
import * as Router from 'react-router-dom';
import EditorJS, { API } from '@editorjs/editorjs';
import { Styles } from '@editorjs/editorjs/types/api';


export interface IIconButtonProps extends Omit<Fluent.IButtonProps, "href"> {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: Router.To;
}

export interface IActionButtonProps extends Omit<Fluent.IButtonProps, "href"> {
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

export interface IGoogleAccount {
  authenticated?: React.ReactNode;
  unauthenticated?: React.ReactNode;
  authenticatedHeader?: React.ReactNode;
  unauthenticatedHeader?: React.ReactNode;
  scopes?: string | string[] | undefined;
}

export interface IGoogleProfile {
  googleId: string,
  imageUrl: string,
  email: string,
  name: string,
  givenName: string,
  familyName: string,
}

export interface IEditorJs {
  Blocks?: any,
  contentHTML?: string,
  id?: string,
  autofocus?: boolean,
  style?: CSSProperties,
  label?: string,
  editorJsStyles?: Styles,
  onChange?(api: API, event: CustomEvent<any>): void,
  onReady?(): void,
}

export type GoogleProfile = IGoogleProfile | undefined;

export interface IGoogleProfileContext {
  profile: GoogleProfile,
  setProfile: React.Dispatch<React.SetStateAction<GoogleProfile>>
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
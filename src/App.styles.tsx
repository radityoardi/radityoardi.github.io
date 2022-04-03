import React, { CSSProperties } from 'react';
import * as Fluent from '@fluentui/react';
import './Fonts.scss';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { generateTheme, IThemeInfo } from './components/FluentThemeGenerator';

initializeIcons();

export const appTheme = generateTheme({
  primaryColor: "#942a9c", textColor: "#f5f5f5", backgroundColor: "#000000", partialTheme: {
    defaultFontStyle: {
      fontFamily: 'Overlock, Consolas',
      fontWeight: 'Regular'
    }
  }
} as IThemeInfo);

export const divBody: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: appTheme.palette.themeLighter
};

export const appBar: Fluent.IStackStyles = {
  root: {
    height: 50,
    maxHeight: 50,
  }
};
export const appLauncher: Fluent.IStackItemStyles = {
  root: {
    backgroundColor: appTheme.palette.themeDarker,
    width: 50,
    maxWidth: 50,
    justifyContent: 'center',
    alignContent: 'center'
  }
};
export const titleBar: Fluent.IStackItemStyles = {
  root: {
    backgroundColor: appTheme.palette.themeDark,
    display: 'flex',
    alignItems: 'center',
  }
};
export const titleBlock: CSSProperties = {
  color: appTheme.palette.white,
  display: "inline-block",
  fontSize: "28px",
  fontWeight: 'bolder',
  margin: "auto 15px"
};

export const appLauncherButton: CSSProperties = {
  height: '100%',
  width: '100%',
  borderRadius: 0
};

export const appLauncherIcon: CSSProperties = {
  color: appTheme.palette.white,
  fontSize: 38
};

export const divContent: CSSProperties = {
};
const appBlockDimension = 65;
export const appBlock: CSSProperties = {
  width: appBlockDimension,
  maxWidth: appBlockDimension,
  height: appBlockDimension,
  maxHeight: appBlockDimension,
  justifyContent: 'center',
  alignContent: 'center'
};
export const appIcons: CSSProperties = {
  fontSize: 40
};

export const stackBody: Fluent.IStackStyles = {
  root: {
    backgroundColor: appTheme.palette.white,
    maxWidth: "100vw",
    width: "80vw",
    margin: "4vh auto 10px auto",
    padding: "20px",
    borderRadius: "5px"
  }
};

export const copyright: CSSProperties = {
  maxWidth: "100vw",
  width: "80vw",
  margin: "10px auto",
  padding: "10px",
  fontSize: 'smaller',
  fontStyle: 'italic'
};

export const stackItemBody: Fluent.IStackItemStyles = {
  root: {
    minHeight: "400px"
  }
};
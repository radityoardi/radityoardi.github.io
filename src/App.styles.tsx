import React, { CSSProperties } from 'react';
import * as Fluent from '@fluentui/react';
import './Fonts.scss';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { generateTheme, IThemeInfo } from './components/utils/FluentThemeGenerator';

initializeIcons();

const randomLightThemes = [
  `#13C4A3`,
  `#39A0ED`,
  `#1B5299`,
  `#713E5A`,
  `#91CB3E`,
  `#E0CA3C`,
  `#EF6F6C`,
];

const randomDarkThemes = [] as string[];

const randomLightThemeIndex = Math.floor(Math.random() * randomLightThemes.length);
const randomDarkThemeIndex = Math.floor(Math.random() * randomDarkThemes.length);

export const appTheme = (() => {
  const randomDarkLight = Math.floor(Math.random() * 2);
  //const themeSpecific = randomDarkLight === 0 ? { primary: randomLightThemes[randomLightThemeIndex], textColor: "#333333", backgroundColor: "#ffffff" } : { primary: randomDarkThemes[randomDarkThemeIndex], textColor: "#ffffff", backgroundColor: "#333333" };
  const themeSpecific = { primary: randomLightThemes[randomLightThemeIndex], textColor: "#333333", backgroundColor: "#ffffff" };
  return generateTheme({
    primaryColor: themeSpecific.primary, textColor: themeSpecific.textColor, backgroundColor: themeSpecific.backgroundColor, partialTheme: {
      defaultFontStyle: {
        fontFamily: 'Abel, Consolas',
        fontWeight: 'Regular',
        fontSize: '20px'
      }
    }
  } as IThemeInfo);
})();

export const divBody: Fluent.IStackStyles = {
  root: {
    minHeight: "100vh",
    backgroundColor: appTheme.palette.themeLighter
  }
};

export const appBar: Fluent.IStackStyles = {
  root: {
    height: 50,
    maxHeight: 50,
    position: 'fixed',
    width: '100%',
    zIndex: 1000,
  }
};
export const siteIcon: Fluent.IImageStyles = {
  root: {
    height: 40,
    margin: 5,
  },
  image: {
  }
};
export const appLauncher: Fluent.IStackItemStyles = {
  root: {
    backgroundColor: appTheme.palette.themePrimary,
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

export const groupLabel: Fluent.ITextStyles = {
  root: {
    fontWeight: 'bold',
  }
};


export const appLauncherButton: Fluent.IButtonStyles = {
  root: {
    height: '100%',
    width: '100%',
    borderRadius: 0
  },
  icon: {
    color: appTheme.palette.white,
    fontSize: 40,
    height: 40,
    lineHeight: 40
  },
  iconHovered: {
    color: appTheme.palette.themeDark
  }
};

const appIconDimension = 40;
const appBlockDimension = 40;
const textBlockHeight = 18;

export const appIconButton: Fluent.IButtonStyles = {
  root: {
    height: '100%',
    //width: '100%',
    borderRadius: 15,
  },
  icon: {
    height: appIconDimension,
    lineHeight: appIconDimension
  }
};
export const appLauncherButton2: CSSProperties = {
  height: '100%',
  width: '100%',
  borderRadius: 0
};

export const appLauncherIcon: CSSProperties = {
  fontSize: 38
};

export const divContent: CSSProperties = {
  position: 'relative',
};


export const appBlock: Fluent.IStackStyles = {
  root: {
    //width: appBlockDimension,
    //maxWidth: appBlockDimension,
    //height: appBlockDimension + textBlockHeight,
    //maxHeight: appBlockDimension + textBlockHeight,
    height: appBlockDimension,
    maxHeight: appBlockDimension,
    //justifyContent: 'center',
    //alignContent: 'center',
    //border: 'solid 1px red', //test only
    //backgroundColor: 'beige', //test only
  }
};
export const appLabel: Fluent.ITextStyles = {
  root: {
    textAlign: 'center',
    display: 'inline-block',
    //backgroundColor: 'aqua', //test only
  }
};
export const appBlock2: CSSProperties = {
  width: appBlockDimension,
  maxWidth: appBlockDimension,
  height: appBlockDimension,
  maxHeight: appBlockDimension,
  justifyContent: 'center',
  alignContent: 'center',
  backgroundColor: appTheme.palette.themeLighter
};
export const appIcons: Fluent.IButtonStyles = {
  root: {
    fontSize: 40,
    backgroundColor: appTheme.palette.whiteTranslucent40
  }
};
export const appIcons2: CSSProperties = {
  fontSize: 40,
  backgroundColor: appTheme.palette.themeLighterAlt
};

export const stackBody: Fluent.IStackStyles = {
  root: {
    backgroundColor: appTheme.palette.white
  }
};

export const copyright: CSSProperties = {
  width: "80vw",
  margin: "10px auto 0 auto",
  padding: "5px",
  fontSize: 'smaller',
  fontStyle: 'italic',
  boxSizing: 'border-box',
  borderRadius: '2px',
  backgroundColor: appTheme.palette.white,
  boxShadow: '10px 10px 40px 0px rgba(0,0,0,0.5)'
};

export const stackItemBody: Fluent.IStackItemStyles = {
  root: {
    minHeight: "400px"
  }
};

export const blogItem: Fluent.IStackItemStyles = {
  root: {
    backgroundColor: appTheme.palette.neutralLight
  }
};

export const blogImage: Fluent.IImageStyles = {
  image: {

  },
  root: {
    borderColor: appTheme.palette.themeDark
  }
};

export const blogTag: Fluent.IStackItemStyles = {
  root: {
    backgroundColor: appTheme.palette.themeDark,
    color: appTheme.palette.themeLight
  }
};

export const bloggerEditorHeader: CSSProperties = {
  backgroundColor: appTheme.palette.themeLight
};

export const reactEditor: CSSProperties = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: appTheme.palette.themeLight,
  minHeight: 500,
};


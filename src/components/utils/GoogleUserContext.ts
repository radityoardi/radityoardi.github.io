import React from 'react';
import * as Types from '../Types';

export const GoogleUserContext = React.createContext<Types.IGoogleProfileContext>({
    profile: {} as Types.IGoogleProfile,
    setProfile: (value:any) => {}
});
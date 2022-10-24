import React from 'react';
import { gapi, loadAuth2 } from 'gapi-script';

export const useGoogleAccount = () => {
    const [profile, setProfile] = React.useState<any>(null);
    React.useEffect(() => {
        gapi.load('client:auth2', () => {
          gapi.client.init({
            clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENTID,
            scope: 'https://www.googleapis.com/auth/blogger'
          });
        });
      }, []);
    return [profile, setProfile];
};
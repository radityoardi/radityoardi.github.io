# My website's source code

Create `.env` file with the following format to successfully debug in your environment (`.env.development.local` or `.env.production.local`).

```
REACT_APP_AZUREAD_APP_CLIENTID={----}
REACT_APP_GOOGLEAPI_KEY={----}
REACT_APP_IMGBB_API_KEY={----}
REACT_APP_MAINBLOGID={----}
REACT_APP_VERSION={----}
REACT_APP_PIXABAYAPI_KEY={----}
REACT_APP_FBCOMMENT_BASEURL={----}
REACT_APP_MAINBLOGID={----}
REACT_APP_AZUREAD_APP_REDIRECTURL={----}
REACT_APP_GOOGLE_OAUTH_CLIENTID={----}
REACT_APP_GOOGLE_OAUTH_SCOPES=profile email https://www.googleapis.com/auth/blogger https://www.googleapis.com/auth/drive
REACT_APP_GOOGLE_OAUTH_DISCOVERYDOCS=https://www.googleapis.com/discovery/v1/apis/drive/v3/rest https://blogger.googleapis.com/$discovery/rest?version=v3

```
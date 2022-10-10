import express, { Express, Request, Response } from 'express';
const api: Express = express();
const port = process.env.PORT || 80;

/*
*/

/*
*/
api.get('/_api', (req, res) => {
    res.send('Hello World!');
  });
  
  api.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
  
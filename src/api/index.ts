import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';


const buildDir = path.join(process.cwd() + "/build");
const api: Express = express();
const port = process.env.PORT || 80;

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(express.static(buildDir));

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
  
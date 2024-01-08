import multer from 'multer'
import { resolve } from 'path'
import { Request, Response, NextFunction } from 'express'
import { HttpRequestDTO } from '../dtos/http'

const rootDirectory = resolve(__dirname,'..','..','..')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${rootDirectory}/static`)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export class ExpressMulterAdapter {
    static adapt(middleware: any, method: string) {
      const upload = multer({ storage }).single('file');
  
      return async (request: Request, response: Response, next: NextFunction) => {
        upload(request, response, (err: any) => {
          if (err) {
            return response.status(400).json({ error: err.message });
          }
        });

        const httpRequest: HttpRequestDTO = {
            body: request.body,
            params: request.params,
            headers: request.headers,
            file: {
                path: request.file?.path as string
            }
        };

        const httpResponse = await middleware[method](httpRequest);
        if (httpResponse === null) {
            return next();
        }

        if(httpResponse && typeof httpResponse.statusCode == 'undefined'){
            request.body = httpResponse;
            return next();
        }

        response.status(httpResponse.statusCode).json(httpResponse.body);
      };
    }
  }
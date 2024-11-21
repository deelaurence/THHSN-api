// custom.d.ts or multer.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      files?: Express.Multer.File[] | Express.Multer.File; // This adds `files` to the `Request` object
    }
  }
}

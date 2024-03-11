import * as fs from 'fs';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';

@Catch()
export class FileExceptionFillter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const req: Request = host.switchToHttp().getRequest();
    const file: Express.Multer.File = req.file;
    const files = req.files;
    if (file) {
      console.log(file, 'file');

      fs.unlink(file.path, (err) => {});
    }

    if (files) {
      Object.keys(files).some((key) => {
        if (files[key]) {
          for (const e of files[key]) {
            fs.unlink(e['path'], (err) => {});
          }
        }
      });
    }
    super.catch(exception, host);
  }
}

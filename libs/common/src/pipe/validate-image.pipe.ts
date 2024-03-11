import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
@Injectable()
export class ValidatorFilesPipe implements PipeTransform {
  private mimeTypes: string[];

  constructor(mimeTypes: string[]) {
    this.mimeTypes = mimeTypes;
  }

  transform(value: Express.Multer.File | Array<Express.Multer.File>) {
    for (const e in value) {
      if (Array.isArray(value[e])) {
        this.validator(value[e][0]);
      } else {
        this.validator(value as Express.Multer.File);
      }
    }
    return value;
  }

  validator(file?: Express.Multer.File) {
    const fileType = file.mimetype.split('/')[file.mimetype.split.length - 1];
    if (!this.mimeTypes.includes(fileType)) {
      throw new BadRequestException('ERROR_MIMETYPE_NOT_SUPPORT');
    }
  }
}

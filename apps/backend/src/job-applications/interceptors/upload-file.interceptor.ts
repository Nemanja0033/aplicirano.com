import {
    BadRequestException,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    mixin,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  
  export function UploadFileInterceptor() {
    return mixin(
      class implements NestInterceptor {
        public interceptor = new (FileInterceptor('text', {
          limits: {
            fileSize: 1 * 1024 * 1024, // 1MB
          },
          fileFilter: (req, file, cb) => {
            const allowedMime = ['text/plain'];
            const allowedExt = ['.txt'];
  
            const isValidMime = allowedMime.includes(file.mimetype);
            const isValidExt = allowedExt.some(ext =>
              file.originalname.toLowerCase().endsWith(ext),
            );
  
            if (!isValidMime || !isValidExt) {
              return cb(
                new BadRequestException('Only .txt files are allowed'),
                false,
              );
            }
  
            cb(null, true);
          },
        }))();
  
        intercept(context: ExecutionContext, next: CallHandler) {
          return this.interceptor.intercept(context, next);
        }
      },
    );
  }
  
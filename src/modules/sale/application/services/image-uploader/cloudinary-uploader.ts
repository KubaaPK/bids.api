import { ImageUploader } from './image-uploader';
import { AppLogger } from '../../../../common/app-logger';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ExceptionMessages } from '../../../../common/exception-messages';
import * as cloudinary from 'cloudinary/lib/v2';

@Injectable()
export class CloudinaryUploader implements ImageUploader {
  private readonly logger: AppLogger = new AppLogger(
    CloudinaryUploader.name,
    true,
  );

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  public async fromUrl(url: string): Promise<string> {
    try {
      const uploadedImage = await cloudinary.uploader.upload(url);
      return uploadedImage.secure_url;
    } catch (e) {
      console.log(e);
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}

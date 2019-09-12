export abstract class ImageUploader {
  public abstract async fromUrl(url: string): Promise<string>;
}

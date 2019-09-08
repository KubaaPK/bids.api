import { Uuid } from '../../../../../common/uuid';
import { SellingMode } from '../../../../domain/offer/selling-mode';
import { Parameter } from '../../../../domain/category/parameter';
import * as admin from 'firebase-admin';

export class NewDraftOfferDto {
  public readonly name: string;
  public readonly category?: {
    id: Uuid;
  };
  public readonly ean?: string;
  public readonly sellingMode?: SellingMode;
  public readonly description?: string;
  public readonly parameters?: Parameter[];

  public customer: admin.auth.DecodedIdToken;
}

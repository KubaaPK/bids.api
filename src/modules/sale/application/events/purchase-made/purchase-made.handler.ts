import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PurchaseMadeEvent } from './purchase-made.event';
import { OfferRepository } from '../../../domain/offer/offer.repository';

@EventsHandler(PurchaseMadeEvent)
export class PurchaseMadeHandler implements IEventHandler<PurchaseMadeEvent> {
  constructor(private readonly offerRepository: OfferRepository) {}

  public async handle(event: PurchaseMadeEvent): Promise<void> {
    const { offer, amount } = event;
    offer.updateStockAmount(amount);
    await this.offerRepository.save(offer);
  }
}

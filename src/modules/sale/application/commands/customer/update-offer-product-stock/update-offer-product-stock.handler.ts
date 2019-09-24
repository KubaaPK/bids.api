import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOfferProductStockCommand } from './update-offer-product-stock.command';
import { OfferRepository } from '../../../../domain/offer/offer.repository';

@CommandHandler(UpdateOfferProductStockCommand)
export class UpdateOfferProductStockHandler
  implements ICommandHandler<UpdateOfferProductStockCommand> {
  constructor(private readonly offerRepository: OfferRepository) {}

  public async execute(command: UpdateOfferProductStockCommand): Promise<void> {
    const { offer, amount } = command;
    offer.updateStockAmount(amount);
    await this.offerRepository.save(offer);
  }
}

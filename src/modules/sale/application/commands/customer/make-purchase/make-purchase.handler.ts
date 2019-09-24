import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { MakePurchaseCommand } from './make-purchase.command';
import { OfferRepository } from '../../../../domain/offer/offer.repository';
import { PurchaseRepository } from '../../../../domain/purchase/purchase.repository';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Offer } from '../../../../domain/offer/offer';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Purchase } from '../../../../domain/purchase/purchase';
import { PurchaseMadeEvent } from '../../../events/purchase-made/purchase-made.event';
import { Customer } from '../../../../domain/customer/customer';
import { NoItemsInStockException } from '../../../../domain/offer/exceptions/no-items-in-stock.exception';

@CommandHandler(MakePurchaseCommand)
export class MakePurchaseHandler
  implements ICommandHandler<MakePurchaseCommand> {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: MakePurchaseCommand): Promise<void> {
    const { newPurchase } = command;

    const offer: Offer = await this.offerRepository.findOne(
      newPurchase.offerId,
    );

    if (!offer) {
      throw new NotFoundException('Ofera o podanym ID nie istnieje.');
    }

    const offerOwner: Customer = await offer.customer;
    if (offerOwner.id === newPurchase.buyerId) {
      throw new UnprocessableEntityException(
        'Nie możesz kupować właśnych przedmiotów.',
      );
    }

    if (!offer.isPurchasePossible(newPurchase.amount)) {
      throw new NoItemsInStockException(
        newPurchase.amount,
        offer.stock.available,
      );
    }

    const purchase: Purchase = Purchase.create(newPurchase);
    const purchaseMade: Purchase = await this.purchaseRepository.save(purchase);
    await this.eventBus.publish(
      new PurchaseMadeEvent(
        newPurchase.buyerId,
        purchaseMade.id,
        newPurchase.amount,
        offer,
      ),
    );
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveSaleCommand } from './save-sale.command';
import { SaleRepository } from '../../../../domain/sale/sale.repository';
import { Sale } from '../../../../domain/sale/sale';

@CommandHandler(SaveSaleCommand)
export class SaveSaleHandler implements ICommandHandler<SaveSaleCommand> {
  constructor(private readonly saleRepository: SaleRepository) {}

  public async execute(command: SaveSaleCommand): Promise<any> {
    const { purchaseId, offer } = command;
    const sellerId = (await offer.customer).id;
    const sale: Sale = Sale.create(purchaseId, sellerId);
    await this.saleRepository.save(sale);
  }
}

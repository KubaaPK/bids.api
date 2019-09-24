import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChargeFeeCommand } from './charge-fee.command';
import { FeeRepository } from '../../../domain/fee/fee.repository';
import { Fee } from '../../../domain/fee/fee';
import { PurchaseRepository } from '../../../../sale/domain/purchase/purchase.repository';
import { Purchase } from '../../../../sale/domain/purchase/purchase';
import { NotFoundException } from '@nestjs/common';
import { Offer } from '../../../../sale/domain/offer/offer';
import { FeeCalculator } from '../../../domain/fee/fee-calculator';
import { CategoriesNames } from '../../dtos/write/calculatable-offer.dto';
import { CalculatedFeeDto } from '../../dtos/read/calculated-fee.dto';

@CommandHandler(ChargeFeeCommand)
export class ChargeFeeHandler implements ICommandHandler<ChargeFeeCommand> {
  constructor(
    private readonly feeRepository: FeeRepository,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly feeCalculator: FeeCalculator,
  ) {}

  public async execute(command: ChargeFeeCommand): Promise<any> {
    const { purchaseId, debtorId } = command;
    const purchase: Purchase = await this.purchaseRepository.findOne(
      purchaseId,
    );
    if (!purchase) {
      throw new NotFoundException('Zakup o podanym id nie istnieje.');
    }

    const offer: Offer = await purchase.offer;
    const offerCategoryName: string = (await offer.category).name;
    const calculatedFee: CalculatedFeeDto = this.feeCalculator.calculate({
      category: offerCategoryName as CategoriesNames,
      sellingMode: offer.sellingMode as any,
      amount: purchase.amount,
    });

    const fee: Fee = Fee.create(debtorId, purchaseId);
    fee.addFee({
      currency: calculatedFee.currency,
      amount: calculatedFee.amount,
    });
    await this.feeRepository.save(fee);
  }
}

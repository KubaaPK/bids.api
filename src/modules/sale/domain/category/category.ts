import { AggregateRoot } from '@nestjs/cqrs';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Uuid } from '../../../common/uuid';
import { NewCategoryDto } from '../../application/dtos/write/category/new-category.dto';
import { UpdatedCategoryDto } from '../../application/dtos/write/category/updated-category.dto';
import { Parameter } from './parameter';
import { ParameterAlreadyLinkedToCategoryException } from './exceptions/parameter-already-linked-to-category.exception';
import { Offer } from '../offer/offer';

@Entity('categories')
export class Category {
  @PrimaryColumn('uuid')
  public id: Uuid;

  @Column({
    nullable: false,
    unique: true,
  })
  public name: string;

  @Column({
    nullable: false,
  })
  public leaf: boolean;

  @ManyToOne(type => Category, category => category.children, {
    onDelete: 'CASCADE',
  })
  public parent: Category;

  @OneToMany(type => Category, category => category.parent)
  public children: Category[];

  @ManyToMany(type => Parameter)
  @JoinTable({
    name: 'categories_parameters',
  })
  public parameters: Promise<Parameter[]>;

  @OneToMany(type => Offer, offer => offer.category)
  public offers: Promise<Offer[]>;

  public update(dto: UpdatedCategoryDto): void {
    this.name = dto.name;
    this.parent = (dto.parent as unknown) as Category;
  }

  public async linkParameter(parameter: Parameter): Promise<void> {
    const parameters: Parameter[] = await this.parameters;
    const isParameterLinkedAlready: Parameter | undefined = parameters.find(
      (param: Parameter) => param.id === parameter.id,
    );
    if (isParameterLinkedAlready) {
      throw new ParameterAlreadyLinkedToCategoryException();
    }
    parameters.push(parameter);
  }

  public async hasParameters(parametersId: Uuid[]): Promise<boolean> {
    const linkedParametersId: Uuid[] = (await this.parameters).map(el => el.id);
    return parametersId.some(el => linkedParametersId.includes(el));
  }

  public static create(dto: NewCategoryDto): Category {
    const category: Category = new Category();
    category.id = dto.id;
    category.name = dto.name;
    category.parent = (dto.parent as unknown) as Category;
    dto.parent === undefined ? (category.leaf = true) : (category.leaf = false);
    return category;
  }
}

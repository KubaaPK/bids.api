import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Uuid } from '../../../../common/uuid';
import { NewCategoryDto } from '../../application/dtos/write/new-category.dto';

@Entity('categories')
export class Category extends AggregateRoot {
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

  @ManyToOne(type => Category, category => category.children)
  public parent: Category;

  @OneToMany(type => Category, category => category.parent)
  public children: Category[];

  public static create(dto: NewCategoryDto): Category {
    const category: Category = new Category();
    category.id = dto.id;
    category.name = dto.name;
    category.parent = (dto.parent as unknown) as Category;
    dto.parent ? (category.leaf = true) : (category.leaf = false);
    return category;
  }
}

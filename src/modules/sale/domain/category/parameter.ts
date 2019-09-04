import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Uuid } from '../../../common/uuid';
import { ParameterType } from './parameter-type.enum';
import { Restrictions } from './restrictions';
import { NewParameterDto } from '../../application/dtos/write/parameter/new-parameter.dto';
import { NoDictionarySpecifiedException } from './exceptions/no-dictionary-specified.exception';
import { UpdatedParameterDto } from '../../application/dtos/write/parameter/updated-parameter.dto';

@Entity('parameters')
export class Parameter {
  @PrimaryColumn('uuid')
  public id: Uuid;

  @Column({
    nullable: false,
  })
  public name: string;

  @Column({
    enum: ParameterType,
  })
  public type: ParameterType;

  @Column({
    nullable: true,
  })
  public unit: string;

  @Column({
    nullable: false,
    default: false,
  })
  public required: boolean;

  @Column({
    nullable: true,
    type: 'simple-array',
  })
  public dictionary: string[];

  @Column({
    nullable: true,
    type: 'simple-json',
  })
  public restrictions: Restrictions;

  public update(dto: UpdatedParameterDto): void {
    this.name = dto.name;
    this.type = dto.type;
    this.unit = dto.unit;
    this.required = dto.required;
    this.dictionary = dto.dictionary;
    this.restrictions = dto.restrictions;
  }

  public static create(dto: NewParameterDto): Parameter {
    const parameter: Parameter = new Parameter();
    parameter.id = dto.id;
    parameter.name = dto.name;
    parameter.required = dto.required;
    parameter.restrictions = {
      min:
        dto.type === ParameterType.FLOAT
          ? dto.restrictions.min.toFixed(2)
          : dto.restrictions.min,
      max:
        dto.type === ParameterType.FLOAT
          ? dto.restrictions.max.toFixed(2)
          : dto.restrictions.max,
      maxLength: dto.restrictions.maxLength,
      minLength: dto.restrictions.minLength,
      precision: dto.restrictions.precision,
      multiplyChoices: dto.restrictions.multipleChoices,
    };
    parameter.type = dto.type;
    parameter.unit = dto.unit;

    if (
      dto.type === ParameterType.DICTIONARY &&
      (!dto.dictionary || dto.dictionary.length === 0)
    ) {
      throw new NoDictionarySpecifiedException();
    }

    dto.type === ParameterType.DICTIONARY
      ? (parameter.dictionary = dto.dictionary)
      : null;

    return parameter;
  }
}

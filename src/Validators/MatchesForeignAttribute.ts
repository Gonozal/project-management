import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { ModelInterface } from 'sequelize-typescript-extensions';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { Model } from '@types/sequelize';

function isSequelizeModel(arg: any): arg is Model<{}, {}> {
  return arg.findOne !== undefined;
}

@ValidatorConstraint({ async: true })
class ForeignAttributeConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [model, attribute] = args.constraints;
    if (isSequelizeModel(model) && typeof attribute === 'string') {
      const instance = await model.findOne({
        where: { [attribute]: value }
      });
      return Boolean(instance);
    }
    throw new TypeError('Validation Target needs to be a subclass of "Model"');
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `A ${validationArguments.constraints[0].name} with ${validationArguments.property} "${validationArguments.value}" already exists`;
  }
}

export interface ForeignAttributeOptions<T extends ModelInterface> {
  model: T;
  foreignAttribute: string;
}

export function MatchesForeignAttribute<T extends ModelInterface>(
  args: ForeignAttributeOptions<T>,
  validationOptions?: ValidationOptions
) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [args.model, args.foreignAttribute],
      validator: ForeignAttributeConstraint
    });
  };
}

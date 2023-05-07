import {
  IsString,
  ValidationOptions,
  ValidatorConstraint,
} from 'class-validator';
import {
  registerDecorator,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CustomDataKey } from 'minimal2b/validator';
import { AppUser, AppUserKey } from './types';

@ValidatorConstraint({ name: 'ShowCustomData', async: true })
export class ShowCustomDataValidator implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    console.log('ShowCustomDataValidator');
    console.log('value', value);
    console.log('args', args);

    const ctxCustomData = args.object[CustomDataKey];
    console.log('context custom data in args', ctxCustomData);
    const user = ctxCustomData.get(AppUserKey) as AppUser;
    console.log('user in context custom data', user);

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} TestValidator fails`;
  }
}

export function ShowCustomData(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: ShowCustomDataValidator,
      options: validationOptions,
    });
  };
}

export class TestDto {
  @IsString()
  @ShowCustomData()
  test: string;
}

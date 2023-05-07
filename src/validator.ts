import { validate } from 'class-validator';
import { Class } from './types';

export const CustomDataKey = Symbol('CustomDataKey');

export class ValidateException extends Error {
  constructor(public message: string | any) {
    super();
  }
}

/** @internal */
export async function validateDto<T>(
  data: any,
  Dto: Class<T>,
  customDataMap?: Map<string | symbol, any>
) {
  const dto = new Dto();
  const validateObject = Object.assign(dto as any, {
    ...data,
    [CustomDataKey]: customDataMap,
  });

  const errors = await validate(validateObject);

  if (errors.length > 0) {
    const validateErrors = [] as {
      field: string;
      code: string;
      message: string;
    }[];

    for (const error of errors) {
      if (error.constraints) {
        for (const code of Object.keys(error.constraints)) {
          validateErrors.push({
            field: error.property,
            code,
            message: error.constraints[code],
          });
        }
      }
    }

    throw new ValidateException(validateErrors);
  }

  return validateObject as T;
}

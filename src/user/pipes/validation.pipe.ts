import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

// Validation Pipe vai capturar os parametros vindos do front end e verificar se estao de acordo com os tipos declarados no Dto.

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // transforma o objeto js em classe, para que a validacao possa ser utilizada
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    // Caso encontre erros no processo de validacao, joga uma excecao
    if (errors.length > 0) {
      throw new BadRequestException('Parametros estao incorretos!');
    }
    // Caso ocorra tudo certo, apenas devolve o valor inalterado
    return value;
  }
  // A validacao nao pode ser usada em argumentos de tipo nativo JS, essa funcao identifica esses argumentos e pula a validacao para eles
  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
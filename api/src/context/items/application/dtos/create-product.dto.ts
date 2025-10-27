import { IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

/**
 * DTO para crear un nuevo producto
 * Valida los datos de entrada para la creación de productos
 */
export class CreateProductDto {
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'thumbnail must be a valid URL' })
  thumbnail?: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'unit must be a number' })
  @Min(1, { message: 'unit must be greater than 0' })
  unit?: number;

  @IsOptional()
  @IsNumber({}, { message: 'unitPrice must be a number' })
  @Min(0, { message: 'unitPrice must be greater than or equal to 0' })
  unitPrice?: number;
}

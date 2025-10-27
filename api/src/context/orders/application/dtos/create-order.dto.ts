import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

/**
 * DTO para un item de orden
 */
export class CreateOrderItemDto {
  @IsEnum(['PRODUCT', 'EVENT'], { message: 'itemType must be PRODUCT or EVENT' })
  itemType: 'PRODUCT' | 'EVENT';

  @IsOptional()
  @IsString({ message: 'productId must be a string' })
  productId?: string;

  @IsOptional()
  @IsString({ message: 'eventId must be a string' })
  eventId?: string;

  @IsNumber({}, { message: 'quantity must be a number' })
  @Min(1, { message: 'quantity must be greater than 0' })
  quantity: number;

  @IsNumber({}, { message: 'unitPrice must be a number' })
  @Min(0, { message: 'unitPrice must be greater than or equal to 0' })
  unitPrice: number;
}

/**
 * DTO para crear una nueva orden
 * Valida los datos de entrada para la creación de órdenes
 */
export class CreateOrderDto {
  @IsArray({ message: 'items must be an array' })
  @ArrayMinSize(1, { message: 'order must have at least one item' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

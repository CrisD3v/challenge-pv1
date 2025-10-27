import { IsDateString, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

/**
 * DTO para actualizar un evento existente
 * Todos los campos son opcionales para permitir actualizaciones parciales
 */
export class UpdateEventDto {
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name?: string;

  @IsOptional()
  @IsDateString({}, { message: 'date must be a valid ISO date string' })
  date?: string;

  @IsOptional()
  @IsString({ message: 'location must be a string' })
  location?: string;

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

  @IsOptional()
  @IsString({ message: 'duration must be a string' })
  duration?: string;
}

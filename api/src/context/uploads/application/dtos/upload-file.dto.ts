import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * DTO para la subida de archivos
 * Valida los parámetros opcionales para el upload
 */
export class UploadFileDto {
  @IsOptional()
  @IsNumber({}, { message: 'maxSize must be a number' })
  @Min(1, { message: 'maxSize must be greater than 0' })
  @Max(10485760, { message: 'maxSize cannot exceed 10MB' }) // 10MB
  maxSize?: number;

  @IsOptional()
  @IsString({ message: 'allowedTypes must be a string' })
  allowedTypes?: string; // Ej: "image/jpeg,image/png"
}

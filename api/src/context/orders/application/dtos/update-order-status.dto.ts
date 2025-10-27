import { IsEnum } from 'class-validator';

/**
 * DTO para actualizar el estado de una orden
 * Valida que el nuevo estado sea válido
 */
export class UpdateOrderStatusDto {
  @IsEnum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'], {
    message: 'status must be PENDING, PROCESSING, COMPLETED or CANCELLED'
  })
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
}

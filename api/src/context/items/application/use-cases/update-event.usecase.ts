import { UpdateEventDto } from '@context/items/application/dtos/update-event.dto';
import { Event } from '@context/items/domain/entities/event.entity';
import { EventNotFoundException } from '@context/items/domain/exceptions/event-not-found.exception';
import { InvalidItemDataException } from '@context/items/domain/exceptions/invalid-item-data.exception';
import type { IEventRepository } from '@context/items/domain/repositories/event.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para actualizar un evento existente
 * Orquesta la lógica de negocio para la actualización de eventos
 */
@Injectable()
export class UpdateEventUseCase {
  constructor(
    @Inject('EventRepositoryPort')
    private readonly eventRepository: IEventRepository,
  ) { }

  /**
   * Ejecuta la actualización de un evento
   * @param id - ID del evento a actualizar
   * @param dto - Datos a actualizar
   * @returns Evento actualizado
   * @throws EventNotFoundException si el evento no existe
   * @throws InvalidItemDataException si los datos son inválidos
   */
  async execute(id: string, dto: UpdateEventDto): Promise<Event> {
    // Verificar que el evento existe
    const existingEvent = await this.eventRepository.findById(id);
    if (!existingEvent) {
      throw new EventNotFoundException(id);
    }

    // Validar datos si se proporcionan
    if (dto.name !== undefined && dto.name.trim().length === 0) {
      throw new InvalidItemDataException('El nombre del evento no puede estar vacío');
    }

    if (dto.location !== undefined && dto.location.trim().length === 0) {
      throw new InvalidItemDataException('La ubicación del evento no puede estar vacía');
    }

    if (dto.date !== undefined) {
      const eventDate = new Date(dto.date);
      const now = new Date();
      if (eventDate <= now) {
        throw new InvalidItemDataException('Event date must be in the future');
      }
    }

    if (dto.unitPrice !== undefined && dto.unitPrice < 0) {
      throw new InvalidItemDataException('El precio unitario no puede ser negativo');
    }

    if (dto.unit !== undefined && dto.unit < 1) {
      throw new InvalidItemDataException('La unidad debe ser mayor a 0');
    }

    // Actualizar el evento
    return this.eventRepository.update(
      id,
      dto.name?.trim(),
      dto.date ? new Date(dto.date) : undefined,
      dto.location?.trim(),
      dto.thumbnail,
      dto.description,
      dto.unit,
      dto.unitPrice,
      dto.duration,
    );
  }
}

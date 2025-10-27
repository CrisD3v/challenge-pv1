import { CreateEventDto } from '@context/items/application/dtos/create-event.dto';
import { Event } from '@context/items/domain/entities/event.entity';
import { InvalidItemDataException } from '@context/items/domain/exceptions/invalid-item-data.exception';
import type { IEventRepository } from '@context/items/domain/repositories/event.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para crear un nuevo evento
 * Orquesta la lógica de negocio para la creación de eventos
 */
@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject('EventRepositoryPort')
    private readonly eventRepository: IEventRepository,
  ) { }

  /**
   * Ejecuta la creación de un nuevo evento
   * @param dto - Datos del evento a crear
   * @returns Evento creado
   * @throws InvalidItemDataException si los datos son inválidos
   */
  async execute(dto: CreateEventDto): Promise<Event> {
    // Validar que el nombre no esté vacío
    if (!dto.name || dto.name.trim().length === 0) {
      throw new InvalidItemDataException('El nombre del evento es requerido');
    }

    // Validar que la ubicación no esté vacía
    if (!dto.location || dto.location.trim().length === 0) {
      throw new InvalidItemDataException('La ubicación del evento es requerida');
    }

    // Validar que la fecha sea futura
    const eventDate = new Date(dto.date);
    const now = new Date();
    if (eventDate <= now) {
      throw new InvalidItemDataException('Event date must be in the future');
    }

    // Validar que el precio sea válido si se proporciona
    if (dto.unitPrice !== undefined && dto.unitPrice < 0) {
      throw new InvalidItemDataException('El precio unitario no puede ser negativo');
    }

    // Validar que la unidad sea válida si se proporciona
    if (dto.unit !== undefined && dto.unit < 1) {
      throw new InvalidItemDataException('La unidad debe ser mayor a 0');
    }

    // Crear el evento usando el repositorio
    return this.eventRepository.create(
      dto.name.trim(),
      eventDate,
      dto.location.trim(),
      dto.thumbnail,
      dto.description,
      dto.unit || 1,
      dto.unitPrice || 0,
      dto.duration,
    );
  }
}

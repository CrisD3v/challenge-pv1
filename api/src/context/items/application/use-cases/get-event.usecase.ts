import { Event } from '@context/items/domain/entities/event.entity';
import { EventNotFoundException } from '@context/items/domain/exceptions/event-not-found.exception';
import type { IEventRepository } from '@context/items/domain/repositories/event.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para obtener un evento por ID
 * Orquesta la lógica de negocio para la consulta de eventos
 */
@Injectable()
export class GetEventUseCase {
  constructor(
    @Inject('EventRepositoryPort')
    private readonly eventRepository: IEventRepository,
  ) { }

  /**
   * Ejecuta la búsqueda de un evento por ID
   * @param id - ID del evento a buscar
   * @returns Evento encontrado
   * @throws EventNotFoundException si el evento no existe
   */
  async execute(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new EventNotFoundException(id);
    }

    return event;
  }
}

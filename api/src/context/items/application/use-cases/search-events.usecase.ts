import { Event } from '@context/items/domain/entities/event.entity';
import type { IEventRepository } from '@context/items/domain/repositories/event.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para buscar eventos por nombre
 * Orquesta la lógica de negocio para la búsqueda de eventos
 */
@Injectable()
export class SearchEventsUseCase {
  constructor(
    @Inject('EventRepositoryPort')
    private readonly eventRepository: IEventRepository,
  ) { }

  /**
   * Ejecuta la búsqueda de eventos por nombre
   * @param name - Nombre o parte del nombre a buscar
   * @returns Lista de eventos que coinciden con la búsqueda
   */
  async execute(name: string): Promise<Event[]> {
    // Si no se proporciona nombre, retornar lista vacía
    if (!name || name.trim().length === 0) {
      return [];
    }

    return this.eventRepository.findByName(name.trim());
  }
}

import { Event } from '@context/items/domain/entities/event.entity';
import type { IEventRepository } from '@context/items/domain/repositories/event.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para obtener todos los eventos
 * Orquesta la lógica de negocio para la consulta de todos los eventos
 */
@Injectable()
export class GetAllEventsUseCase {
  constructor(
    @Inject('EventRepositoryPort')
    private readonly eventRepository: IEventRepository,
  ) { }

  /**
   * Ejecuta la búsqueda de todos los eventos
   * @returns Lista de todos los eventos
   */
  async execute(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }
}

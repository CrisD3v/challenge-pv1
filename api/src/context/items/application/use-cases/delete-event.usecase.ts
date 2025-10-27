import { EventNotFoundException } from '@context/items/domain/exceptions/event-not-found.exception';
import type { IEventRepository } from '@context/items/domain/repositories/event.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para eliminar un evento
 * Orquesta la lógica de negocio para la eliminación de eventos
 */
@Injectable()
export class DeleteEventUseCase {
  constructor(
    @Inject('EventRepositoryPort')
    private readonly eventRepository: IEventRepository,
  ) { }

  /**
   * Ejecuta la eliminación de un evento
   * @param id - ID del evento a eliminar
   * @throws EventNotFoundException si el evento no existe
   */
  async execute(id: string): Promise<void> {
    // Verificar que el evento existe antes de eliminarlo
    const existingEvent = await this.eventRepository.findById(id);
    if (!existingEvent) {
      throw new EventNotFoundException(id);
    }

    // Eliminar el evento
    await this.eventRepository.delete(id);
  }
}

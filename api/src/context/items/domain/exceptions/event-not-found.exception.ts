/**
 * Excepción lanzada cuando no se encuentra un evento
 */
export class EventNotFoundException extends Error {
  constructor(eventId: string) {
    super(`Evento con ID ${eventId} no encontrado`);
    this.name = 'EventNotFoundException';
  }
}

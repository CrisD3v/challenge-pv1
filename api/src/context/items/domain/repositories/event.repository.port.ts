import { Event } from '@context/items/domain/entities/event.entity';

/**
 * Puerto (interfaz) para el repositorio de eventos
 * Define el contrato que debe implementar cualquier adaptador de persistencia
 */
export interface IEventRepository {
  /**
   * Busca un evento por su ID
   * @param id - ID del evento
   * @returns Evento encontrado o null si no existe
   */
  findById(id: string): Promise<Event | null>;

  /**
   * Obtiene todos los eventos
   * @returns Lista de todos los eventos
   */
  findAll(): Promise<Event[]>;

  /**
   * Busca eventos por nombre (búsqueda parcial)
   * @param name - Nombre o parte del nombre a buscar
   * @returns Lista de eventos que coinciden con la búsqueda
   */
  findByName(name: string): Promise<Event[]>;

  /**
   * Obtiene eventos disponibles (precio > 0 y fecha futura)
   * @returns Lista de eventos disponibles
   */
  findAvailable(): Promise<Event[]>;

  /**
   * Obtiene eventos por rango de fechas
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Lista de eventos en el rango de fechas
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<Event[]>;

  /**
   * Obtiene eventos por ubicación
   * @param location - Ubicación a buscar
   * @returns Lista de eventos en la ubicación especificada
   */
  findByLocation(location: string): Promise<Event[]>;

  /**
   * Crea un nuevo evento
   * @param name - Nombre del evento
   * @param date - Fecha del evento
   * @param location - Ubicación del evento
   * @param thumbnail - URL de la imagen (opcional)
   * @param description - Descripción del evento (opcional)
   * @param unit - Unidad del evento
   * @param unitPrice - Precio unitario
   * @param duration - Duración del evento (opcional)
   * @returns Evento creado
   */
  create(
    name: string,
    date: Date,
    location: string,
    thumbnail?: string,
    description?: string,
    unit?: number,
    unitPrice?: number,
    duration?: string,
  ): Promise<Event>;

  /**
   * Actualiza un evento existente
   * @param id - ID del evento a actualizar
   * @param name - Nuevo nombre (opcional)
   * @param date - Nueva fecha (opcional)
   * @param location - Nueva ubicación (opcional)
   * @param thumbnail - Nueva URL de imagen (opcional)
   * @param description - Nueva descripción (opcional)
   * @param unit - Nueva unidad (opcional)
   * @param unitPrice - Nuevo precio unitario (opcional)
   * @param duration - Nueva duración (opcional)
   * @returns Evento actualizado
   */
  update(
    id: string,
    name?: string,
    date?: Date,
    location?: string,
    thumbnail?: string,
    description?: string,
    unit?: number,
    unitPrice?: number,
    duration?: string,
  ): Promise<Event>;

  /**
   * Elimina un evento
   * @param id - ID del evento a eliminar
   */
  delete(id: string): Promise<void>;
}

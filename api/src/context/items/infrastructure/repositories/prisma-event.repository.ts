import { Event } from '@context/items/domain/entities/event.entity';
import { IEventRepository } from '@context/items/domain/repositories/event.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

/**
 * Implementación del repositorio de eventos usando Prisma
 * Adaptador que conecta el dominio con la base de datos
 */
@Injectable()
export class PrismaEventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Busca un evento por su ID
   * @param id - ID del evento
   * @returns Evento encontrado o null si no existe
   */
  async findById(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) return null;

    return new Event(
      event.id,
      event.name,
      event.thumbnail,
      event.description,
      event.unit,
      event.unitPrice,
      event.date,
      event.location,
      event.duration,
      event.createdAt,
      event.updatedAt,
    );
  }

  /**
   * Obtiene todos los eventos
   * @returns Lista de todos los eventos
   */
  async findAll(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      orderBy: { date: 'asc' },
    });

    return events.map(
      (event) =>
        new Event(
          event.id,
          event.name,
          event.thumbnail,
          event.description,
          event.unit,
          event.unitPrice,
          event.date,
          event.location,
          event.duration,
          event.createdAt,
          event.updatedAt,
        ),
    );
  }

  /**
   * Busca eventos por nombre (búsqueda parcial)
   * @param name - Nombre o parte del nombre a buscar
   * @returns Lista de eventos que coinciden con la búsqueda
   */
  async findByName(name: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: { date: 'asc' },
    });

    return events.map(
      (event) =>
        new Event(
          event.id,
          event.name,
          event.thumbnail,
          event.description,
          event.unit,
          event.unitPrice,
          event.date,
          event.location,
          event.duration,
          event.createdAt,
          event.updatedAt,
        ),
    );
  }

  /**
   * Obtiene eventos disponibles (precio > 0 y fecha futura)
   * @returns Lista de eventos disponibles
   */
  async findAvailable(): Promise<Event[]> {
    const now = new Date();
    const events = await this.prisma.event.findMany({
      where: {
        unitPrice: {
          gt: 0,
        },
        date: {
          gt: now,
        },
      },
      orderBy: { date: 'asc' },
    });

    return events.map(
      (event) =>
        new Event(
          event.id,
          event.name,
          event.thumbnail,
          event.description,
          event.unit,
          event.unitPrice,
          event.date,
          event.location,
          event.duration,
          event.createdAt,
          event.updatedAt,
        ),
    );
  }

  /**
   * Obtiene eventos por rango de fechas
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Lista de eventos en el rango de fechas
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    return events.map(
      (event) =>
        new Event(
          event.id,
          event.name,
          event.thumbnail,
          event.description,
          event.unit,
          event.unitPrice,
          event.date,
          event.location,
          event.duration,
          event.createdAt,
          event.updatedAt,
        ),
    );
  }

  /**
   * Obtiene eventos por ubicación
   * @param location - Ubicación a buscar
   * @returns Lista de eventos en la ubicación especificada
   */
  async findByLocation(location: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: {
        location: {
          contains: location,
          mode: 'insensitive',
        },
      },
      orderBy: { date: 'asc' },
    });

    return events.map(
      (event) =>
        new Event(
          event.id,
          event.name,
          event.thumbnail,
          event.description,
          event.unit,
          event.unitPrice,
          event.date,
          event.location,
          event.duration,
          event.createdAt,
          event.updatedAt,
        ),
    );
  }

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
  async create(
    name: string,
    date: Date,
    location: string,
    thumbnail?: string,
    description?: string,
    unit = 1,
    unitPrice = 0,
    duration?: string,
  ): Promise<Event> {
    const event = await this.prisma.event.create({
      data: {
        name,
        date,
        location,
        thumbnail,
        description,
        unit,
        unitPrice,
        duration,
      },
    });

    return new Event(
      event.id,
      event.name,
      event.thumbnail,
      event.description,
      event.unit,
      event.unitPrice,
      event.date,
      event.location,
      event.duration,
      event.createdAt,
      event.updatedAt,
    );
  }

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
  async update(
    id: string,
    name?: string,
    date?: Date,
    location?: string,
    thumbnail?: string,
    description?: string,
    unit?: number,
    unitPrice?: number,
    duration?: string,
  ): Promise<Event> {
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (date !== undefined) updateData.date = date;
    if (location !== undefined) updateData.location = location;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (description !== undefined) updateData.description = description;
    if (unit !== undefined) updateData.unit = unit;
    if (unitPrice !== undefined) updateData.unitPrice = unitPrice;
    if (duration !== undefined) updateData.duration = duration;

    const event = await this.prisma.event.update({
      where: { id },
      data: updateData,
    });

    return new Event(
      event.id,
      event.name,
      event.thumbnail,
      event.description,
      event.unit,
      event.unitPrice,
      event.date,
      event.location,
      event.duration,
      event.createdAt,
      event.updatedAt,
    );
  }

  /**
   * Elimina un evento
   * @param id - ID del evento a eliminar
   */
  async delete(id: string): Promise<void> {
    await this.prisma.event.delete({
      where: { id },
    });
  }
}

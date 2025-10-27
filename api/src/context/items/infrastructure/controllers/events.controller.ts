import { CreateEventDto } from '@context/items/application/dtos/create-event.dto';
import { UpdateEventDto } from '@context/items/application/dtos/update-event.dto';
import { CreateEventUseCase } from '@context/items/application/use-cases/create-event.usecase';
import { DeleteEventUseCase } from '@context/items/application/use-cases/delete-event.usecase';
import { GetAllEventsUseCase } from '@context/items/application/use-cases/get-all-events.usecase';
import { GetEventUseCase } from '@context/items/application/use-cases/get-event.usecase';
import { SearchEventsUseCase } from '@context/items/application/use-cases/search-events.usecase';
import { UpdateEventUseCase } from '@context/items/application/use-cases/update-event.usecase';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

/**
 * Controlador REST para la gestión de eventos
 * Maneja las peticiones HTTP y delega la lógica de negocio a los casos de uso
 */
@Controller('events')
export class EventsController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly getEventUseCase: GetEventUseCase,
    private readonly getAllEventsUseCase: GetAllEventsUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
    private readonly searchEventsUseCase: SearchEventsUseCase,
  ) { }

  /**
   * Crea un nuevo evento
   * @param dto - Datos del evento a crear
   * @returns Evento creado
   */
  @Post()
  async createEvent(@Body() dto: CreateEventDto) {
    return this.createEventUseCase.execute(dto);
  }

  /**
   * Obtiene todos los eventos o busca por nombre si se proporciona query
   * @param search - Término de búsqueda opcional
   * @returns Lista de eventos
   */
  @Get()
  async getEvents(@Query('search') search?: string) {
    if (search) {
      return this.searchEventsUseCase.execute(search);
    }
    return this.getAllEventsUseCase.execute();
  }

  /**
   * Obtiene un evento por su ID
   * @param id - ID del evento
   * @returns Evento encontrado
   */
  @Get(':id')
  async getEvent(@Param('id') id: string) {
    return this.getEventUseCase.execute(id);
  }

  /**
   * Actualiza un evento existente
   * @param id - ID del evento a actualizar
   * @param dto - Datos a actualizar
   * @returns Evento actualizado
   */
  @Put(':id')
  async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.updateEventUseCase.execute(id, dto);
  }

  /**
   * Elimina un evento
   * @param id - ID del evento a eliminar
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvent(@Param('id') id: string) {
    await this.deleteEventUseCase.execute(id);
  }
}

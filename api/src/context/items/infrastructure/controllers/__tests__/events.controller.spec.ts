import { CreateEventDto } from '@context/items/application/dtos/create-event.dto';
import { UpdateEventDto } from '@context/items/application/dtos/update-event.dto';
import { CreateEventUseCase } from '@context/items/application/use-cases/create-event.usecase';
import { DeleteEventUseCase } from '@context/items/application/use-cases/delete-event.usecase';
import { GetAllEventsUseCase } from '@context/items/application/use-cases/get-all-events.usecase';
import { GetEventUseCase } from '@context/items/application/use-cases/get-event.usecase';
import { SearchEventsUseCase } from '@context/items/application/use-cases/search-events.usecase';
import { UpdateEventUseCase } from '@context/items/application/use-cases/update-event.usecase';
import { Event } from '@context/items/domain/entities/event.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from '../events.controller';

describe('EventsController', () => {
  let controller: EventsController;
  let createEventUseCase: jest.Mocked<CreateEventUseCase>;
  let getEventUseCase: jest.Mocked<GetEventUseCase>;
  let getAllEventsUseCase: jest.Mocked<GetAllEventsUseCase>;
  let updateEventUseCase: jest.Mocked<UpdateEventUseCase>;
  let deleteEventUseCase: jest.Mocked<DeleteEventUseCase>;
  let searchEventsUseCase: jest.Mocked<SearchEventsUseCase>;

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);

  const mockEvent = new Event(
    'event-1',
    'Evento de Prueba',
    'https://example.com/image.jpg',
    'Descripción del evento',
    1,
    50.00,
    futureDate,
    'Centro de Convenciones',
    '2 horas',
    new Date('2023-01-01'),
    new Date('2023-01-01'),
  );

  const mockEvents = [mockEvent];

  beforeEach(async () => {
    const mockCreateEventUseCase = {
      execute: jest.fn(),
    };

    const mockGetEventUseCase = {
      execute: jest.fn(),
    };

    const mockGetAllEventsUseCase = {
      execute: jest.fn(),
    };

    const mockUpdateEventUseCase = {
      execute: jest.fn(),
    };

    const mockDeleteEventUseCase = {
      execute: jest.fn(),
    };

    const mockSearchEventsUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        { provide: CreateEventUseCase, useValue: mockCreateEventUseCase },
        { provide: GetEventUseCase, useValue: mockGetEventUseCase },
        { provide: GetAllEventsUseCase, useValue: mockGetAllEventsUseCase },
        { provide: UpdateEventUseCase, useValue: mockUpdateEventUseCase },
        { provide: DeleteEventUseCase, useValue: mockDeleteEventUseCase },
        { provide: SearchEventsUseCase, useValue: mockSearchEventsUseCase },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    createEventUseCase = module.get(CreateEventUseCase);
    getEventUseCase = module.get(GetEventUseCase);
    getAllEventsUseCase = module.get(GetAllEventsUseCase);
    updateEventUseCase = module.get(UpdateEventUseCase);
    deleteEventUseCase = module.get(DeleteEventUseCase);
    searchEventsUseCase = module.get(SearchEventsUseCase);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('createEvent', () => {
    it('debería crear un evento', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Evento de Prueba',
        date: futureDate.toISOString(),
        location: 'Centro de Convenciones',
        unitPrice: 50.00,
      };

      createEventUseCase.execute.mockResolvedValue(mockEvent);

      const result = await controller.createEvent(createEventDto);

      expect(createEventUseCase.execute).toHaveBeenCalledWith(createEventDto);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('getEvents', () => {
    it('debería retornar todos los eventos cuando no hay búsqueda', async () => {
      getAllEventsUseCase.execute.mockResolvedValue(mockEvents);

      const result = await controller.getEvents();

      expect(getAllEventsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
    });

    it('debería buscar eventos cuando se proporciona término de búsqueda', async () => {
      const searchTerm = 'prueba';
      searchEventsUseCase.execute.mockResolvedValue(mockEvents);

      const result = await controller.getEvents(searchTerm);

      expect(searchEventsUseCase.execute).toHaveBeenCalledWith(searchTerm);
      expect(result).toEqual(mockEvents);
    });
  });

  describe('getEvent', () => {
    it('debería retornar un evento por ID', async () => {
      getEventUseCase.execute.mockResolvedValue(mockEvent);

      const result = await controller.getEvent('event-1');

      expect(getEventUseCase.execute).toHaveBeenCalledWith('event-1');
      expect(result).toEqual(mockEvent);
    });
  });

  describe('updateEvent', () => {
    it('debería actualizar un evento', async () => {
      const updateEventDto: UpdateEventDto = {
        name: 'Evento Actualizado',
        unitPrice: 75.00,
      };

      const updatedEvent = new Event(
        'event-1',
        'Evento Actualizado',
        'https://example.com/image.jpg',
        'Descripción del evento',
        1,
        75.00,
        futureDate,
        'Centro de Convenciones',
        '2 horas',
        new Date('2023-01-01'),
        new Date('2023-01-02'),
      );

      updateEventUseCase.execute.mockResolvedValue(updatedEvent);

      const result = await controller.updateEvent('event-1', updateEventDto);

      expect(updateEventUseCase.execute).toHaveBeenCalledWith('event-1', updateEventDto);
      expect(result).toEqual(updatedEvent);
    });
  });

  describe('deleteEvent', () => {
    it('debería eliminar un evento', async () => {
      deleteEventUseCase.execute.mockResolvedValue(undefined);

      await controller.deleteEvent('event-1');

      expect(deleteEventUseCase.execute).toHaveBeenCalledWith('event-1');
    });
  });
});

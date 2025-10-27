import { CreateEventDto } from '@context/items/application/dtos/create-event.dto';
import { Event } from '@context/items/domain/entities/event.entity';
import { InvalidItemDataException } from '@context/items/domain/exceptions/invalid-item-data.exception';
import { IEventRepository } from '@context/items/domain/repositories/event.repository.port';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventUseCase } from '../create-event.usecase';

describe('CreateEventUseCase', () => {
  let useCase: CreateEventUseCase;
  let eventRepository: jest.Mocked<IEventRepository>;

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30); // 30 días en el futuro

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

  beforeEach(async () => {
    const mockEventRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByName: jest.fn(),
      findAvailable: jest.fn(),
      findByDateRange: jest.fn(),
      findByLocation: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEventUseCase,
        { provide: 'EventRepositoryPort', useValue: mockEventRepository },
      ],
    }).compile();

    useCase = module.get<CreateEventUseCase>(CreateEventUseCase);
    eventRepository = module.get('EventRepositoryPort');
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería crear un evento exitosamente', async () => {
    const createEventDto: CreateEventDto = {
      name: 'Evento de Prueba',
      date: futureDate.toISOString(),
      location: 'Centro de Convenciones',
      thumbnail: 'https://example.com/image.jpg',
      description: 'Descripción del evento',
      unit: 1,
      unitPrice: 50.00,
      duration: '2 horas',
    };

    eventRepository.create.mockResolvedValue(mockEvent);

    const result = await useCase.execute(createEventDto);

    expect(eventRepository.create).toHaveBeenCalledWith(
      'Evento de Prueba',
      futureDate,
      'Centro de Convenciones',
      'https://example.com/image.jpg',
      'Descripción del evento',
      1,
      50.00,
      '2 horas',
    );
    expect(result).toEqual(mockEvent);
  });

  it('debería crear un evento con valores por defecto', async () => {
    const createEventDto: CreateEventDto = {
      name: 'Evento Básico',
      date: futureDate.toISOString(),
      location: 'Ubicación Básica',
    };

    eventRepository.create.mockResolvedValue(mockEvent);

    await useCase.execute(createEventDto);

    expect(eventRepository.create).toHaveBeenCalledWith(
      'Evento Básico',
      futureDate,
      'Ubicación Básica',
      undefined,
      undefined,
      1,
      0,
      undefined,
    );
  });

  it('debería lanzar excepción si el nombre está vacío', async () => {
    const createEventDto: CreateEventDto = {
      name: '',
      date: futureDate.toISOString(),
      location: 'Centro de Convenciones',
    };

    await expect(useCase.execute(createEventDto)).rejects.toThrow(
      InvalidItemDataException,
    );
    expect(eventRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si la ubicación está vacía', async () => {
    const createEventDto: CreateEventDto = {
      name: 'Evento de Prueba',
      date: futureDate.toISOString(),
      location: '',
    };

    await expect(useCase.execute(createEventDto)).rejects.toThrow(
      InvalidItemDataException,
    );
    expect(eventRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si la fecha no es futura', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Ayer

    const createEventDto: CreateEventDto = {
      name: 'Evento de Prueba',
      date: pastDate.toISOString(),
      location: 'Centro de Convenciones',
    };

    await expect(useCase.execute(createEventDto)).rejects.toThrow(
      InvalidItemDataException,
    );
    expect(eventRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si el precio es negativo', async () => {
    const createEventDto: CreateEventDto = {
      name: 'Evento de Prueba',
      date: futureDate.toISOString(),
      location: 'Centro de Convenciones',
      unitPrice: -10,
    };

    await expect(useCase.execute(createEventDto)).rejects.toThrow(
      InvalidItemDataException,
    );
    expect(eventRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si la unidad es menor a 1', async () => {
    const createEventDto: CreateEventDto = {
      name: 'Evento de Prueba',
      date: futureDate.toISOString(),
      location: 'Centro de Convenciones',
      unit: 0,
    };

    await expect(useCase.execute(createEventDto)).rejects.toThrow(
      InvalidItemDataException,
    );
    expect(eventRepository.create).not.toHaveBeenCalled();
  });

  it('debería recortar espacios en blanco del nombre y ubicación', async () => {
    const createEventDto: CreateEventDto = {
      name: '  Evento con Espacios  ',
      date: futureDate.toISOString(),
      location: '  Ubicación con Espacios  ',
    };

    eventRepository.create.mockResolvedValue(mockEvent);

    await useCase.execute(createEventDto);

    expect(eventRepository.create).toHaveBeenCalledWith(
      'Evento con Espacios',
      futureDate,
      'Ubicación con Espacios',
      undefined,
      undefined,
      1,
      0,
      undefined,
    );
  });
});

import { Event } from '../event.entity';

describe('Event Entity', () => {
  let futureDate: Date;
  let pastDate: Date;
  let todayDate: Date;
  let event: Event;

  beforeEach(() => {
    const now = new Date();

    futureDate = new Date();
    futureDate.setDate(now.getDate() + 30);

    pastDate = new Date();
    pastDate.setDate(now.getDate() - 30);

    todayDate = new Date();
    todayDate.setHours(now.getHours() + 2); // Más tarde hoy

    event = new Event(
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
  });

  describe('constructor', () => {
    it('debería crear un evento con todas las propiedades', () => {
      expect(event.id).toBe('event-1');
      expect(event.name).toBe('Evento de Prueba');
      expect(event.thumbnail).toBe('https://example.com/image.jpg');
      expect(event.description).toBe('Descripción del evento');
      expect(event.unit).toBe(1);
      expect(event.unitPrice).toBe(50.00);
      expect(event.date).toEqual(futureDate);
      expect(event.location).toBe('Centro de Convenciones');
      expect(event.duration).toBe('2 horas');
    });
  });

  describe('calculateTotalPrice', () => {
    it('debería calcular el precio total correctamente', () => {
      const total = event.calculateTotalPrice(3);
      expect(total).toBe(150.00); // 50.00 * 3
    });

    it('debería retornar 0 cuando la cantidad es 0', () => {
      const total = event.calculateTotalPrice(0);
      expect(total).toBe(0);
    });
  });

  describe('isAvailable', () => {
    it('debería retornar true cuando el precio es mayor a 0 y la fecha es futura', () => {
      expect(event.isAvailable()).toBe(true);
    });

    it('debería retornar false cuando el precio es 0', () => {
      const freeEvent = new Event(
        'event-free',
        'Evento Gratis',
        null,
        null,
        1,
        0,
        futureDate,
        'Ubicación',
        null,
        new Date(),
        new Date(),
      );

      expect(freeEvent.isAvailable()).toBe(false);
    });

    it('debería retornar false cuando la fecha ya pasó', () => {
      const pastEvent = new Event(
        'event-past',
        'Evento Pasado',
        null,
        null,
        1,
        50.00,
        pastDate,
        'Ubicación',
        null,
        new Date(),
        new Date(),
      );

      expect(pastEvent.isAvailable()).toBe(false);
    });
  });

  describe('isPastEvent', () => {
    it('debería retornar false para evento futuro', () => {
      expect(event.isPastEvent()).toBe(false);
    });

    it('debería retornar true para evento pasado', () => {
      const pastEvent = new Event(
        'event-past',
        'Evento Pasado',
        null,
        null,
        1,
        50.00,
        pastDate,
        'Ubicación',
        null,
        new Date(),
        new Date(),
      );

      expect(pastEvent.isPastEvent()).toBe(true);
    });
  });

  describe('isToday', () => {
    it('debería retornar false para evento futuro', () => {
      expect(event.isToday()).toBe(false);
    });

    it('debería retornar true para evento de hoy', () => {
      const todayEvent = new Event(
        'event-today',
        'Evento Hoy',
        null,
        null,
        1,
        50.00,
        todayDate,
        'Ubicación',
        null,
        new Date(),
        new Date(),
      );

      expect(todayEvent.isToday()).toBe(true);
    });
  });

  describe('getDaysUntilEvent', () => {
    it('debería retornar número positivo para evento futuro', () => {
      const days = event.getDaysUntilEvent();
      expect(days).toBeGreaterThan(0);
      expect(days).toBeLessThanOrEqual(30);
    });

    it('debería retornar número negativo para evento pasado', () => {
      const pastEvent = new Event(
        'event-past',
        'Evento Pasado',
        null,
        null,
        1,
        50.00,
        pastDate,
        'Ubicación',
        null,
        new Date(),
        new Date(),
      );

      const days = pastEvent.getDaysUntilEvent();
      expect(days).toBeLessThan(0);
    });

    it('debería retornar 0 para evento de hoy', () => {
      const today = new Date();
      const todayEvent = new Event(
        'event-today',
        'Evento Hoy',
        null,
        null,
        1,
        50.00,
        today,
        'Ubicación',
        null,
        new Date(),
        new Date(),
      );

      const days = todayEvent.getDaysUntilEvent();
      expect(days).toBe(0);
    });
  });

  describe('hasThumbnail', () => {
    it('debería retornar true cuando tiene thumbnail', () => {
      expect(event.hasThumbnail()).toBe(true);
    });

    it('debería retornar false cuando thumbnail es null', () => {
      const eventWithoutThumbnail = new Event(
        'event-2',
        'Evento Sin Imagen',
        null,
        'Descripción',
        1,
        50.00,
        futureDate,
        'Ubicación',
        null,
        new Date(),
        new Date(),
      );

      expect(eventWithoutThumbnail.hasThumbnail()).toBe(false);
    });

    it('debería retornar false cuando thumbnail es string vacío', () => {
      const eventWithEmptyThumbnail = new Event(
        'event-3',
        'Evento Thumbnail Vacío',
        '',
        'Descripción',
        1,
        50.00,
        futureDate,
        'Ubicación',
        null,
        new Date(),
        new Date(),
      );

      expect(eventWithEmptyThumbnail.hasThumbnail()).toBe(false);
    });
  });

  describe('getSummary', () => {
    it('debería retornar un resumen del evento', () => {
      const summary = event.getSummary();

      expect(summary).toEqual({
        id: 'event-1',
        name: 'Evento de Prueba',
        unitPrice: 50.00,
        date: futureDate,
        location: 'Centro de Convenciones',
        isAvailable: true,
        daysUntilEvent: expect.any(Number),
      });
      expect(summary.daysUntilEvent).toBeGreaterThan(0);
    });

    it('debería retornar resumen con isAvailable false para evento no disponible', () => {
      const unavailableEvent = new Event(
        'event-unavailable',
        'Evento No Disponible',
        null,
        null,
        1,
        0,
        futureDate,
        'Ubicación',
        null,
        new Date(),
        new Date(),
      );

      const summary = unavailableEvent.getSummary();

      expect(summary.isAvailable).toBe(false);
    });
  });
});

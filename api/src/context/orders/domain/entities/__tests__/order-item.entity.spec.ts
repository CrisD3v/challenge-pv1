import { ItemType, OrderItem } from '../order-item.entity';

describe('OrderItem Entity', () => {
  let productItem: OrderItem;
  let eventItem: OrderItem;

  beforeEach(() => {
    productItem = new OrderItem(
      'item-1',
      'order-1',
      ItemType.PRODUCT,
      'product-1',
      null,
      3,
      99.99,
      new Date('2023-01-01'),
    );

    eventItem = new OrderItem(
      'item-2',
      'order-1',
      ItemType.EVENT,
      null,
      'event-1',
      2,
      50.00,
      new Date('2023-01-01'),
    );
  });

  describe('constructor', () => {
    it('debería crear un item de producto correctamente', () => {
      expect(productItem.id).toBe('item-1');
      expect(productItem.orderId).toBe('order-1');
      expect(productItem.itemType).toBe(ItemType.PRODUCT);
      expect(productItem.productId).toBe('product-1');
      expect(productItem.eventId).toBeNull();
      expect(productItem.quantity).toBe(3);
      expect(productItem.unitPrice).toBe(99.99);
    });

    it('debería crear un item de evento correctamente', () => {
      expect(eventItem.itemType).toBe(ItemType.EVENT);
      expect(eventItem.productId).toBeNull();
      expect(eventItem.eventId).toBe('event-1');
    });
  });

  describe('getSubtotal', () => {
    it('debería calcular el subtotal correctamente para producto', () => {
      expect(productItem.getSubtotal()).toBeCloseTo(299.97, 2); // 3 * 99.99
    });

    it('debería calcular el subtotal correctamente para evento', () => {
      expect(eventItem.getSubtotal()).toBe(100.00); // 2 * 50.00
    });

    it('debería retornar 0 cuando la cantidad es 0', () => {
      const zeroQuantityItem = new OrderItem(
        'item-3',
        'order-1',
        ItemType.PRODUCT,
        'product-1',
        null,
        0,
        99.99,
        new Date(),
      );

      expect(zeroQuantityItem.getSubtotal()).toBe(0);
    });
  });

  describe('isProduct', () => {
    it('debería retornar true para item de producto', () => {
      expect(productItem.isProduct()).toBe(true);
    });

    it('debería retornar false para item de evento', () => {
      expect(eventItem.isProduct()).toBe(false);
    });
  });

  describe('isEvent', () => {
    it('debería retornar true para item de evento', () => {
      expect(eventItem.isEvent()).toBe(true);
    });

    it('debería retornar false para item de producto', () => {
      expect(productItem.isEvent()).toBe(false);
    });
  });

  describe('getItemId', () => {
    it('debería retornar productId para item de producto', () => {
      expect(productItem.getItemId()).toBe('product-1');
    });

    it('debería retornar eventId para item de evento', () => {
      expect(eventItem.getItemId()).toBe('event-1');
    });
  });

  describe('hasValidQuantity', () => {
    it('debería retornar true para cantidad válida', () => {
      expect(productItem.hasValidQuantity()).toBe(true);
    });

    it('debería retornar false para cantidad 0', () => {
      const invalidItem = new OrderItem(
        'item-3',
        'order-1',
        ItemType.PRODUCT,
        'product-1',
        null,
        0,
        99.99,
        new Date(),
      );

      expect(invalidItem.hasValidQuantity()).toBe(false);
    });

    it('debería retornar false para cantidad negativa', () => {
      const invalidItem = new OrderItem(
        'item-3',
        'order-1',
        ItemType.PRODUCT,
        'product-1',
        null,
        -1,
        99.99,
        new Date(),
      );

      expect(invalidItem.hasValidQuantity()).toBe(false);
    });
  });

  describe('hasValidPrice', () => {
    it('debería retornar true para precio válido', () => {
      expect(productItem.hasValidPrice()).toBe(true);
    });

    it('debería retornar true para precio 0', () => {
      const freeItem = new OrderItem(
        'item-3',
        'order-1',
        ItemType.PRODUCT,
        'product-1',
        null,
        1,
        0,
        new Date(),
      );

      expect(freeItem.hasValidPrice()).toBe(true);
    });

    it('debería retornar false para precio negativo', () => {
      const invalidItem = new OrderItem(
        'item-3',
        'order-1',
        ItemType.PRODUCT,
        'product-1',
        null,
        1,
        -10,
        new Date(),
      );

      expect(invalidItem.hasValidPrice()).toBe(false);
    });
  });

  describe('isValid', () => {
    it('debería retornar true para item de producto válido', () => {
      expect(productItem.isValid()).toBe(true);
    });

    it('debería retornar true para item de evento válido', () => {
      expect(eventItem.isValid()).toBe(true);
    });

    it('debería retornar false para item sin referencia válida', () => {
      const invalidItem = new OrderItem(
        'item-3',
        'order-1',
        ItemType.PRODUCT,
        null, // Sin productId
        null,
        1,
        99.99,
        new Date(),
      );

      expect(invalidItem.isValid()).toBe(false);
    });

    it('debería retornar false para item con cantidad inválida', () => {
      const invalidItem = new OrderItem(
        'item-3',
        'order-1',
        ItemType.PRODUCT,
        'product-1',
        null,
        0, // Cantidad inválida
        99.99,
        new Date(),
      );

      expect(invalidItem.isValid()).toBe(false);
    });

    it('debería retornar false para item con precio inválido', () => {
      const invalidItem = new OrderItem(
        'item-3',
        'order-1',
        ItemType.PRODUCT,
        'product-1',
        null,
        1,
        -10, // Precio inválido
        new Date(),
      );

      expect(invalidItem.isValid()).toBe(false);
    });
  });

  describe('getSummary', () => {
    it('debería retornar un resumen del item de producto', () => {
      const summary = productItem.getSummary();

      expect(summary).toEqual({
        id: 'item-1',
        itemType: ItemType.PRODUCT,
        itemId: 'product-1',
        quantity: 3,
        unitPrice: 99.99,
        subtotal: expect.closeTo(299.97, 2),
      });
    });

    it('debería retornar un resumen del item de evento', () => {
      const summary = eventItem.getSummary();

      expect(summary).toEqual({
        id: 'item-2',
        itemType: ItemType.EVENT,
        itemId: 'event-1',
        quantity: 2,
        unitPrice: 50.00,
        subtotal: 100.00,
      });
    });
  });
});

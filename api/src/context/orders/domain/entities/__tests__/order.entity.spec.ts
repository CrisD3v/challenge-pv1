import { ItemType, OrderItem } from '../order-item.entity';
import { Order, OrderStatus } from '../order.entity';

describe('Order Entity', () => {
  let orderItem1: OrderItem;
  let orderItem2: OrderItem;
  let order: Order;

  beforeEach(() => {
    orderItem1 = new OrderItem(
      'item-1',
      'order-1',
      ItemType.PRODUCT,
      'product-1',
      null,
      2,
      99.99,
      new Date('2023-01-01'),
    );

    orderItem2 = new OrderItem(
      'item-2',
      'order-1',
      ItemType.EVENT,
      null,
      'event-1',
      1,
      50.00,
      new Date('2023-01-01'),
    );

    order = new Order(
      'order-1',
      [orderItem1, orderItem2],
      249.98,
      OrderStatus.PENDING,
      new Date('2023-01-01'),
      new Date('2023-01-01'),
    );
  });

  describe('constructor', () => {
    it('debería crear una orden con todas las propiedades', () => {
      expect(order.id).toBe('order-1');
      expect(order.items).toHaveLength(2);
      expect(order.total).toBe(249.98);
      expect(order.status).toBe(OrderStatus.PENDING);
    });
  });

  describe('calculateTotal', () => {
    it('debería calcular el total correctamente', () => {
      const calculatedTotal = order.calculateTotal();
      expect(calculatedTotal).toBeCloseTo(249.98, 2); // (2 * 99.99) + (1 * 50.00)
    });

    it('debería retornar 0 para orden sin items', () => {
      const emptyOrder = new Order(
        'order-2',
        [],
        0,
        OrderStatus.PENDING,
        new Date(),
        new Date(),
      );

      expect(emptyOrder.calculateTotal()).toBe(0);
    });
  });

  describe('canBeCancelled', () => {
    it('debería retornar true para orden PENDING', () => {
      expect(order.canBeCancelled()).toBe(true);
    });

    it('debería retornar true para orden PROCESSING', () => {
      const processingOrder = new Order(
        'order-1',
        [orderItem1],
        199.98,
        OrderStatus.PROCESSING,
        new Date(),
        new Date(),
      );

      expect(processingOrder.canBeCancelled()).toBe(true);
    });

    it('debería retornar false para orden COMPLETED', () => {
      const completedOrder = new Order(
        'order-1',
        [orderItem1],
        199.98,
        OrderStatus.COMPLETED,
        new Date(),
        new Date(),
      );

      expect(completedOrder.canBeCancelled()).toBe(false);
    });

    it('debería retornar false para orden CANCELLED', () => {
      const cancelledOrder = new Order(
        'order-1',
        [orderItem1],
        199.98,
        OrderStatus.CANCELLED,
        new Date(),
        new Date(),
      );

      expect(cancelledOrder.canBeCancelled()).toBe(false);
    });
  });

  describe('canBeProcessed', () => {
    it('debería retornar true para orden PENDING', () => {
      expect(order.canBeProcessed()).toBe(true);
    });

    it('debería retornar false para orden PROCESSING', () => {
      const processingOrder = new Order(
        'order-1',
        [orderItem1],
        199.98,
        OrderStatus.PROCESSING,
        new Date(),
        new Date(),
      );

      expect(processingOrder.canBeProcessed()).toBe(false);
    });
  });

  describe('canBeCompleted', () => {
    it('debería retornar true para orden PROCESSING', () => {
      const processingOrder = new Order(
        'order-1',
        [orderItem1],
        199.98,
        OrderStatus.PROCESSING,
        new Date(),
        new Date(),
      );

      expect(processingOrder.canBeCompleted()).toBe(true);
    });

    it('debería retornar false para orden PENDING', () => {
      expect(order.canBeCompleted()).toBe(false);
    });
  });

  describe('status checks', () => {
    it('debería verificar correctamente si está pendiente', () => {
      expect(order.isPending()).toBe(true);
      expect(order.isProcessing()).toBe(false);
      expect(order.isCompleted()).toBe(false);
      expect(order.isCancelled()).toBe(false);
    });
  });

  describe('getTotalItems', () => {
    it('debería retornar la cantidad total de items', () => {
      expect(order.getTotalItems()).toBe(3); // 2 + 1
    });
  });

  describe('hasItems', () => {
    it('debería retornar true si tiene items', () => {
      expect(order.hasItems()).toBe(true);
    });

    it('debería retornar false si no tiene items', () => {
      const emptyOrder = new Order(
        'order-2',
        [],
        0,
        OrderStatus.PENDING,
        new Date(),
        new Date(),
      );

      expect(emptyOrder.hasItems()).toBe(false);
    });
  });

  describe('getSummary', () => {
    it('debería retornar un resumen de la orden', () => {
      const summary = order.getSummary();

      expect(summary).toEqual({
        id: 'order-1',
        status: OrderStatus.PENDING,
        total: 249.98,
        totalItems: 3,
        itemsCount: 2,
        createdAt: order.createdAt,
      });
    });
  });

  describe('isTotalValid', () => {
    it('debería retornar true si el total coincide con el calculado', () => {
      expect(order.isTotalValid()).toBe(true);
    });

    it('debería retornar false si el total no coincide', () => {
      const invalidOrder = new Order(
        'order-2',
        [orderItem1],
        100.00, // Total incorrecto
        OrderStatus.PENDING,
        new Date(),
        new Date(),
      );

      expect(invalidOrder.isTotalValid()).toBe(false);
    });

    it('debería manejar pequeñas diferencias de punto flotante', () => {
      const orderWithFloatDiff = new Order(
        'order-3',
        [orderItem1],
        199.989, // Pequeña diferencia
        OrderStatus.PENDING,
        new Date(),
        new Date(),
      );

      expect(orderWithFloatDiff.isTotalValid()).toBe(true);
    });
  });
});

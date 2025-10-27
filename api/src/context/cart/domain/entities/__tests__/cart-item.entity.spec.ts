import { ItemType } from '@prisma/client';
import { CartItem } from '../cart-item.entity';

describe('CartItem Entity', () => {
  describe('constructor', () => {
    it('should create a cart item with all properties', () => {
      const cartItem = new CartItem(
        'item-1',
        ItemType.PRODUCT,
        2,
        10.99,
        'Test Product'
      );

      expect(cartItem.id).toBe('item-1');
      expect(cartItem.itemType).toBe(ItemType.PRODUCT);
      expect(cartItem.quantity).toBe(2);
      expect(cartItem.unitPrice).toBe(10.99);
      expect(cartItem.name).toBe('Test Product');
    });

    it('should create an event cart item', () => {
      const cartItem = new CartItem(
        'item-2',
        ItemType.EVENT,
        1,
        25.50,
        'Concert Event'
      );

      expect(cartItem.itemType).toBe(ItemType.EVENT);
      expect(cartItem.name).toBe('Concert Event');
    });
  });

  describe('subtotal', () => {
    it('should calculate subtotal correctly', () => {
      const cartItem = new CartItem(
        'item-1',
        ItemType.PRODUCT,
        3,
        15.99,
        'Test Product'
      );

      expect(cartItem.subtotal()).toBe(47.97); // 3 * 15.99
    });

    it('should handle zero quantity', () => {
      const cartItem = new CartItem(
        'item-1',
        ItemType.PRODUCT,
        0,
        10.99,
        'Test Product'
      );

      expect(cartItem.subtotal()).toBe(0);
    });

    it('should handle zero price', () => {
      const cartItem = new CartItem(
        'item-1',
        ItemType.PRODUCT,
        5,
        0,
        'Free Product'
      );

      expect(cartItem.subtotal()).toBe(0);
    });

    it('should handle decimal calculations correctly', () => {
      const cartItem = new CartItem(
        'item-1',
        ItemType.PRODUCT,
        2,
        10.99,
        'Test Product'
      );

      expect(cartItem.subtotal()).toBe(21.98);
    });
  });
});

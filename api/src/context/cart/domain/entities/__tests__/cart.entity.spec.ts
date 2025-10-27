import { ItemType } from '@prisma/client';
import { CartItem } from '../cart-item.entity';
import { Cart } from '../cart.entity';

describe('Cart Entity', () => {
  let cart: Cart;
  let cartItem1: CartItem;
  let cartItem2: CartItem;

  beforeEach(() => {
    cartItem1 = new CartItem('item-1', ItemType.PRODUCT, 2, 10.99, 'Product 1', 'product-1', undefined);
    cartItem2 = new CartItem('item-2', ItemType.EVENT, 1, 25.50, 'Event 1', undefined, 'event-1');
    cart = new Cart('cart-1', new Date('2023-01-01'), new Date('2023-01-01'), []);
  });

  describe('constructor', () => {
    it('should create a cart with empty items by default', () => {
      const emptyCart = new Cart('cart-1', new Date(), new Date());
      expect(emptyCart.items).toEqual([]);
    });

    it('should create a cart with provided items', () => {
      const cartWithItems = new Cart('cart-1', new Date(), new Date(), [cartItem1]);
      expect(cartWithItems.items).toHaveLength(1);
      expect(cartWithItems.items[0]).toEqual(cartItem1);
    });
  });

  describe('total', () => {
    it('should return 0 for empty cart', () => {
      expect(cart.total()).toBe(0);
    });

    it('should calculate total correctly with one item', () => {
      cart.items.push(cartItem1);
      expect(cart.total()).toBe(21.98); // 2 * 10.99
    });

    it('should calculate total correctly with multiple items', () => {
      cart.items.push(cartItem1, cartItem2);
      expect(cart.total()).toBeCloseTo(47.48, 2); // (2 * 10.99) + (1 * 25.50)
    });
  });

  describe('addItem', () => {
    it('should add new item to empty cart', () => {
      cart.addItem(cartItem1);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toEqual(cartItem1);
    });

    it('should add multiple different items', () => {
      cart.addItem(cartItem1);
      cart.addItem(cartItem2);
      expect(cart.items).toHaveLength(2);
    });

    it('should update quantity when adding same product item', () => {
      const sameProductItem = new CartItem('item-3', ItemType.PRODUCT, 3, 10.99, 'Product 1', 'product-1', undefined);

      cart.addItem(cartItem1);
      cart.addItem(sameProductItem);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(5); // 2 + 3
    });
  });

  describe('updateItemQuantity', () => {
    beforeEach(() => {
      cart.items.push(cartItem1);
    });

    it('should update item quantity', () => {
      cart.updateItemQuantity('item-1', 5);
      expect(cart.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0', () => {
      cart.updateItemQuantity('item-1', 0);
      expect(cart.items).toHaveLength(0);
    });

    it('should remove item when quantity is negative', () => {
      cart.updateItemQuantity('item-1', -1);
      expect(cart.items).toHaveLength(0);
    });

    it('should throw error when item not found', () => {
      expect(() => cart.updateItemQuantity('non-existent', 5))
        .toThrow('Item not found in cart');
    });
  });

  describe('clear', () => {
    it('should remove all items from cart', () => {
      cart.items.push(cartItem1, cartItem2);
      expect(cart.items).toHaveLength(2);

      cart.clear();
      expect(cart.items).toHaveLength(0);
    });

    it('should work on empty cart', () => {
      cart.clear();
      expect(cart.items).toHaveLength(0);
    });
  });
});

import { Product } from '../product.entity';

describe('Product Entity', () => {
  let product: Product;

  beforeEach(() => {
    product = new Product(
      'product-1',
      'Producto de Prueba',
      'https://example.com/image.jpg',
      'Descripción del producto',
      2,
      99.99,
      new Date('2023-01-01'),
      new Date('2023-01-01'),
    );
  });

  describe('constructor', () => {
    it('debería crear un producto con todas las propiedades', () => {
      expect(product.id).toBe('product-1');
      expect(product.name).toBe('Producto de Prueba');
      expect(product.thumbnail).toBe('https://example.com/image.jpg');
      expect(product.description).toBe('Descripción del producto');
      expect(product.unit).toBe(2);
      expect(product.unitPrice).toBe(99.99);
    });

    it('debería crear un producto con thumbnail null', () => {
      const productWithoutThumbnail = new Product(
        'product-2',
        'Producto Sin Imagen',
        null,
        'Descripción',
        1,
        50.00,
        new Date(),
        new Date(),
      );

      expect(productWithoutThumbnail.thumbnail).toBeNull();
    });
  });

  describe('calculateTotalPrice', () => {
    it('debería calcular el precio total correctamente', () => {
      const total = product.calculateTotalPrice(3);
      expect(total).toBeCloseTo(299.97, 2); // 99.99 * 3
    });

    it('debería retornar 0 cuando la cantidad es 0', () => {
      const total = product.calculateTotalPrice(0);
      expect(total).toBe(0);
    });

    it('debería manejar cantidades decimales', () => {
      const total = product.calculateTotalPrice(2.5);
      expect(total).toBeCloseTo(249.975, 3); // 99.99 * 2.5
    });
  });

  describe('isAvailable', () => {
    it('debería retornar true cuando el precio es mayor a 0', () => {
      expect(product.isAvailable()).toBe(true);
    });

    it('debería retornar false cuando el precio es 0', () => {
      const freeProduct = new Product(
        'product-free',
        'Producto Gratis',
        null,
        null,
        1,
        0,
        new Date(),
        new Date(),
      );

      expect(freeProduct.isAvailable()).toBe(false);
    });

    it('debería retornar false cuando el precio es negativo', () => {
      const negativeProduct = new Product(
        'product-negative',
        'Producto Negativo',
        null,
        null,
        1,
        -10,
        new Date(),
        new Date(),
      );

      expect(negativeProduct.isAvailable()).toBe(false);
    });
  });

  describe('hasThumbnail', () => {
    it('debería retornar true cuando tiene thumbnail', () => {
      expect(product.hasThumbnail()).toBe(true);
    });

    it('debería retornar false cuando thumbnail es null', () => {
      const productWithoutThumbnail = new Product(
        'product-2',
        'Producto Sin Imagen',
        null,
        'Descripción',
        1,
        50.00,
        new Date(),
        new Date(),
      );

      expect(productWithoutThumbnail.hasThumbnail()).toBe(false);
    });

    it('debería retornar false cuando thumbnail es string vacío', () => {
      const productWithEmptyThumbnail = new Product(
        'product-3',
        'Producto Thumbnail Vacío',
        '',
        'Descripción',
        1,
        50.00,
        new Date(),
        new Date(),
      );

      expect(productWithEmptyThumbnail.hasThumbnail()).toBe(false);
    });
  });

  describe('getSummary', () => {
    it('debería retornar un resumen del producto', () => {
      const summary = product.getSummary();

      expect(summary).toEqual({
        id: 'product-1',
        name: 'Producto de Prueba',
        unitPrice: 99.99,
        isAvailable: true,
      });
    });

    it('debería retornar resumen con isAvailable false para producto no disponible', () => {
      const unavailableProduct = new Product(
        'product-unavailable',
        'Producto No Disponible',
        null,
        null,
        1,
        0,
        new Date(),
        new Date(),
      );

      const summary = unavailableProduct.getSummary();

      expect(summary.isAvailable).toBe(false);
    });
  });
});

import { CartItem } from '@context/cart/domain/entities/cart-item.entity';
import { Cart } from '@context/cart/domain/entities/cart.entity';
import { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Injectable } from '@nestjs/common';
import { ItemType } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class PrismaCartRepository implements ICartRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(cartId: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { product: true, event: true },
        },
      },
    });

    if (!cart) return null;

    const items = cart.items.map(
      (item) =>
        new CartItem(
          item.id,
          item.itemType,
          item.quantity,
          item.product?.unitPrice ?? item.event?.unitPrice ?? 0,
          item.product?.name ?? item.event?.name ?? '',
          item.productId ?? undefined,
          item.eventId ?? undefined,
        ),
    );

    return new Cart(cart.id, cart.createdAt, cart.updatedAt, items);
  }

  async create(): Promise<Cart> {
    const cart = await this.prisma.cart.create({ data: {} });
    return new Cart(cart.id, cart.createdAt, cart.updatedAt);
  }

  async updateQuantity(cartId: string, itemId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    await this.prisma.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });
  }

  async addItem(cartId: string, itemType: string, productId?: string, eventId?: string, quantity = 1): Promise<void> {
    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        itemType: itemType as ItemType,
        productId,
        eventId,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new item
      await this.prisma.cartItem.create({
        data: {
          cartId,
          itemType: itemType as ItemType,
          productId,
          eventId,
          quantity,
        },
      });
    }

    await this.prisma.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });
  }

  async getAllCarts(): Promise<Cart[]> {
    const carts = await this.prisma.cart.findMany({
      include: {
        items: {
          include: { product: true, event: true },
        },
      },
    });

    return carts.map(cart => {
      const items = cart.items.map(
        (item) =>
          new CartItem(
            item.id,
            item.itemType,
            item.quantity,
            item.product?.unitPrice ?? item.event?.unitPrice ?? 0,
            item.product?.name ?? item.event?.name ?? '',
            item.productId ?? undefined,
            item.eventId ?? undefined,
          ),
      );

      return new Cart(cart.id, cart.createdAt, cart.updatedAt, items);
    });
  }

  async clear(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { cartId } });

    await this.prisma.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });
  }
}

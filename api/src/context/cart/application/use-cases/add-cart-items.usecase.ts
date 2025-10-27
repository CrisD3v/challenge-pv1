import { AddCartItemDto } from '@context/cart/application/dtos/add-cart-item.dto';
import { Cart } from '@context/cart/domain/entities/cart.entity';
import { CartNotFoundException } from '@context/cart/domain/exceptions/cart-not-found.exception';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AddCartItemUseCase {
  constructor(
    @Inject('CartRepositoryPort')
    private readonly cartRepository: ICartRepository,
  ) { }

  async execute(cartId: string, dto: AddCartItemDto): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new CartNotFoundException(cartId);
    }

    await this.cartRepository.addItem(
      cartId,
      dto.itemType,
      dto.productId,
      dto.eventId,
      dto.quantity,
    );

    const updatedCart = await this.cartRepository.findById(cartId);
    if (!updatedCart) {
      throw new CartNotFoundException(cartId);
    }

    return updatedCart;
  }
}

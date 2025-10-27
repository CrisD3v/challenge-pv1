import { Cart } from '@context/cart/domain/entities/cart.entity';
import { CartNotFoundException } from '@context/cart/domain/exceptions/cart-not-found.exception';
import { type ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateCartItemQuantityUseCase {
  constructor(
    @Inject('CartRepositoryPort')
    private readonly cartRepository: ICartRepository,
  ) { }

  async execute(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new CartNotFoundException(cartId);
    }

    await this.cartRepository.updateQuantity(cartId, itemId, quantity);

    const updatedCart = await this.cartRepository.findById(cartId);
    if (!updatedCart) {
      throw new CartNotFoundException(cartId);
    }

    return updatedCart;
  }
}

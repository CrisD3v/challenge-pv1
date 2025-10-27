import { CartNotFoundException } from '@context/cart/domain/exceptions/cart-not-found.exception';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ClearCartUseCase {
  constructor(
    @Inject('CartRepositoryPort')
    private readonly cartRepository: ICartRepository,
  ) { }

  async execute(cartId: string): Promise<void> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new CartNotFoundException(cartId);
    }

    await this.cartRepository.clear(cartId);
  }
}

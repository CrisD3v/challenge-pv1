import { Cart } from '@context/cart/domain/entities/cart.entity';
import type { ICartRepository } from '@context/cart/domain/repositories/cart.repository.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAllCartsUseCase {
  constructor(
    @Inject('CartRepositoryPort')
    private readonly cartRepository: ICartRepository,
  ) { }

  async execute(): Promise<Cart[]> {
    return this.cartRepository.getAllCarts();
  }
}

import { CartModule } from '@/context/cart/cart.module';
import { HealthModule } from '@/context/health/health.module';
import { ItemsModule } from '@/context/items/items.module';
import { OrdersModule } from '@/context/orders/orders.module';
import { UploadsModule } from '@/context/uploads/uploads.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [HealthModule, CartModule, ItemsModule, OrdersModule, UploadsModule],
  providers: [],
})
export class AppModule {}

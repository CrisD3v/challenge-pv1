import { Product } from '@context/items/domain/entities/product.entity';
import { IProductRepository } from '@context/items/domain/repositories/product.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

/**
 * Implementación del repositorio de productos usando Prisma
 * Adaptador que conecta el dominio con la base de datos
 */
@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Busca un producto por su ID
   * @param id - ID del producto
   * @returns Producto encontrado o null si no existe
   */
  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    return new Product(
      product.id,
      product.name,
      product.thumbnail,
      product.description,
      product.unit,
      product.unitPrice,
      product.createdAt,
      product.updatedAt,
    );
  }

  /**
   * Obtiene todos los productos
   * @returns Lista de todos los productos
   */
  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return products.map(
      (product) =>
        new Product(
          product.id,
          product.name,
          product.thumbnail,
          product.description,
          product.unit,
          product.unitPrice,
          product.createdAt,
          product.updatedAt,
        ),
    );
  }

  /**
   * Busca productos por nombre (búsqueda parcial)
   * @param name - Nombre o parte del nombre a buscar
   * @returns Lista de productos que coinciden con la búsqueda
   */
  async findByName(name: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
    });

    return products.map(
      (product) =>
        new Product(
          product.id,
          product.name,
          product.thumbnail,
          product.description,
          product.unit,
          product.unitPrice,
          product.createdAt,
          product.updatedAt,
        ),
    );
  }

  /**
   * Obtiene productos disponibles (precio > 0)
   * @returns Lista de productos disponibles
   */
  async findAvailable(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        unitPrice: {
          gt: 0,
        },
      },
      orderBy: { name: 'asc' },
    });

    return products.map(
      (product) =>
        new Product(
          product.id,
          product.name,
          product.thumbnail,
          product.description,
          product.unit,
          product.unitPrice,
          product.createdAt,
          product.updatedAt,
        ),
    );
  }

  /**
   * Crea un nuevo producto
   * @param name - Nombre del producto
   * @param thumbnail - URL de la imagen (opcional)
   * @param description - Descripción del producto (opcional)
   * @param unit - Unidad del producto
   * @param unitPrice - Precio unitario
   * @returns Producto creado
   */
  async create(
    name: string,
    thumbnail?: string,
    description?: string,
    unit = 1,
    unitPrice = 0,
  ): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        name,
        thumbnail,
        description,
        unit,
        unitPrice,
      },
    });

    return new Product(
      product.id,
      product.name,
      product.thumbnail,
      product.description,
      product.unit,
      product.unitPrice,
      product.createdAt,
      product.updatedAt,
    );
  }

  /**
   * Actualiza un producto existente
   * @param id - ID del producto a actualizar
   * @param name - Nuevo nombre (opcional)
   * @param thumbnail - Nueva URL de imagen (opcional)
   * @param description - Nueva descripción (opcional)
   * @param unit - Nueva unidad (opcional)
   * @param unitPrice - Nuevo precio unitario (opcional)
   * @returns Producto actualizado
   */
  async update(
    id: string,
    name?: string,
    thumbnail?: string,
    description?: string,
    unit?: number,
    unitPrice?: number,
  ): Promise<Product> {
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (description !== undefined) updateData.description = description;
    if (unit !== undefined) updateData.unit = unit;
    if (unitPrice !== undefined) updateData.unitPrice = unitPrice;

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
    });

    return new Product(
      product.id,
      product.name,
      product.thumbnail,
      product.description,
      product.unit,
      product.unitPrice,
      product.createdAt,
      product.updatedAt,
    );
  }

  /**
   * Elimina un producto
   * @param id - ID del producto a eliminar
   */
  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }
}

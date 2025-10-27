import { UploadedFile } from '@context/uploads/domain/entities/uploaded-file.entity';
import { IFileRepository } from '@context/uploads/domain/repositories/file.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

/**
 * Implementación del repositorio de archivos usando Prisma
 * Adaptador que conecta el dominio con la base de datos
 */
@Injectable()
export class PrismaFileRepository implements IFileRepository {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Busca un archivo por su ID
   * @param id - ID del archivo
   * @returns Archivo encontrado o null si no existe
   */
  async findById(id: string): Promise<UploadedFile | null> {
    const file = await this.prisma.uploadedFile.findUnique({
      where: { id },
    });

    if (!file) return null;

    return new UploadedFile(
      file.id,
      file.originalName,
      file.fileName,
      file.mimeType,
      file.size,
      file.path,
      file.url,
      file.createdAt,
    );
  }

  /**
   * Obtiene todos los archivos
   * @returns Lista de todos los archivos
   */
  async findAll(): Promise<UploadedFile[]> {
    const files = await this.prisma.uploadedFile.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return files.map(
      (file) =>
        new UploadedFile(
          file.id,
          file.originalName,
          file.fileName,
          file.mimeType,
          file.size,
          file.path,
          file.url,
          file.createdAt,
        ),
    );
  }

  /**
   * Busca archivos por tipo MIME
   * @param mimeType - Tipo MIME a buscar
   * @returns Lista de archivos que coinciden con el tipo
   */
  async findByMimeType(mimeType: string): Promise<UploadedFile[]> {
    const files = await this.prisma.uploadedFile.findMany({
      where: { mimeType },
      orderBy: { createdAt: 'desc' },
    });

    return files.map(
      (file) =>
        new UploadedFile(
          file.id,
          file.originalName,
          file.fileName,
          file.mimeType,
          file.size,
          file.path,
          file.url,
          file.createdAt,
        ),
    );
  }

  /**
   * Obtiene solo archivos de imagen
   * @returns Lista de archivos de imagen
   */
  async findImages(): Promise<UploadedFile[]> {
    const files = await this.prisma.uploadedFile.findMany({
      where: {
        mimeType: {
          startsWith: 'image/',
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return files.map(
      (file) =>
        new UploadedFile(
          file.id,
          file.originalName,
          file.fileName,
          file.mimeType,
          file.size,
          file.path,
          file.url,
          file.createdAt,
        ),
    );
  }

  /**
   * Guarda información de un archivo subido
   * @param originalName - Nombre original del archivo
   * @param fileName - Nombre del archivo en el servidor
   * @param mimeType - Tipo MIME del archivo
   * @param size - Tamaño del archivo en bytes
   * @param path - Ruta del archivo en el servidor
   * @param url - URL pública del archivo
   * @returns Archivo guardado
   */
  async save(
    originalName: string,
    fileName: string,
    mimeType: string,
    size: number,
    path: string,
    url: string,
  ): Promise<UploadedFile> {
    const file = await this.prisma.uploadedFile.create({
      data: {
        originalName,
        fileName,
        mimeType,
        size,
        path,
        url,
      },
    });

    return new UploadedFile(
      file.id,
      file.originalName,
      file.fileName,
      file.mimeType,
      file.size,
      file.path,
      file.url,
      file.createdAt,
    );
  }

  /**
   * Elimina un archivo del registro
   * @param id - ID del archivo a eliminar
   */
  async delete(id: string): Promise<void> {
    await this.prisma.uploadedFile.delete({
      where: { id },
    });
  }
}

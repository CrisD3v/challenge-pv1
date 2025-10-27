import { FileNotFoundException } from '@context/uploads/domain/exceptions/file-not-found.exception';
import type { IFileRepository } from '@context/uploads/domain/repositories/file.repository.port';
import type { IFileStorageService } from '@context/uploads/domain/services/file-storage.service.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para eliminar un archivo
 * Orquesta la lógica de negocio para la eliminación de archivos
 */
@Injectable()
export class DeleteFileUseCase {
  constructor(
    @Inject('FileRepositoryPort')
    private readonly fileRepository: IFileRepository,
    @Inject('FileStorageServicePort')
    private readonly fileStorageService: IFileStorageService,
  ) { }

  /**
   * Ejecuta la eliminación de un archivo
   * @param id - ID del archivo a eliminar
   * @throws FileNotFoundException si el archivo no existe
   */
  async execute(id: string): Promise<void> {
    // Verificar que el archivo existe
    const existingFile = await this.fileRepository.findById(id);
    if (!existingFile) {
      throw new FileNotFoundException(id);
    }

    try {
      // Eliminar archivo físico
      await this.fileStorageService.deleteFile(existingFile.path);
    } catch (error) {
      // Log del error pero continuar con la eliminación del registro
      console.warn(`No se pudo eliminar el archivo físico: ${existingFile.path}`, error);
    }

    // Eliminar registro de la base de datos
    await this.fileRepository.delete(id);
  }
}

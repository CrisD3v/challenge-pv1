import { UploadedFile } from '@context/uploads/domain/entities/uploaded-file.entity';
import type { IFileRepository } from '@context/uploads/domain/repositories/file.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para obtener todos los archivos
 * Orquesta la lógica de negocio para la consulta de todos los archivos
 */
@Injectable()
export class GetAllFilesUseCase {
  constructor(
    @Inject('FileRepositoryPort')
    private readonly fileRepository: IFileRepository,
  ) { }

  /**
   * Ejecuta la búsqueda de todos los archivos
   * @returns Lista de todos los archivos
   */
  async execute(): Promise<UploadedFile[]> {
    return this.fileRepository.findAll();
  }
}

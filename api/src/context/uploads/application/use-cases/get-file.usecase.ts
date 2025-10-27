import { UploadedFile } from '@context/uploads/domain/entities/uploaded-file.entity';
import { FileNotFoundException } from '@context/uploads/domain/exceptions/file-not-found.exception';
import type { IFileRepository } from '@context/uploads/domain/repositories/file.repository.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para obtener un archivo por ID
 * Orquesta la lógica de negocio para la consulta de archivos
 */
@Injectable()
export class GetFileUseCase {
  constructor(
    @Inject('FileRepositoryPort')
    private readonly fileRepository: IFileRepository,
  ) { }

  /**
   * Ejecuta la búsqueda de un archivo por ID
   * @param id - ID del archivo a buscar
   * @returns Archivo encontrado
   * @throws FileNotFoundException si el archivo no existe
   */
  async execute(id: string): Promise<UploadedFile> {
    const file = await this.fileRepository.findById(id);

    if (!file) {
      throw new FileNotFoundException(id);
    }

    return file;
  }
}

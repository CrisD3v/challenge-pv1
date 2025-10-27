import { UploadedFile } from '@context/uploads/domain/entities/uploaded-file.entity';
import { InvalidFileException } from '@context/uploads/domain/exceptions/invalid-file.exception';
import type { IFileRepository } from '@context/uploads/domain/repositories/file.repository.port';
import type { IFileStorageService } from '@context/uploads/domain/services/file-storage.service.port';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Caso de uso para subir archivos
 * Orquesta la lógica de negocio para el upload de archivos
 */
@Injectable()
export class UploadFileUseCase {
  // Tamaño máximo por defecto: 5MB
  private readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

  // Tipos de archivo permitidos por defecto
  private readonly DEFAULT_ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  constructor(
    @Inject('FileRepositoryPort')
    private readonly fileRepository: IFileRepository,
    @Inject('FileStorageServicePort')
    private readonly fileStorageService: IFileStorageService,
  ) { }

  /**
   * Ejecuta la subida de un archivo
   * @param file - Información del archivo subido
   * @param maxSize - Tamaño máximo permitido (opcional)
   * @param allowedTypes - Tipos MIME permitidos (opcional)
   * @returns Archivo subido y guardado
   * @throws InvalidFileException si el archivo no cumple las validaciones
   */
  async execute(
    file: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
      size: number;
    },
    maxSize?: number,
    allowedTypes?: string[],
  ): Promise<UploadedFile> {
    // Usar valores por defecto si no se proporcionan
    const maxFileSize = maxSize || this.DEFAULT_MAX_SIZE;
    const allowedMimeTypes = allowedTypes || this.DEFAULT_ALLOWED_TYPES;

    // Validar que se proporcionó un archivo
    if (!file || !file.buffer) {
      throw new InvalidFileException('No se proporcionó ningún archivo');
    }

    // Validar tamaño del archivo
    if (file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(1);
      throw new InvalidFileException(
        `El archivo excede el tamaño máximo permitido de ${maxSizeMB}MB`
      );
    }

    // Validar tipo de archivo
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new InvalidFileException(
        `Tipo de archivo no permitido. Tipos permitidos: ${allowedMimeTypes.join(', ')}`
      );
    }

    // Validar nombre del archivo
    if (!file.originalname || file.originalname.trim().length === 0) {
      throw new InvalidFileException('File must have a valid name');
    }

    try {
      // Generar nombre único para el archivo
      const uniqueFileName = this.fileStorageService.generateUniqueFileName(file.originalname);

      // Guardar archivo físicamente
      const savedFile = await this.fileStorageService.saveFile(
        file.buffer,
        uniqueFileName,
        file.mimetype,
      );

      // Guardar información en la base de datos
      const uploadedFile = await this.fileRepository.save(
        file.originalname,
        savedFile.fileName,
        file.mimetype,
        file.size,
        savedFile.path,
        savedFile.url,
      );

      return uploadedFile;
    } catch (error) {
      throw new InvalidFileException(
        `Error al guardar el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

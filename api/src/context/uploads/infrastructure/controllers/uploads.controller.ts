import { DeleteFileUseCase } from '@context/uploads/application/use-cases/delete-file.usecase';
import { GetAllFilesUseCase } from '@context/uploads/application/use-cases/get-all-files.usecase';
import { GetFileUseCase } from '@context/uploads/application/use-cases/get-file.usecase';
import { UploadFileUseCase } from '@context/uploads/application/use-cases/upload-file.usecase';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UploadedFile as NestUploadedFile,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

/**
 * Controlador REST para la gestión de uploads de archivos
 * Maneja las peticiones HTTP y delega la lógica de negocio a los casos de uso
 */
@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly getFileUseCase: GetFileUseCase,
    private readonly getAllFilesUseCase: GetAllFilesUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
  ) { }

  /**
   * Sube un archivo al servidor
   * @param file - Archivo subido
   * @param maxSize - Tamaño máximo permitido en bytes (opcional)
   * @param allowedTypes - Tipos MIME permitidos separados por coma (opcional)
   * @returns Información del archivo subido
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @NestUploadedFile() file: Express.Multer.File,
    @Query('maxSize') maxSize?: string,
    @Query('allowedTypes') allowedTypes?: string,
  ) {
    // Parsear parámetros opcionales
    const maxSizeBytes = maxSize ? parseInt(maxSize, 10) : undefined;
    const allowedMimeTypes = allowedTypes ? allowedTypes.split(',') : undefined;

    return this.uploadFileUseCase.execute(
      {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      maxSizeBytes,
      allowedMimeTypes,
    );
  }

  /**
   * Obtiene todos los archivos subidos
   * @returns Lista de archivos
   */
  @Get()
  async getAllFiles() {
    return this.getAllFilesUseCase.execute();
  }

  /**
   * Obtiene un archivo por su ID
   * @param id - ID del archivo
   * @returns Información del archivo
   */
  @Get(':id')
  async getFile(@Param('id') id: string) {
    return this.getFileUseCase.execute(id);
  }

  /**
   * Elimina un archivo
   * @param id - ID del archivo a eliminar
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Param('id') id: string) {
    await this.deleteFileUseCase.execute(id);
  }
}

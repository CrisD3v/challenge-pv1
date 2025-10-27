import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from '@prisma/prisma.service';

// Controladores
import { UploadsController } from '@context/uploads/infrastructure/controllers/uploads.controller';

// Repositorios
import { PrismaFileRepository } from '@context/uploads/infrastructure/repositories/prisma-file.repository';

// Servicios
import { LocalFileStorageService } from '@context/uploads/infrastructure/services/local-file-storage.service';

// Casos de uso
import { DeleteFileUseCase } from '@context/uploads/application/use-cases/delete-file.usecase';
import { GetAllFilesUseCase } from '@context/uploads/application/use-cases/get-all-files.usecase';
import { GetFileUseCase } from '@context/uploads/application/use-cases/get-file.usecase';
import { UploadFileUseCase } from '@context/uploads/application/use-cases/upload-file.usecase';

/**
 * Módulo principal del contexto de uploads
 * Configura la inyección de dependencias y Multer para el manejo de archivos
 */
@Module({
  imports: [
    // Configuración de Multer para manejo de archivos en memoria
    MulterModule.register({
      storage: 'memory', // Almacenar en memoria para procesamiento
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB máximo por defecto
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [
    // Servicios de infraestructura
    PrismaService,

    // Repositorios concretos
    PrismaFileRepository,

    // Servicios
    LocalFileStorageService,

    // Casos de uso
    UploadFileUseCase,
    GetFileUseCase,
    GetAllFilesUseCase,
    DeleteFileUseCase,

    // Inyección de dependencias - Puertos apuntando a adaptadores
    { provide: 'FileRepositoryPort', useExisting: PrismaFileRepository },
    { provide: 'FileStorageServicePort', useExisting: LocalFileStorageService },
  ],
  exports: [
    // Exportar casos de uso para uso en otros módulos
    UploadFileUseCase,
    GetFileUseCase,
    GetAllFilesUseCase,
    DeleteFileUseCase,
  ],
})
export class UploadsModule { }

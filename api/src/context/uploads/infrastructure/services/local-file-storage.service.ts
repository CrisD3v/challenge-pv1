import { IFileStorageService } from '@context/uploads/domain/services/file-storage.service.port';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Implementación del servicio de almacenamiento de archivos local
 * Guarda archivos en el sistema de archivos local en la carpeta public
 */
@Injectable()
export class LocalFileStorageService implements IFileStorageService {
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');
  private readonly baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  constructor() {
    // Crear directorio de uploads si no existe
    this.ensureUploadDirExists();
  }

  /**
   * Guarda un archivo en el sistema de archivos local
   * @param file - Buffer del archivo
   * @param fileName - Nombre del archivo
   * @param mimeType - Tipo MIME del archivo
   * @returns Información del archivo guardado
   */
  async saveFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<{
    fileName: string;
    path: string;
    url: string;
  }> {
    // Crear subdirectorio por fecha para organizar archivos
    const dateDir = this.getDateDirectory();
    const fullUploadDir = path.join(this.uploadDir, dateDir);

    // Asegurar que el directorio existe
    await this.ensureDirectoryExists(fullUploadDir);

    // Ruta completa del archivo
    const filePath = path.join(fullUploadDir, fileName);

    // Guardar archivo
    await fs.writeFile(filePath, file);

    // Generar URL pública
    const publicUrl = `${this.baseUrl}/uploads/${dateDir}/${fileName}`;

    return {
      fileName,
      path: filePath,
      url: publicUrl,
    };
  }

  /**
   * Elimina un archivo del sistema de archivos
   * @param filePath - Ruta del archivo a eliminar
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Si el archivo no existe, no es un error crítico
      if ((error as any).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Verifica si un archivo existe
   * @param filePath - Ruta del archivo
   * @returns true si el archivo existe
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Genera un nombre único para el archivo
   * @param originalName - Nombre original del archivo
   * @returns Nombre único generado
   */
  generateUniqueFileName(originalName: string): string {
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    const uuid = uuidv4();
    const timestamp = Date.now();

    // Limpiar nombre original (remover caracteres especiales)
    const cleanName = nameWithoutExt
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 50); // Limitar longitud

    return `${cleanName}_${timestamp}_${uuid}${extension}`;
  }

  /**
   * Asegura que el directorio de uploads existe
   */
  private async ensureUploadDirExists(): Promise<void> {
    await this.ensureDirectoryExists(this.uploadDir);
  }

  /**
   * Asegura que un directorio existe, lo crea si no existe
   * @param dirPath - Ruta del directorio
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Obtiene el directorio basado en la fecha actual (YYYY/MM)
   * @returns Directorio de fecha
   */
  private getDateDirectory(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}/${month}`;
  }
}

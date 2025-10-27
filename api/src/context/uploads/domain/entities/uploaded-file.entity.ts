/**
 * Entidad de dominio que representa un archivo subido
 * Contiene la lógica de negocio relacionada con archivos
 */
export class UploadedFile {
  constructor(
    public readonly id: string,
    public readonly originalName: string,
    public readonly fileName: string,
    public readonly mimeType: string,
    public readonly size: number,
    public readonly path: string,
    public readonly url: string,
    public readonly createdAt: Date,
  ) { }

  /**
   * Verifica si el archivo es una imagen
   * @returns true si el archivo es una imagen
   */
  isImage(): boolean {
    return this.mimeType.startsWith('image/');
  }

  /**
   * Obtiene la extensión del archivo
   * @returns Extensión del archivo
   */
  getExtension(): string {
    const parts = this.fileName.split('.');
    // Si no hay punto o solo hay una parte, no hay extensión
    if (parts.length <= 1) {
      return '';
    }
    return parts.pop()?.toLowerCase() || '';
  }

  /**
   * Verifica si el archivo es de un tipo permitido para imágenes
   * @returns true si es un tipo de imagen permitido
   */
  isAllowedImageType(): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(this.mimeType);
  }

  /**
   * Convierte el tamaño a formato legible
   * @returns Tamaño formateado (ej: "1.5 MB")
   */
  getFormattedSize(): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.size;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Verifica si el archivo excede el tamaño máximo permitido
   * @param maxSizeInBytes - Tamaño máximo en bytes
   * @returns true si excede el tamaño máximo
   */
  exceedsMaxSize(maxSizeInBytes: number): boolean {
    return this.size > maxSizeInBytes;
  }
}

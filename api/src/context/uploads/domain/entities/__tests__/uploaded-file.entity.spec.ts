import { UploadedFile } from '../uploaded-file.entity';

describe('UploadedFile Entity', () => {
  let uploadedFile: UploadedFile;

  beforeEach(() => {
    uploadedFile = new UploadedFile(
      'file-1',
      'test-image.jpg',
      'test-image_123456_uuid.jpg',
      'image/jpeg',
      1048576, // 1MB
      '/path/to/file.jpg',
      'http://localhost:3000/uploads/2023/10/test-image_123456_uuid.jpg',
      new Date('2023-01-01'),
    );
  });

  describe('constructor', () => {
    it('debería crear un archivo subido con todas las propiedades', () => {
      expect(uploadedFile.id).toBe('file-1');
      expect(uploadedFile.originalName).toBe('test-image.jpg');
      expect(uploadedFile.fileName).toBe('test-image_123456_uuid.jpg');
      expect(uploadedFile.mimeType).toBe('image/jpeg');
      expect(uploadedFile.size).toBe(1048576);
      expect(uploadedFile.path).toBe('/path/to/file.jpg');
      expect(uploadedFile.url).toBe('http://localhost:3000/uploads/2023/10/test-image_123456_uuid.jpg');
    });
  });

  describe('isImage', () => {
    it('debería retornar true para archivos de imagen', () => {
      expect(uploadedFile.isImage()).toBe(true);
    });

    it('debería retornar false para archivos que no son imágenes', () => {
      const pdfFile = new UploadedFile(
        'file-2',
        'document.pdf',
        'document_123456_uuid.pdf',
        'application/pdf',
        1024,
        '/path/to/document.pdf',
        'http://localhost:3000/uploads/document.pdf',
        new Date(),
      );

      expect(pdfFile.isImage()).toBe(false);
    });
  });

  describe('getExtension', () => {
    it('debería retornar la extensión correcta', () => {
      expect(uploadedFile.getExtension()).toBe('jpg');
    });

    it('debería retornar extensión en minúsculas', () => {
      const fileWithUpperExt = new UploadedFile(
        'file-3',
        'image.PNG',
        'image_123456_uuid.PNG',
        'image/png',
        1024,
        '/path/to/image.PNG',
        'http://localhost:3000/uploads/image.PNG',
        new Date(),
      );

      expect(fileWithUpperExt.getExtension()).toBe('png');
    });

    it('debería retornar string vacío si no hay extensión', () => {
      const fileWithoutExt = new UploadedFile(
        'file-4',
        'filename',
        'filename_123456_uuid', // Sin punto, por lo que no hay extensión
        'text/plain',
        1024,
        '/path/to/filename',
        'http://localhost:3000/uploads/filename',
        new Date(),
      );

      expect(fileWithoutExt.getExtension()).toBe('');
    });
  });

  describe('isAllowedImageType', () => {
    it('debería retornar true para tipos de imagen permitidos', () => {
      expect(uploadedFile.isAllowedImageType()).toBe(true);
    });

    it('debería retornar true para PNG', () => {
      const pngFile = new UploadedFile(
        'file-5',
        'image.png',
        'image_123456_uuid.png',
        'image/png',
        1024,
        '/path/to/image.png',
        'http://localhost:3000/uploads/image.png',
        new Date(),
      );

      expect(pngFile.isAllowedImageType()).toBe(true);
    });

    it('debería retornar false para tipos no permitidos', () => {
      const svgFile = new UploadedFile(
        'file-6',
        'image.svg',
        'image_123456_uuid.svg',
        'image/svg+xml',
        1024,
        '/path/to/image.svg',
        'http://localhost:3000/uploads/image.svg',
        new Date(),
      );

      expect(svgFile.isAllowedImageType()).toBe(false);
    });
  });

  describe('getFormattedSize', () => {
    it('debería formatear el tamaño en MB', () => {
      expect(uploadedFile.getFormattedSize()).toBe('1.0 MB');
    });

    it('debería formatear tamaños pequeños en KB', () => {
      const smallFile = new UploadedFile(
        'file-7',
        'small.txt',
        'small_123456_uuid.txt',
        'text/plain',
        1536, // 1.5KB
        '/path/to/small.txt',
        'http://localhost:3000/uploads/small.txt',
        new Date(),
      );

      expect(smallFile.getFormattedSize()).toBe('1.5 KB');
    });

    it('debería formatear tamaños muy pequeños en bytes', () => {
      const tinyFile = new UploadedFile(
        'file-8',
        'tiny.txt',
        'tiny_123456_uuid.txt',
        'text/plain',
        512, // 512 bytes
        '/path/to/tiny.txt',
        'http://localhost:3000/uploads/tiny.txt',
        new Date(),
      );

      expect(tinyFile.getFormattedSize()).toBe('512.0 B');
    });

    it('debería formatear tamaños grandes en GB', () => {
      const largeFile = new UploadedFile(
        'file-9',
        'large.zip',
        'large_123456_uuid.zip',
        'application/zip',
        2147483648, // 2GB
        '/path/to/large.zip',
        'http://localhost:3000/uploads/large.zip',
        new Date(),
      );

      expect(largeFile.getFormattedSize()).toBe('2.0 GB');
    });
  });

  describe('exceedsMaxSize', () => {
    it('debería retornar false si el archivo no excede el tamaño máximo', () => {
      const maxSize = 2 * 1024 * 1024; // 2MB
      expect(uploadedFile.exceedsMaxSize(maxSize)).toBe(false);
    });

    it('debería retornar true si el archivo excede el tamaño máximo', () => {
      const maxSize = 512 * 1024; // 512KB
      expect(uploadedFile.exceedsMaxSize(maxSize)).toBe(true);
    });

    it('debería retornar false si el archivo tiene exactamente el tamaño máximo', () => {
      const maxSize = 1048576; // 1MB (mismo tamaño que el archivo)
      expect(uploadedFile.exceedsMaxSize(maxSize)).toBe(false);
    });
  });
});

import { UploadedFile } from '@context/uploads/domain/entities/uploaded-file.entity';
import { InvalidFileException } from '@context/uploads/domain/exceptions/invalid-file.exception';
import { IFileRepository } from '@context/uploads/domain/repositories/file.repository.port';
import { IFileStorageService } from '@context/uploads/domain/services/file-storage.service.port';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadFileUseCase } from '../upload-file.usecase';

describe('UploadFileUseCase', () => {
  let useCase: UploadFileUseCase;
  let fileRepository: jest.Mocked<IFileRepository>;
  let fileStorageService: jest.Mocked<IFileStorageService>;

  const mockUploadedFile = new UploadedFile(
    'file-1',
    'test-image.jpg',
    'test-image_123456_uuid.jpg',
    'image/jpeg',
    1024,
    '/path/to/file.jpg',
    'http://localhost:3000/uploads/2023/10/test-image_123456_uuid.jpg',
    new Date('2023-01-01'),
  );

  const mockFile = {
    buffer: Buffer.from('fake image data'),
    originalname: 'test-image.jpg',
    mimetype: 'image/jpeg',
    size: 1024,
  };

  beforeEach(async () => {
    const mockFileRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByMimeType: jest.fn(),
      findImages: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const mockFileStorageService = {
      saveFile: jest.fn(),
      deleteFile: jest.fn(),
      fileExists: jest.fn(),
      generateUniqueFileName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadFileUseCase,
        { provide: 'FileRepositoryPort', useValue: mockFileRepository },
        { provide: 'FileStorageServicePort', useValue: mockFileStorageService },
      ],
    }).compile();

    useCase = module.get<UploadFileUseCase>(UploadFileUseCase);
    fileRepository = module.get('FileRepositoryPort');
    fileStorageService = module.get('FileStorageServicePort');
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería subir un archivo exitosamente', async () => {
    const savedFileInfo = {
      fileName: 'test-image_123456_uuid.jpg',
      path: '/path/to/file.jpg',
      url: 'http://localhost:3000/uploads/2023/10/test-image_123456_uuid.jpg',
    };

    fileStorageService.generateUniqueFileName.mockReturnValue('test-image_123456_uuid.jpg');
    fileStorageService.saveFile.mockResolvedValue(savedFileInfo);
    fileRepository.save.mockResolvedValue(mockUploadedFile);

    const result = await useCase.execute(mockFile);

    expect(fileStorageService.generateUniqueFileName).toHaveBeenCalledWith('test-image.jpg');
    expect(fileStorageService.saveFile).toHaveBeenCalledWith(
      mockFile.buffer,
      'test-image_123456_uuid.jpg',
      'image/jpeg',
    );
    expect(fileRepository.save).toHaveBeenCalledWith(
      'test-image.jpg',
      'test-image_123456_uuid.jpg',
      'image/jpeg',
      1024,
      '/path/to/file.jpg',
      'http://localhost:3000/uploads/2023/10/test-image_123456_uuid.jpg',
    );
    expect(result).toEqual(mockUploadedFile);
  });

  it('debería lanzar excepción si no se proporciona archivo', async () => {
    await expect(useCase.execute(null as any)).rejects.toThrow(InvalidFileException);
    expect(fileStorageService.saveFile).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si el archivo excede el tamaño máximo', async () => {
    const largeFile = { ...mockFile, size: 10 * 1024 * 1024 }; // 10MB
    const maxSize = 5 * 1024 * 1024; // 5MB

    await expect(useCase.execute(largeFile, maxSize)).rejects.toThrow(InvalidFileException);
    expect(fileStorageService.saveFile).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si el tipo de archivo no está permitido', async () => {
    const textFile = { ...mockFile, mimetype: 'text/plain' };

    await expect(useCase.execute(textFile)).rejects.toThrow(InvalidFileException);
    expect(fileStorageService.saveFile).not.toHaveBeenCalled();
  });

  it('debería lanzar excepción si el nombre del archivo está vacío', async () => {
    const fileWithoutName = { ...mockFile, originalname: '' };

    await expect(useCase.execute(fileWithoutName)).rejects.toThrow(InvalidFileException);
    expect(fileStorageService.saveFile).not.toHaveBeenCalled();
  });

  it('debería usar tipos permitidos personalizados', async () => {
    const pdfFile = { ...mockFile, mimetype: 'application/pdf' };
    const allowedTypes = ['application/pdf'];

    const savedFileInfo = {
      fileName: 'test-file_123456_uuid.pdf',
      path: '/path/to/file.pdf',
      url: 'http://localhost:3000/uploads/2023/10/test-file_123456_uuid.pdf',
    };

    fileStorageService.generateUniqueFileName.mockReturnValue('test-file_123456_uuid.pdf');
    fileStorageService.saveFile.mockResolvedValue(savedFileInfo);
    fileRepository.save.mockResolvedValue(mockUploadedFile);

    await useCase.execute(pdfFile, undefined, allowedTypes);

    expect(fileStorageService.saveFile).toHaveBeenCalled();
  });

  it('debería manejar errores del servicio de almacenamiento', async () => {
    fileStorageService.generateUniqueFileName.mockReturnValue('test-image_123456_uuid.jpg');
    fileStorageService.saveFile.mockRejectedValue(new Error('Error de almacenamiento'));

    await expect(useCase.execute(mockFile)).rejects.toThrow(InvalidFileException);
    expect(fileRepository.save).not.toHaveBeenCalled();
  });
});

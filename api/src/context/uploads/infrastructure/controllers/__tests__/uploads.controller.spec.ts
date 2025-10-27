import { DeleteFileUseCase } from '@context/uploads/application/use-cases/delete-file.usecase';
import { GetAllFilesUseCase } from '@context/uploads/application/use-cases/get-all-files.usecase';
import { GetFileUseCase } from '@context/uploads/application/use-cases/get-file.usecase';
import { UploadFileUseCase } from '@context/uploads/application/use-cases/upload-file.usecase';
import { UploadedFile } from '@context/uploads/domain/entities/uploaded-file.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadsController } from '../uploads.controller';

describe('UploadsController', () => {
  let controller: UploadsController;
  let uploadFileUseCase: jest.Mocked<UploadFileUseCase>;
  let getFileUseCase: jest.Mocked<GetFileUseCase>;
  let getAllFilesUseCase: jest.Mocked<GetAllFilesUseCase>;
  let deleteFileUseCase: jest.Mocked<DeleteFileUseCase>;

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

  const mockFiles = [mockUploadedFile];

  const mockMulterFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test-image.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('fake image data'),
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
  };

  beforeEach(async () => {
    const mockUploadFileUseCase = {
      execute: jest.fn(),
    };

    const mockGetFileUseCase = {
      execute: jest.fn(),
    };

    const mockGetAllFilesUseCase = {
      execute: jest.fn(),
    };

    const mockDeleteFileUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController],
      providers: [
        { provide: UploadFileUseCase, useValue: mockUploadFileUseCase },
        { provide: GetFileUseCase, useValue: mockGetFileUseCase },
        { provide: GetAllFilesUseCase, useValue: mockGetAllFilesUseCase },
        { provide: DeleteFileUseCase, useValue: mockDeleteFileUseCase },
      ],
    }).compile();

    controller = module.get<UploadsController>(UploadsController);
    uploadFileUseCase = module.get(UploadFileUseCase);
    getFileUseCase = module.get(GetFileUseCase);
    getAllFilesUseCase = module.get(GetAllFilesUseCase);
    deleteFileUseCase = module.get(DeleteFileUseCase);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('debería subir un archivo', async () => {
      uploadFileUseCase.execute.mockResolvedValue(mockUploadedFile);

      const result = await controller.uploadFile(mockMulterFile);

      expect(uploadFileUseCase.execute).toHaveBeenCalledWith(
        {
          buffer: mockMulterFile.buffer,
          originalname: mockMulterFile.originalname,
          mimetype: mockMulterFile.mimetype,
          size: mockMulterFile.size,
        },
        undefined,
        undefined,
      );
      expect(result).toEqual(mockUploadedFile);
    });

    it('debería subir un archivo con parámetros personalizados', async () => {
      uploadFileUseCase.execute.mockResolvedValue(mockUploadedFile);

      const result = await controller.uploadFile(
        mockMulterFile,
        '2048000', // 2MB
        'image/jpeg,image/png',
      );

      expect(uploadFileUseCase.execute).toHaveBeenCalledWith(
        {
          buffer: mockMulterFile.buffer,
          originalname: mockMulterFile.originalname,
          mimetype: mockMulterFile.mimetype,
          size: mockMulterFile.size,
        },
        2048000,
        ['image/jpeg', 'image/png'],
      );
      expect(result).toEqual(mockUploadedFile);
    });
  });

  describe('getAllFiles', () => {
    it('debería retornar todos los archivos', async () => {
      getAllFilesUseCase.execute.mockResolvedValue(mockFiles);

      const result = await controller.getAllFiles();

      expect(getAllFilesUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockFiles);
    });
  });

  describe('getFile', () => {
    it('debería retornar un archivo por ID', async () => {
      getFileUseCase.execute.mockResolvedValue(mockUploadedFile);

      const result = await controller.getFile('file-1');

      expect(getFileUseCase.execute).toHaveBeenCalledWith('file-1');
      expect(result).toEqual(mockUploadedFile);
    });
  });

  describe('deleteFile', () => {
    it('debería eliminar un archivo', async () => {
      deleteFileUseCase.execute.mockResolvedValue(undefined);

      await controller.deleteFile('file-1');

      expect(deleteFileUseCase.execute).toHaveBeenCalledWith('file-1');
    });
  });
});

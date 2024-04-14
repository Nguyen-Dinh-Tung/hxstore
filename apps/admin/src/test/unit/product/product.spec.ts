import { ProductController } from '../../../product/product.controller';
import { ProductService } from '../../../product/product.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CoreModule,
  FindAllProductDto,
  PageMetaDto,
  ProductDto,
  ProductEventEntity,
  ProductFindAllPaginateDto,
  ProductsEntity,
} from '@app/common';
import { Repository } from 'typeorm';
import {
  PositionRowEnum,
  PositionsScreenEnum,
  ProductEventTypes,
  ProductTypesEnum,
} from '@app/common/enum';
import { CreateProductDto } from 'apps/admin/src/product/dto/create-product.dto';
import { AppHttpBadRequest, FileErrors } from '@app/exceptions';
import * as fs from 'fs';
import { ConfigProductType } from '../../types/product.types';
import { ConfigPositionsEntity } from '@app/common/entities/config-positions.entity';

function fakeFile() {
  const filePath = './426545596_908524891071143_5538405799051611392_n.jpg';
  const readStream = fs.createReadStream(filePath);

  const imageObject = {
    file: readStream,
    filename: 'myImage.png',
    contentType: 'image/png',
  };

  return imageObject;
}
describe('Product ', () => {
  let productController;
  let productService;
  let productRepo;
  const productToken = getRepositoryToken(ProductsEntity);
  const mockProduct: ProductsEntity = {
    id: 1,
    name: 'First',
    type: ProductTypesEnum.STIMULATE,
    amount: BigInt(10),
    price: BigInt(1000000),
    totalSold: BigInt(1),
    origin: 'use',
    company: 'string',
    placeOfProduction: 'any',
    urlIMG: 'string',
    isActive: false,
    createdAt: new Date(),
  };
  const mockProductDto: CreateProductDto = {
    name: 'First',
    type: ProductTypesEnum.STIMULATE,
    amount: BigInt(10),
    price: BigInt(1000000),
    origin: 'use',
    company: 'string',
    placeOfProduction: 'any',
    urlIMG: 'string',
  };

  const successRes = {
    success: true,
  };

  // const mockSaveImage = jest.fn((file, path) => 'mocked-image-url');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CoreModule.forRoot()],
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();
    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
    productRepo = module.get<Repository<ProductsEntity>>(productToken);
  });

  it('Should defined ', () => {
    expect(productService).toBeDefined();
  });

  it('Should defined ', () => {
    expect(productRepo).toBeDefined();
  });

  it('Should find all', async () => {
    const query = new FindAllProductDto();
    const mockProducts: ProductsEntity[] = [mockProduct];
    const meta = new PageMetaDto({ ...query, total: mockProducts.length });

    const mockProductPaginate = new ProductFindAllPaginateDto(
      mockProducts.map((e) => new ProductDto(e)),
      meta,
    );

    jest
      .spyOn(productService, 'findAll')
      .mockResolvedValueOnce(mockProductPaginate);
    const result = await productService.findAll(query);
    expect(productService.findAll).toHaveBeenCalledWith(query);
    expect(result).toEqual(mockProductPaginate);
  });

  describe('Create product', () => {
    it('Should throw error missing file', async () => {
      expect(productService.create(mockProductDto)).rejects.toThrowError(
        new AppHttpBadRequest(FileErrors.ERROR_MISSING_FILE),
      );
    });

    it('Should create success', async () => {
      jest.spyOn(productService, 'create').mockResolvedValueOnce(successRes);

      const res = await productService.create(mockProductDto);
      expect(productService.create).toHaveBeenCalledWith(mockProductDto);
      expect(res).toEqual(successRes);
    });
  });

  describe('Update product', () => {
    // it('Should throw not found', async () => {
    //   jest.spyOn(productRepo, 'findOne').mockResolvedValueOnce(undefined);

    //   await expect(
    //     productService.findOneOrThrowNotFound({
    //       where: {
    //         id: 1,
    //       },
    //     }),
    //   ).rejects.toThrowError(
    //     new AppHttpBadRequest(ProductErrors.ERROR_PRODUCT_NOT_FOUND),
    //   );
    // });

    it('Should update success', async () => {
      jest.spyOn(productRepo, 'findOne').mockResolvedValueOnce(mockProduct);

      jest.spyOn(productService, 'update').mockResolvedValueOnce(successRes);

      const res = await productService.update(mockProduct);

      expect(productService.update).toHaveBeenCalledWith(mockProduct);
      expect(res).toEqual(successRes);
    });
  });

  describe('Get config product', () => {
    it('Should get config success', async () => {
      const mockProductConfig: ConfigProductType[] = [
        {
          id: BigInt(1),
          name: 'Fack',
          type: ProductTypesEnum.STIMULATE,
          amount: BigInt(10),
          price: BigInt(10000000),
          totalSold: 1,
          urlIMG: 'Image url',
          isActive: true,
          createdAt: new Date(),
          configId: BigInt(1),
          configIsActive: true,
          positionsScreen: PositionsScreenEnum.BODY,
          positionsRow: PositionRowEnum.ONE,
          eventCreatedAt: new Date(),
          eventName: 'Big sales',
          eventType: ProductEventTypes.SALE,
          saleRate: 10,
          startDate: new Date(),
          endDate: new Date(),
          eventIsActive: true,
        },
      ];

      const mockSelect = [
        'product.id as id ',
        'product.name as name ',
        'product.type as type ',
        'product.amount as amount ',
        'product.price as price ',
        'product.total_sold as totalSold ',
        'product.url_img as urlIMG ',
        'product.is_active as isActive ',
        'product.created_at as createdAt ',
        'config.id as configId ',
        'config.is_active as configIsActive ',
        'config.positions_screen as positionsScreen ',
        'config.positions_row as positionsRow ',
        'event.created_at as eventCreatedAt ',
        'event.name as eventName ',
        'event.type as eventType ',
        'event.saleRate as saleRate ',
        'event.startDate as startDate ',
        'event.endDate as endDate ',
        'event.isActive as eventIsActive ',
      ];

      const mockQueryBuilder = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce(mockProductConfig),
      };
      jest
        .spyOn(productService.productRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await productService.getConfigProduct();
      expect(mockQueryBuilder.leftJoin).toBeCalledTimes(2);
      expect(mockQueryBuilder.leftJoin).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
        'config',
        'config.product_id = product.id',
      );
      expect(mockQueryBuilder.leftJoin).toHaveBeenNthCalledWith(
        2,
        expect.any(Function),
        'event',
        'event.product_id = product.id',
      );
      expect(mockQueryBuilder.select).toBeCalledTimes(1);
      expect(mockQueryBuilder.select).toBeCalledWith(mockSelect);
      expect(mockQueryBuilder.where).toBeCalledTimes(1);
      expect(mockQueryBuilder.getRawMany).toBeCalledTimes(1);
    });
  });
});

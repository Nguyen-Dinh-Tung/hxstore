import {
  PositionRowEnum,
  PositionsScreenEnum,
  ProductEventTypes,
  ProductTypesEnum,
} from '@app/common/enum';

export type ConfigProductType = {
  id: bigint;
  name: string;
  type: ProductTypesEnum;
  amount: bigint;
  price: bigint;
  totalSold: number;
  urlIMG: string;
  isActive: boolean;
  createdAt: Date;
  configId: bigint;
  configIsActive: boolean;
  positionsScreen: PositionsScreenEnum;
  positionsRow: PositionRowEnum;
  eventCreatedAt: Date;
  eventName: string;
  eventType: ProductEventTypes;
  saleRate: number;
  startDate: Date;
  endDate: Date;
  eventIsActive: boolean;
};

const mockConfigProduct = {
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
};

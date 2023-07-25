import DeliveryOrder from './delivery-order.entity'
import ParcelType from '../enum/parcel-type.enum'
import Money from '../value-object/money.value-object'

jest.mock('../discount-manager/delivery-service-provider/delivery-service-provider-manager')
const deliveryServiceProviderMock = require('../discount-manager/delivery-service-provider/delivery-service-provider-manager')

const mockServicePrice = Money.create(1)

const mockDeliveryServiceProvider = {
  getServiceOrThrow: jest.fn(() => ({
    price: mockServicePrice
  }))
}

deliveryServiceProviderMock.default.mockImplementation(() => ({
  getProviderByIdOrThrow: jest.fn(() => mockDeliveryServiceProvider),
}))

const mockId = 123
const mockDateString = '2015-02-02'
const mockSize = ParcelType.S
const mockProvider = 'MR'

const mockValidDataString = `${mockDateString} ${mockSize} ${mockProvider}`

describe('DeliveryOrder', () => {
  describe('createFromDataString()', () => {
    it('should create DeliveryOrder entity from a valid data string', () => {
      const result = DeliveryOrder.createFromDataString(mockId, mockValidDataString)

      expect(result).toMatchObject({
        '_id': mockId,
        '_date': new Date(mockDateString),
        '_size': mockSize,
        '_provider': mockDeliveryServiceProvider,
        '_isValid': true,
        '_dataString': mockValidDataString,
        '_discount': Money.create(0)
      })
    })
  })

  it('should create invalid DeliveryOrder entity from an invalid data string', () => {
    const mockInvalidDataString = '2015-02-29 CUSPS'

    const result = DeliveryOrder.createFromDataString(mockId, mockInvalidDataString)

    expect(result).toMatchObject({
      '_id': mockId,
      '_date': undefined,
      '_size': undefined,
      '_provider': undefined,
      '_isValid': false,
      '_dataString': mockInvalidDataString
    })
  })

  describe('discount', () => {
    it('should throw if provided discount is more than the price of service', () => {
      const mockDeliveryOrder = DeliveryOrder.createFromDataString(mockId, mockValidDataString)

      expect(() => mockDeliveryOrder.discount = mockServicePrice.add(Money.create(0.01)))
        .toThrow('discount cannot be greater than the service price')
    })
  })
})
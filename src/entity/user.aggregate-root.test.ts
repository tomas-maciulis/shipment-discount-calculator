import User from './user.aggregate-root'
import DeliveryOrder from './delivery-order.entity'
import Money from '../value-object/money.value-object'

jest.mock('../util/read-shipment-data-from-file.util')
const readShipmentDataFromFileMock = require('../util/read-shipment-data-from-file.util')

jest.mock('./delivery-order.entity')
const deliveryOrderMock = require('./delivery-order.entity')

const mockValidDeliveryOrderString = '2015-02-24 L LP'
const mockInvalidDeliveryOrderString = '2015-02-29 CUSPS'

const mockDeliveryOrderStrings = [
  mockValidDeliveryOrderString,
  mockValidDeliveryOrderString,
  mockInvalidDeliveryOrderString,
]

readShipmentDataFromFileMock.default.mockImplementation(() => mockDeliveryOrderStrings)

describe('User', () => {
  describe('addDeliveryOrdersFromDataFile()', () => {
    it('should add delivery orders from a file', () => {
      deliveryOrderMock.default.createFromDataString.mockImplementation((id: number, dataString: string) => ({
        id, dataString
      }))

      const spy = jest.spyOn(DeliveryOrder, 'createFromDataString')

      const user = new User()

      user.addDeliveryOrdersFromDataFile('mock')

      expect(spy).toBeCalledTimes(3)

      expect(user).toMatchObject({
        _deliveryOrders: [
          {id: 0, dataString: mockDeliveryOrderStrings[0]},
          {id: 1, dataString: mockDeliveryOrderStrings[1]},
          {id: 2, dataString: mockDeliveryOrderStrings[2]},
        ]
      })
    })
  })

  describe('deliveryOrdersAsString', () => {
    it('should return delivery orders as string', () => {
      const mockPrice = Money.create(2)
      const mockDiscount = Money.create(1)

      deliveryOrderMock.default.createFromDataString.mockImplementationOnce(() => ({
        dataString: mockValidDeliveryOrderString,
        isValid: true,
        discount: mockDiscount,
        price: mockPrice,
      }))

      deliveryOrderMock.default.createFromDataString.mockImplementationOnce(() => ({
        dataString: mockValidDeliveryOrderString,
        isValid: true,
        discount: Money.create(0),
        price: mockPrice,
      }))

      deliveryOrderMock.default.createFromDataString.mockImplementationOnce(() => ({
        isValid: false,
        dataString: mockInvalidDeliveryOrderString
      }))

      const user = new User()

      user.addDeliveryOrdersFromDataFile('mock')

      expect(user.deliveryOrdersAsString).toEqual(
        `${mockDeliveryOrderStrings[0]} ${mockPrice.subtract(mockDiscount).amountString} ${mockDiscount.amountString}\n`
        + `${mockDeliveryOrderStrings[1]} ${mockPrice.amountString} -\n`
        + `${mockDeliveryOrderStrings[2]} Ignored\n`
      )
    })
  })

  describe('validDeliveryOrders', () => {
    it('should return only valid delivery orders', () => {
      deliveryOrderMock.default.createFromDataString.mockImplementationOnce(() => ({
        isValid: true
      }))

      deliveryOrderMock.default.createFromDataString.mockImplementationOnce(() => ({
        isValid: true
      }))

      deliveryOrderMock.default.createFromDataString.mockImplementationOnce(() => ({
        isValid: false
      }))

      const user = new User()

      user.addDeliveryOrdersFromDataFile('mock')

      expect(user.validDeliveryOrders).toEqual([
        {isValid: true},
        {isValid: true},
      ])
    })
  })
})
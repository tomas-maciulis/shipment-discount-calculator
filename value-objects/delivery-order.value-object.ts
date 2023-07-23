import ParcelType from '../enums/parcel-type.enum'
import DeliveryServiceProvider from '../enums/delivery-service-provider.enum'
import DeliveryServiceProviderManager
  from '../discount-manager/delivery-service-provider/delivery-service-provider-manager'
import DeliveryServiceProviderBase from '../base/delivery-service-provider.base'
import Money from './money.value-object'

export default class DeliveryOrder {
  private readonly _isValid: boolean

  private readonly _dataString: string

  private readonly _id: number

  private readonly _date: Date

  private readonly _size: ParcelType

  private readonly _provider: DeliveryServiceProviderBase

  private _deliveryServiceProviderManager: DeliveryServiceProviderManager

  private _discount = Money.create(0)

  constructor(
    id: number,
    isValid: boolean,
    dataString: string,
    date?: Date,
    size?: ParcelType,
    provider?: keyof typeof DeliveryServiceProvider,
  ) {
    this._deliveryServiceProviderManager = new DeliveryServiceProviderManager()

    this._id = id
    this._provider = provider ? this._deliveryServiceProviderManager.getProviderByIdOrThrow(provider) : undefined
    this._dataString = dataString
    this._size = size
    this._date = date
    this._isValid = isValid
  }

  set discount(value: Money) {
    if (value.greaterThan(this.price)) {
      throw new Error('discount cannot be greater than the service price')
    }

    this._discount = value
  }

  get discount() {
    return this._discount
  }

  get id() {
    return this._id
  }

  get dataString() {
    return this._dataString
  }

  get date() {
    return Object.freeze(this._date)
  }

  get size() {
    return this._size
  }

  get provider() {
    return this._provider
  }

  get price() {
    return this._provider.getServiceOrThrow(this._size).price
  }

  get isValid() {
    return this._isValid
  }

  static createFromDataString(id: number, dataString: string) {
    const entries = dataString.split(' ')

    const date = entries[0]
    const size = entries[1] as ParcelType
    const provider = entries[2] as keyof typeof DeliveryServiceProvider

    let isValid = true

    if (isNaN(new Date(date).valueOf())) {
      isValid = false
    }

    if (!Object.values(ParcelType).includes(size as any)) {
      isValid = false
    }

    if (!Object.keys(DeliveryServiceProvider).includes(provider as keyof typeof DeliveryServiceProvider)) {
      isValid = false
    }

    if (!isValid) {
      return new DeliveryOrder(id, isValid, dataString)
    }

    return new DeliveryOrder(id, isValid, dataString, new Date(date), size, provider)
  }
}
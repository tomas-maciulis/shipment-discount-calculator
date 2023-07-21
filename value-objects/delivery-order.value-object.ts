import ParcelType from '../enums/parcel-type.enum'
import DeliveryServiceProvider from '../enums/delivery-service-provider.enum'
import DeliveryServiceProviderManager
  from '../discount-manager/delivery-service-provider/delivery-service-provider-manager'
import DeliveryServiceProviderBase from '../base/delivery-service-provider.base'
import Money from './money.value-object'

export default class DeliveryOrder {
  private readonly _isValid: boolean

  private _date: Date

  private _size: ParcelType

  private _provider: DeliveryServiceProviderBase

  private _deliveryServiceProviderManager: DeliveryServiceProviderManager

  private _discount: Money

  constructor(private _data: string) {
    this._deliveryServiceProviderManager = new DeliveryServiceProviderManager()

    this._isValid = this.validateData()

    if (this._isValid) {
      this.setData()
    }
  }

  private validateData() {
    const {date, size, provider} = this.getFields()

    if (isNaN(new Date(date).valueOf())) {
      return false
    }

    if (!Object.values(ParcelType).includes(size as any)) {
      return false
    }

    if (!Object.values(DeliveryServiceProvider).includes(provider as any)) {
      return false
    }

    return true
  }

  private setData() {
    const {date, size, provider} = this.getFields()

    this._date = new Date(date)
    this._size = size as ParcelType
    this._provider = this._deliveryServiceProviderManager.getProviderByNameOrThrow(provider as DeliveryServiceProvider)
  }

  private getFields() {
    const entries = this._data.split(' ')

    const [date, size, provider] = entries

    return {date, size, provider}
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

  get data() {
    return this._data
  }

  get date() {
    return this._date
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
}
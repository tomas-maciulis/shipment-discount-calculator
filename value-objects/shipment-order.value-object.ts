import {ParcelType} from '../enums/parcel-type.enum'
import {DeliverServiceProvider} from '../enums/delivery-service-provider.enum'

export default class ShipmentOrder {
  private readonly _isValid: boolean

  private _date: Date

  private _size: Parcel

  private _provider: DeliverServiceProvider

  constructor(private _data: string) {
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

    if (!Object.values(Parcel).includes(size as any)) {
      return false
    }

    if (!Object.values(DeliverServiceProvider).includes(provider as any)) {
      return false
    }

    return true
  }

  private setData() {
    const {date, size, provider} = this.getFields()

    this._date = new Date(date)
    this._size = size as Parcel
    this._provider = provider as DeliverServiceProvider
  }

  private getFields() {
    const entries = this._data.split(' ')

    const [date, size, provider] = entries

    return {date, size, provider}
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

  get isValid() {
    return this._isValid
  }
}
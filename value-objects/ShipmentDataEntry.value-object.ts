import {ShipmentSize} from '../enums/ShipmentSize.enum'
import {ShipmentProvider} from '../enums/ShipmentProvider.enum'

export default class ShipmentDataEntryValueObject {
  private readonly _isValid: boolean

  private _date: Date

  private _size: ShipmentSize

  private _provider: ShipmentProvider

  constructor(private _data: string) {
    this._isValid = this.validateData()

    if (this._isValid) {
      this.setData()
    }
  }

  private validateData() {
    const { date, size, provider } = this.getFields()

    if (isNaN(new Date(date).valueOf())) {
      return false
    }

    if (!Object.values(ShipmentSize).includes(size as ShipmentSize)) {
      return false
    }

    if (!Object.values(ShipmentProvider).includes(provider as ShipmentProvider)) {
      return false
    }

    return true
  }

  private setData() {
    const { date, size, provider } = this.getFields()

    this._date = new Date(date)
    this._size = size as ShipmentSize
    this._provider = provider as ShipmentProvider
  }

  private getFields() {
    const entries = this._data.split(' ')

    const [date, size, provider] = entries

    return { date, size, provider }
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
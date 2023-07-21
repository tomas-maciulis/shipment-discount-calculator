import Money from './money.value-object'
import ParcelType from '../enums/parcel-type.enum'

export default class DeliveryService {
  constructor(
    private readonly _parcelType: ParcelType,
    private readonly _price: Money,
  ) {
  }

  get parcelType() {
    return this._parcelType
  }

  get price() {
    return this._price
  }
}
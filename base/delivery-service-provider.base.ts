import DeliveryService from '../value-objects/delivery-service.value-object'
import DeliveryServiceProvider from '../enums/delivery-service-provider.enum'
import ParcelType from '../enums/parcel-type.enum'
import Money from '../value-objects/money.value-object'

export default abstract class DeliveryServiceProviderBase {
  protected _services: DeliveryService[]

  protected abstract _name: DeliveryServiceProvider

  protected registerService(service: ParcelType, price: Money) {
    this._services.push(new DeliveryService(service, price))
  }

  get name() {
    return this._name
  }

  getServiceOrThrow(service: ParcelType) {
    const result = this._services.find((s) => s.parcelType === service)

    if (!result) {
      throw new Error(`${this._name} does not have service called "${service}"`)
    }

    return result
  }
}
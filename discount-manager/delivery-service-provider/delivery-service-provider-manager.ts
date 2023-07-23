import DeliveryServiceProviderBase from '../../base/delivery-service-provider.base'
import LaPoste from './la-poste'
import MondialRelay from './mondial-relay'
import DeliveryServiceProvider from '../../enums/delivery-service-provider.enum'

export default class DeliveryServiceProviderManager {
  private _deliveryServiceProviders: DeliveryServiceProviderBase[] = []

  constructor() {
    this.registerProvider(new LaPoste())
    this.registerProvider(new MondialRelay())
  }

  private registerProvider(provider: DeliveryServiceProviderBase) {
    this._deliveryServiceProviders.push(provider)
  }

  get deliveryServiceProviders() {
    return Object.freeze(this._deliveryServiceProviders)
  }

  getProviderByNameOrThrow(name: DeliveryServiceProvider) {
    const result = this._deliveryServiceProviders.find((d) => d.name === name)

    if (!result) {
      throw new Error(`provider with name ${name} is not registered`)
    }

    return result
  }

  getProviderByIdOrThrow(id: keyof typeof DeliveryServiceProvider) {
    const deliveryServiceProviderName = DeliveryServiceProvider[id]

    return this.getProviderByNameOrThrow(deliveryServiceProviderName)
  }
}
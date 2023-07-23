import DiscountRuleBase from '../../base/discount-rule.base'
import ParcelType from '../../enums/parcel-type.enum'
import DeliveryServiceProvider from '../../enums/delivery-service-provider.enum'
import DeliveryOrder from '../../value-objects/delivery-order.value-object'
import Money from '../../value-objects/money.value-object'
import ServiceClient from '../../value-objects/service-client.value-object'

export default class LowestSmallPackagePrice extends DiscountRuleBase {
  protected _applicableParcelTypes = [ParcelType.S]

  protected _applicableProviders: DeliveryServiceProvider[] = Object.values(DeliveryServiceProvider)

  protected applyRule(serviceClient: ServiceClient, deliveryOrder: DeliveryOrder): Money {
    const servicePrice = deliveryOrder.price

    let discount = Money.create(0)

    for (const provider of this._deliveryServiceProviderManager.deliveryServiceProviders) {
      const providerService = provider.getServiceOrThrow(deliveryOrder.size)

      if (!servicePrice.greaterThan(providerService.price)) {
        continue
      }

      const priceDifference = Money.subtract(servicePrice, providerService.price)

      if (priceDifference.greaterThan(discount)) {
        discount = priceDifference
      }
    }

    return discount
  }
}
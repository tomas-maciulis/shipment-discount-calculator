import DiscountRuleBase from '../../base/discount-rule.base'
import ParcelType from '../../enum/parcel-type.enum'
import DeliveryServiceProvider from '../../enum/delivery-service-provider.enum'
import DeliveryOrder from '../../entity/delivery-order.entity'
import Money from '../../value-object/money.value-object'
import ServiceClient from '../../entity/service-client.entity'

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

      const priceDifference = servicePrice.subtract(providerService.price)

      if (priceDifference.greaterThan(discount)) {
        discount = priceDifference
      }
    }

    return discount
  }
}
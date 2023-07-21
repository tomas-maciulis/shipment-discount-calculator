import DiscountRuleBase from '../../base/discount-rule.base'
import ParcelType from '../../enums/parcel-type.enum'
import DeliveryServiceProvider from '../../enums/delivery-service-provider.enum'
import DeliveryOrder from '../../value-objects/delivery-order.value-object'
import Money from '../../value-objects/money.value-object'

export default class LowestSmallPackagePrice extends DiscountRuleBase {
  protected _applicableParcelType = ParcelType.S

  protected _applicableProviders: DeliveryServiceProvider[]

  constructor() {
    super()

    for (const provider of Object.values(DeliveryServiceProvider)) {
      this.addApplicableProvider(provider)
    }
  }

  calculateDiscount(deliveryOrder: DeliveryOrder): Money {
    if (!this.isProviderEligible(deliveryOrder.provider.name)) {
      return Money.create(0)
    }

    const servicePrice = deliveryOrder.provider.getServiceOrThrow(this._applicableParcelType).price

    let discount = Money.create(0)

    for (const provider of this._deliveryServiceProviderManager.deliveryServiceProviders) {
      const providerService = provider.getServiceOrThrow(this._applicableParcelType)

      if (!providerService.price.greaterThan(servicePrice)) {
        return
      }

      const priceDifference = Money.subtract(servicePrice, providerService.price)

      if (priceDifference.greaterThan(discount)) {
        discount = priceDifference
      }
    }

    return discount
  }
}
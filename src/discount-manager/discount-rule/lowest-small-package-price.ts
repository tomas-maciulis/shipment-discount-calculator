import DiscountRuleBase, {RuleParams} from '../../base/discount-rule.base'
import ParcelType from '../../enum/parcel-type.enum'
import DeliveryServiceProvider from '../../enum/delivery-service-provider.enum'
import Money from '../../value-object/money.value-object'

export default class LowestSmallPackagePrice extends DiscountRuleBase {
  protected _applicableParcelTypes = [ParcelType.S]

  protected _applicableProviders: DeliveryServiceProvider[] = Object.values(DeliveryServiceProvider)

  protected applyRule(params: RuleParams): Money {
    const {deliveryOrder} = params

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
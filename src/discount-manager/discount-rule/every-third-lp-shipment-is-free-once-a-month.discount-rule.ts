import DiscountRuleBase, {RuleParams} from '../../base/discount-rule.base'
import ParcelType from '../../enum/parcel-type.enum'
import DeliveryServiceProvider from '../../enum/delivery-service-provider.enum'
import Money from '../../value-object/money.value-object'

export default class EveryThirdLpShipmentIsFreeOnceAMonthDiscountRule extends DiscountRuleBase {
  protected _applicableParcelTypes = [ParcelType.L]

  protected _applicableProviders = [DeliveryServiceProvider.LP]

  protected applyRule(params: RuleParams) {
    const {serviceClient, deliveryOrder} = params

    let discount = Money.create(0)

    const largeLpOrdersForTheSameMonth = serviceClient.validDeliveryOrders.filter((o) =>
      this._applicableProviders.includes(o.provider.name)
      && this._applicableParcelTypes.includes(o.size)
      && o.date.getMonth() === deliveryOrder.date.getMonth()
      && o.date.getFullYear() === deliveryOrder.date.getFullYear()
    )

    if (largeLpOrdersForTheSameMonth.length < 3) {
      return discount
    }

    if (largeLpOrdersForTheSameMonth.find((l) => l.discount.greaterThan(Money.create(0)))) {
      return discount
    }

    if (deliveryOrder.id === largeLpOrdersForTheSameMonth[2].id) {
      discount = deliveryOrder.price
    }

    return discount
  }
}
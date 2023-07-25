import DiscountRuleBase from '../../base/discount-rule.base'
import ParcelType from '../../enum/parcel-type.enum'
import DeliveryOrder from '../../entity/delivery-order.entity'
import DeliveryServiceProvider from '../../enum/delivery-service-provider.enum'
import ServiceClient from '../../entity/service-client.entity'
import Money from '../../value-object/money.value-object'

export default class EveryThirdLpShipmentIsFreeOnceAMonth extends DiscountRuleBase {
  protected _applicableParcelTypes = [ParcelType.L]

  protected _applicableProviders = [DeliveryServiceProvider.LP]

  protected applyRule(serviceClient: ServiceClient, deliveryOrder: DeliveryOrder) {
    let discount = Money.create(0)

    // todo: maybe add this as a utility for ServiceClient
    const largeLpOrdersForTheSameMonth = serviceClient.validDeliveryOrders.filter((o) =>
      this._applicableProviders.includes(o.provider.name)
      && this._applicableParcelTypes.includes(o.size)
      && o.date.getMonth() === deliveryOrder.date.getMonth()
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
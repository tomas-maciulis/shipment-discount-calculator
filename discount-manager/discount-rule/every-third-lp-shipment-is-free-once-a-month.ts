import DiscountRuleBase from '../../base/discount-rule.base'
import ParcelType from '../../enums/parcel-type.enum'
import DeliveryOrder from '../../value-objects/delivery-order.value-object'
import DeliveryServiceProvider from '../../enums/delivery-service-provider.enum'
import ServiceClient from '../../value-objects/service-client.value-object'
import Money from '../../value-objects/money.value-object'

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
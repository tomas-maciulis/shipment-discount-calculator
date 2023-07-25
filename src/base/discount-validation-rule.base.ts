import Money from '../value-object/money.value-object'
import ServiceClient from '../entity/service-client.entity'
import DeliveryOrder from '../entity/delivery-order.entity'

export abstract class DiscountValidationRuleBase {
  abstract validate(serviceClient: ServiceClient, deliveryOrder: DeliveryOrder, discount: Money): Money
}
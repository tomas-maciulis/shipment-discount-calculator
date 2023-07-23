import Money from '../value-objects/money.value-object'
import ServiceClient from '../value-objects/service-client.value-object'
import DeliveryOrder from '../value-objects/delivery-order.value-object'

export abstract class DiscountValidationRuleBase {
  abstract validate(serviceClient: ServiceClient, deliveryOrder: DeliveryOrder, discount: Money): Money
}
import DeliveryOrder from './delivery-order.value-object'

export default class ServiceClient {
  constructor(readonly deliveryOrders: DeliveryOrder[]) {
  }
}
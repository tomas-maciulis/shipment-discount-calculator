import ShipmentOrder from './shipment-order.value-object'

export default class ServiceClient {
  constructor(readonly shipmentOrders: ShipmentOrder[]) {
  }
}
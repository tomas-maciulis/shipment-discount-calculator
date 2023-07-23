import DeliveryOrder from './delivery-order.value-object'
import getLinesOfDataFromFile from '../utils/read-shipment-data-from-file.util'

export default class ServiceClient {
  private readonly _deliveryOrders: DeliveryOrder[] = []

  addDeliveryOrdersFromDataFile(fileDir: string) {
    const fileContentLines = getLinesOfDataFromFile(fileDir)

    const currentId = this._deliveryOrders.length

    for (let i = 0; i < fileContentLines.length; i++) {
      const id = currentId + i

      this._deliveryOrders.push(DeliveryOrder.createFromDataString(id, fileContentLines[i]))
    }
  }

  get deliveryOrders() {
    return Object.freeze(this._deliveryOrders)
  }

  get validDeliveryOrders() {
    return this._deliveryOrders.filter((d) => d.isValid)
  }
}
import DeliveryOrder from './delivery-order.entity'
import getLinesOfDataFromFile from '../util/read-shipment-data-from-file.util'
import Money from '../value-object/money.value-object'

export default class User {
  private readonly _deliveryOrders: DeliveryOrder[] = []

  addDeliveryOrdersFromDataFile(fileDir: string) {
    const fileContentLines = getLinesOfDataFromFile(fileDir)

    const currentId = this._deliveryOrders.length

    for (let i = 0; i < fileContentLines.length; i++) {
      const id = currentId + i

      this._deliveryOrders.push(DeliveryOrder.createFromDataString(id, fileContentLines[i]))
    }
  }

  get deliveryOrdersAsString() {
    let result = ''

    for (const order of this._deliveryOrders) {
      if (order.isValid) {
        const discount = order.discount.equalTo(Money.create(0)) ? '-' : order.discount.amountString

        result += `${order.dataString} ${order.price.subtract(order.discount).amountString} ${discount}\n`
      } else {
        result += `${order.dataString} Ignored\n`
      }
    }

    return result
  }

  get validDeliveryOrders() {
    return this._deliveryOrders.filter((d) => d.isValid)
  }
}
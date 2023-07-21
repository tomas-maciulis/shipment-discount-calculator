import DeliveryOrder from '../value-objects/delivery-order.value-object'
import fs from 'fs'

const readShipmentDataFromFile = (fileDir = 'input.txt') => {
  const data = fs.readFileSync(fileDir, 'utf-8')

  const dataEntries = []

  for (const line of data.split('\n')) {
    dataEntries.push(new DeliveryOrder(line))
  }

  return dataEntries
}

export default readShipmentDataFromFile
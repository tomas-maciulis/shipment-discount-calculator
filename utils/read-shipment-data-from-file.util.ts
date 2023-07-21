import ShipmentOrder from '../value-objects/shipment-order.value-object'
import fs from 'fs'

const readShipmentDataFromFile = (fileDir = 'input.txt') => {
  const data = fs.readFileSync(fileDir, 'utf-8')

  const dataEntries = []

  for (const line of data.split('\n')) {
    dataEntries.push(new ShipmentOrder(line))
  }

  return dataEntries
}

export default readShipmentDataFromFile
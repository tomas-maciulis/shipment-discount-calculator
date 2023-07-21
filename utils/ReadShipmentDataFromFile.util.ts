import ShipmentDataEntryValueObject from '../value-objects/ShipmentDataEntry.value-object'
import fs from 'fs'

const readShipmentDataFromFile = (fileDir: string):ShipmentDataEntryValueObject[] => {
  const data = fs.readFileSync(fileDir, 'utf-8')

  const dataEntries = []

  for (const line of data.split('\n')) {
    dataEntries.push(new ShipmentDataEntryValueObject(line))
  }

  return dataEntries
}

export default readShipmentDataFromFile
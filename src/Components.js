//This file hosts miscellaneous custom functions and objects used in this project

export const stateObj = (accessor,originalMin, originalMax, currentMin, currentMax) => { return { accessor: accessor, originalMin: originalMin, originalMax: originalMax, currentMin: currentMin, currentMax: currentMax } }

export function getMax(thisData, thisID) {
    ////console.log(thisData)
    let max = thisData.length ? thisData[0][thisID] : 0
    thisData.forEach(row => {
      max = Math.max(row[thisID], max)
    })
    ////console.log("this accessor ", thisID, " , this max: ",max)
    return max
}
export function getMin(thisData, thisID) {
  ////console.log(thisData)
  let min = thisData.length ? thisData[0][thisID] : 0
  thisData.forEach(row => {
    min = Math.min(row[thisID], min)
  })
  ////console.log("this accessor ", thisID, " , this min: ",min)
  return min
}

export function addCommas(num) {
  //console.log("data: ", num.cell.value.toLocaleString())
  //const strLoop = num.toString()
  return num.cell.value.toLocaleString()
}

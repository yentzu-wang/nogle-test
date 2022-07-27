import React from "react"
import numeral from "numeral"
import useOrderbook from "../hooks/useOrderbook"

const Asks = ({ asks, displayCount, currentPrice }) => {
  const { parsedOrders, dict } = useOrderbook(
    asks,
    currentPrice,
    displayCount,
    "ask"
  )
  let count = 0

  const displayData = parsedOrders
    .map(ask => {
      if (!dict[ask.price]) {
        return ask
      } else {
        return [ask.price, dict[ask.price]]
      }
    })
    .filter(([, size]) => size !== 0)
    .slice(-8)
    .reverse()
    .map(([price, size]) => {
      count += size

      return [price, size, count]
    })
    .reverse()

  return (
    <>
      {displayData.map(([price, size, total], index) => (
        <tr key={index}>
          <td style={{ textAlign: "left" }}>
            {numeral(price).format("0,0.0")}
          </td>
          <td style={{ textAlign: "right" }}>{numeral(size).format("0,0")}</td>
          <td style={{ textAlign: "right" }}>{numeral(total).format("0,0")}</td>
        </tr>
      ))}
    </>
  )
}

export default Asks

import React from "react"
import numeral from "numeral"
import useOrderbook from "../hooks/useOrderbook"

const Bids = ({ bids, displayCount, currentPrice }) => {
  const { parsedOrders, dict } = useOrderbook(
    bids,
    currentPrice,
    displayCount,
    "bid"
  )
  let count = 0

  const displayData = parsedOrders
    .map(bid => {
      if (!dict[bid.price]) {
        return bid
      } else {
        return [bid.price, dict[bid.price]]
      }
    })
    .filter(([, size]) => size !== 0)
    .slice(0, 8)
    .map(([price, size]) => {
      count += size

      return [price, size, count]
    })

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

export default Bids

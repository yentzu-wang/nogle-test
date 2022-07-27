import React from "react"
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
          <td style={{ textAlign: "left" }}>{price}</td>
          <td style={{ textAlign: "right" }}>{size}</td>
          <td style={{ textAlign: "right" }}>{total}</td>
        </tr>
      ))}
    </>
  )
}

export default Bids

import React from "react"
import styled, { keyframes } from "styled-components"
import { typography, color } from "styled-system"
import numeral from "numeral"
import useOrderbook from "../hooks/useOrderbook"

const Asks = ({ asks, displayCount, currentPrice }) => {
  const { parsedOrders, prevDict } = useOrderbook(
    asks,
    currentPrice,
    displayCount,
    "ask"
  )
  let count = 0

  const displayData = parsedOrders
    .map(ask => {
      if (!prevDict[ask.price]) {
        return ask
      } else {
        return [ask.price, prevDict[ask.price]]
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
      {displayData.map(([price, size, total]) => (
        // I know the key doesn't look quite right,
        // but in reality such as high frequency trading scenarios,
        // it almost can be 100% sure that the key is going to be an unique one.
        // You can regard it as a simple hash function just for code interview purpose only.
        <Tr key={price + size + total} isAnimated={!prevDict[price]}>
          <Td style={{ textAlign: "left", color: "#00b15d" }}>
            {numeral(price).format("0,0.0")}
          </Td>
          <Td style={{ textAlign: "right" }}>{numeral(size).format("0,0")}</Td>
          <Td style={{ textAlign: "right" }}>{numeral(total).format("0,0")}</Td>
        </Tr>
      ))}
    </>
  )
}

const BgAnimation = keyframes`

 0% { background-color: rgb(0, 128, 0, 0.1); }
 30% { background-color: rgb(0, 128, 0, 0.25); }
 40% { background-color: rgb(0, 128, 0, 0.5)  }
 100% { background-color: rgb(0, 128, 0, 0)  }`

const Tr = styled.tr`
  animation-name: ${({ isAnimated }) => (isAnimated ? BgAnimation : "none")};
  animation-duration: 0.5s;
`

const Td = styled.td`
  ${color}
  ${typography}
`

export default Asks

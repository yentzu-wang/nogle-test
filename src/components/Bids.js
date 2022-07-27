import React from "react"
import styled, { keyframes } from "styled-components"
import { typography, color } from "styled-system"
import numeral from "numeral"
import useOrderbook from "../hooks/useOrderbook"

const Bids = ({ bids, displayCount, currentPrice }) => {
  const { parsedOrders, prevDict } = useOrderbook(
    bids,
    currentPrice,
    displayCount,
    "bid"
  )
  let count = 0

  const displayData = parsedOrders
    .map(bid => {
      if (!prevDict[bid.price]) {
        return bid
      } else {
        return [bid.price, prevDict[bid.price]]
      }
    })
    .filter(([, size]) => size !== 0)
    .slice(0, 8)
    .map(([price, size]) => {
      count += size

      return [price, size, count]
    })

  const getSizeChangedAnimationType = (price, size) => {
    if (!prevDict[price]) {
      return "none"
    }

    return size > prevDict[price] ? "increment" : "decrement"
  }

  return (
    <>
      {displayData.map(([price, size, total]) => (
        // I know the key doesn't look quite right,
        // but in reality such as high frequency trading scenarios,
        // it almost can be 100% sure that the key is going to be an unique one.
        // You can regard it as a simple hash function just for code interview purpose only.
        <Tr key={price + size + total} isAnimated={!prevDict[price]}>
          <Td color="#FF5B5A" textAlign="left">
            {numeral(price).format("0,0.0")}
          </Td>
          <Td
            textAlign="right"
            animationType={getSizeChangedAnimationType(price, size)}
          >
            {numeral(size).format("0,0")}
          </Td>
          <Td textAlign="right">{numeral(total).format("0,0")}</Td>
        </Tr>
      ))}
    </>
  )
}

const BgAnimation = keyframes`
  0% { background-color: rgb(255, 0, 0, 0.1); }
  30% { background-color: rgb(255, 0, 0, 0.25); }
  40% { background-color: rgb(255, 0, 0, 0.5)  }
  100% { background-color: rgb(255, 0, 0, 0)  }
`

const IncrementAnimation = keyframes`
  0% { background-color: rgb(0, 128, 0, 0.1); }
  30% { background-color: rgb(0, 128, 0, 0.25); }
  40% { background-color: rgb(0, 128, 0, 0.5)  }
  100% { background-color: rgb(0, 128, 0, 0)  }
`

const Tr = styled.tr`
  animation-name: ${({ isAnimated }) => (isAnimated ? BgAnimation : "none")};
  animation-duration: 0.5s;

  cursor: pointer;

  &:hover {
    background-color: #1e3059;
  }
`

const Td = styled.td`
  ${color}
  ${typography}

  animation-name: ${({ animationType }) => {
    switch (animationType) {
      case "increment":
        return IncrementAnimation
      case "decrement":
        return BgAnimation
      default:
        return "none"
    }
  }};
  animation-duration: 0.5s;
`

export default Bids

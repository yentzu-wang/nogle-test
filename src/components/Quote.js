import React, { useState, useEffect } from "react"
import styled from "styled-components"
import numeral from "numeral"
import { ReactComponent as Icon } from "../assets/arrow.svg"

const Quote = ({ currentQuote: { price, timestamp } }) => {
  const compare = useColor(price, timestamp)

  if (!price) {
    return null
  }

  return (
    <tr>
      <Td colSpan={3} compare={compare}>
        <Div compare={compare}>
          {numeral(price).format("0,0.0")}
          {compare !== "=" ? (
            <StyledIcon compare={compare} />
          ) : (
            <div style={{ width: 20 }} />
          )}
        </Div>
      </Td>
    </tr>
  )
}

const useColor = (price, timestamp) => {
  const [prevTimestamp, setPrevTimestamp] = useState(0)
  const [prevPrice, setPrevPrice] = useState(0)
  const [compare, setCompare] = useState("=")

  useEffect(() => {
    if (timestamp > prevTimestamp) {
      if (price === prevPrice) {
        setCompare("=")
      } else if (price > prevPrice) {
        setCompare(">")
        setPrevPrice(price)
      } else if (price < prevPrice) {
        setPrevPrice(price)
        setCompare("<")
      }

      setPrevTimestamp(timestamp)
    }
  }, [prevPrice, prevTimestamp, price, timestamp])

  return compare
}

const Td = styled.td`
  text-align: center;
  font-size: 18px;
  font-weight: bold;

  color: ${({ compare }) => {
    switch (compare) {
      case ">":
        return "#00b15d"
      case "<":
        return "#FF5B5A"
      default:
        return "#F0F4F8"
    }
  }};
`

const Div = styled.div`
  padding: 4px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;

  background-color: ${({ compare }) => {
    switch (compare) {
      case ">":
        return "rgba(16, 186, 104, 0.12)"
      case "<":
        return "rgba(255, 90, 90, 0.12)"
      default:
        return "rgba(134, 152, 170, 0.12)"
    }
  }};
`

const StyledIcon = styled(Icon)`
  color: ${({ compare }) => {
    switch (compare) {
      case ">":
        return "#00b15d"
      case "<":
        return "#FF5B5A"
      default:
        return "#F0F4F8"
    }
  }};

  transform: ${({ compare }) => {
    switch (compare) {
      case ">":
        return "rotate(180deg)"
      case "<":
        return "rotate(0deg)"
      default:
        return null
    }
  }};
`

export default Quote

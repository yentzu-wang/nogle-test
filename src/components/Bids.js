import React, { useReducer, useEffect, useMemo } from "react"

const Bids = ({ bids, displayCount, currentPrice }) => {
  const { parsedBids: parsedBids, dict } = useData(
    bids,
    currentPrice,
    displayCount
  )
  let count = 0
  const displayData = parsedBids
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

const useData = (asks, currentPrice, displayCount) => {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { parsedBids: [], dict: {} }
  )

  // filter data which doesn't need to show
  const filteredBids = useMemo(
    () => asks.filter(([price]) => parseFloat(price) <= currentPrice) || [],
    [asks, currentPrice]
  )

  useEffect(() => {
    // initialize
    if (filteredBids.length > 0 && state.parsedBids.length === 0) {
      setState({
        parsedBids: filteredBids.map(([price, size]) => [
          parseFloat(price),
          parseInt(size)
        ]),
        dict: () => {
          const dict = {}
          filteredBids.forEach(
            ([price, size]) => (dict[parseFloat(price)] = parseInt(size))
          )

          return dict
        }
      })
    } else if (filteredBids.length > 0 && asks.length >= displayCount) {
      // update
      setState({
        parsedBids: filteredBids.map(([price, size]) => [
          parseFloat(price),
          parseInt(size)
        ]),
        dict: () => {
          const dict = {}
          filteredBids.forEach(
            ([price, size]) => (dict[parseFloat(price)] = parseInt(size))
          )
          return dict
        }
      })
    } else if (filteredBids.length > 0 && asks.length < displayCount) {
      // compare
      setState({
        dict: () => {
          const dict = { ...state.dict }
          filteredBids.forEach(
            ([price, size]) => (dict[price] = parseInt(size))
          )

          return dict
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asks, displayCount, filteredBids])

  return state
}

export default Bids

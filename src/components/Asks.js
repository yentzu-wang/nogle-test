import React, { useReducer, useEffect, useMemo } from "react"

const Asks = ({ asks, displayCount, currentPrice }) => {
  const { parsedAsks, dict } = useData(asks, currentPrice, displayCount)
  let count = 0
  const displayData = parsedAsks
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
    { parsedAsks: [], dict: {} }
  )

  // filter data which doesn't need to show
  const filteredAsks = useMemo(
    () => asks.filter(([price]) => parseFloat(price) >= currentPrice) || [],
    [asks, currentPrice]
  )

  useEffect(() => {
    // initialize
    if (filteredAsks.length > 0 && state.parsedAsks.length === 0) {
      setState({
        parsedAsks: filteredAsks.map(([price, size]) => [
          parseFloat(price),
          parseInt(size)
        ]),
        dict: () => {
          const dict = {}
          filteredAsks.forEach(
            ([price, size]) => (dict[parseFloat(price)] = parseInt(size))
          )

          return dict
        }
      })
    } else if (filteredAsks.length > 0 && asks.length >= displayCount) {
      // update
      setState({
        parsedAsks: filteredAsks.map(([price, size]) => [
          parseFloat(price),
          parseInt(size)
        ]),
        dict: () => {
          const dict = {}
          filteredAsks.forEach(
            ([price, size]) => (dict[parseFloat(price)] = parseInt(size))
          )
          return dict
        }
      })
    } else if (filteredAsks.length > 0 && asks.length < displayCount) {
      // compare
      setState({
        dict: () => {
          const dict = { ...state.dict }
          filteredAsks.forEach(
            ([price, size]) => (dict[price] = parseInt(size))
          )

          return dict
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asks, displayCount, filteredAsks])

  return state
}

export default Asks

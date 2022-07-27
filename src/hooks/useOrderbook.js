import { useReducer, useEffect, useMemo } from "react"

const useOrderbook = (orders, currentPrice, displayCount, type = "ask") => {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { parsedOrders: [], dict: {}, prevDict: {} }
  )

  // Filter data that doesn't need to show
  const filteredOrders = useMemo(
    () =>
      orders.filter(([price]) =>
        type === "ask"
          ? parseFloat(price) >= currentPrice
          : parseFloat(price) <= currentPrice
      ) || [],
    [orders, currentPrice, type]
  )

  useEffect(() => {
    // Cannot use early return here because hooks return a cleanup function,
    // so bare with nested if statement
    if (filteredOrders.length > 0) {
      // initialization
      if (state.parsedOrders.length === 0) {
        setState({
          parsedOrders: filteredOrders.map(([price, size]) => [
            parseFloat(price),
            parseInt(size)
          ]),
          dict: (() => {
            const dict = {}
            filteredOrders.forEach(
              ([price, size]) => (dict[parseFloat(price)] = parseInt(size))
            )

            return dict
          })()
        })
      } else if (orders.length >= displayCount) {
        // Update (A.K.A. replace with new ones)
        setState({ prevDict: state.dict })
        setState({
          parsedOrders: filteredOrders.map(([price, size]) => [
            parseFloat(price),
            parseInt(size)
          ]),
          dict: (() => {
            const dict = {}
            filteredOrders.forEach(
              ([price, size]) => (dict[parseFloat(price)] = parseInt(size))
            )

            return dict
          })()
        })
      } else if (orders.length < displayCount) {
        // Compare with existing data
        setState({
          prevDict: (() => {
            const dict = { ...state.prev }
            filteredOrders.forEach(
              ([price, size]) => (dict[price] = parseInt(size))
            )

            return dict
          })()
        })
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, displayCount, filteredOrders])

  return state
}

export default useOrderbook

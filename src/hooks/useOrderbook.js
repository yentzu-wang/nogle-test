import { useReducer, useEffect, useMemo } from "react"

const useOrderbook = (orders, currentPrice, displayCount, type = "ask") => {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { parsedOrders: [], dict: {} }
  )

  // filter data which doesn't need to show
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
    // initialize
    if (filteredOrders.length > 0 && state.parsedOrders.length === 0) {
      setState({
        parsedOrders: filteredOrders.map(([price, size]) => [
          parseFloat(price),
          parseInt(size)
        ]),
        dict: () => {
          const dict = {}
          filteredOrders.forEach(
            ([price, size]) => (dict[parseFloat(price)] = parseInt(size))
          )

          return dict
        }
      })
    } else if (filteredOrders.length > 0 && orders.length >= displayCount) {
      // update
      setState({
        parsedOrders: filteredOrders.map(([price, size]) => [
          parseFloat(price),
          parseInt(size)
        ]),
        dict: () => {
          const dict = {}
          filteredOrders.forEach(
            ([price, size]) => (dict[parseFloat(price)] = parseInt(size))
          )
          return dict
        }
      })
    } else if (filteredOrders.length > 0 && orders.length < displayCount) {
      // compare
      setState({
        dict: () => {
          const dict = { ...state.dict }
          filteredOrders.forEach(
            ([price, size]) => (dict[price] = parseInt(size))
          )

          return dict
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, displayCount, filteredOrders])

  return state
}

export default useOrderbook

import { useState, useEffect } from "react"
import useWebSocket from "react-use-websocket"

const useFeed = () => {
  const OrdersTopic = "update:BTCPFC"
  const QuoteTopic = "tradeHistoryApi:BTCPFC"

  const { sendMessage: sendMessageToOrders, lastMessage: ordersLastMessage } =
    useWebSocket("wss://ws.btse.com/ws/oss/futures")
  const { sendMessage: sendMessageToQuote, lastMessage: quoteLastMessage } =
    useWebSocket("wss://ws.btse.com/ws/futures")

  const [asks, setAsks] = useState([])
  const [bids, setBids] = useState([])
  const [currentQuote, setCurrentQuote] = useState({})

  // Initialize subscription
  useEffect(() => {
    sendMessageToOrders(
      JSON.stringify({ op: "subscribe", args: [OrdersTopic] })
    )
    sendMessageToQuote(
      JSON.stringify({
        op: "subscribe",
        args: [QuoteTopic]
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update orderbook data
  useEffect(() => {
    if (ordersLastMessage) {
      const message = JSON.parse(ordersLastMessage.data)

      if (message.topic === OrdersTopic) {
        const {
          data: { asks, bids }
        } = message

        if (asks.length > 0) {
          setAsks(asks)
        }

        if (bids.length > 0) {
          setBids(bids)
        }
      }
    }
  }, [ordersLastMessage])

  // Update quote data
  useEffect(() => {
    if (quoteLastMessage) {
      const data = JSON.parse(quoteLastMessage.data).data

      if (data?.length > 0) {
        const { side, price } = data[0]

        setCurrentQuote({
          side,
          price,
          timestamp: quoteLastMessage.timeStamp
        })
      }
    }
  }, [quoteLastMessage])

  return { asks, bids, currentQuote }
}

export default useFeed

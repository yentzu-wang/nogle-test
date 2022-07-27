import { useState, useEffect } from "react"
import useWebSocket from "react-use-websocket"

const useFeed = () => {
  const target = "update:BTCPFC"
  const targetForLastPrice = "tradeHistoryApi:BTCPFC"
  const { sendMessage, lastMessage } = useWebSocket(
    "wss://ws.btse.com/ws/oss/futures"
  )
  const [currentQuote, setCurrentQuote] = useState({})

  const {
    sendMessage: sendMessageToLastPriceWS,
    lastMessage: lastMessageLastPriceWS
  } = useWebSocket("wss://ws.btse.com/ws/futures")

  const [asks, setAsks] = useState([])
  const [bids, setBids] = useState([])

  useEffect(() => {
    sendMessage(JSON.stringify({ op: "subscribe", args: [target] }))
    sendMessageToLastPriceWS(
      JSON.stringify({
        op: "subscribe",
        args: [targetForLastPrice]
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage.data)

      if (message.topic === target) {
        const {
          data: { asks, bids }
        } = message

        if (asks.length > 0) {
          setAsks(asks)
        }

        if (bids.length >= 0) {
          setBids(bids)
        }
      }
    }
  }, [lastMessage])

  useEffect(() => {
    if (lastMessageLastPriceWS) {
      const data = JSON.parse(lastMessageLastPriceWS.data).data

      if (data?.length > 0) {
        const { side, price } = data[0]

        setCurrentQuote({ side, price })
      }
    }
  }, [lastMessageLastPriceWS])

  return { asks, bids, currentQuote }
}

export default useFeed

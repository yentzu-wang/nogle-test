import React, { useState, useCallback, useEffect } from "react"
import useWebSocket from "react-use-websocket"
import Orderbook from "./components/Orderbook"

function App() {
  const displayCount = 8
  const [messageHistory, setMessageHistory] = useState([])
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
    if (lastMessage) {
      const message = JSON.parse(lastMessage.data)

      if (message.topic === target) {
        const {
          data: { asks, bids }
        } = message

        if (asks.length > 0) {
          // let count = 0

          // const formattedAsks = asks
          //   .filter(ask => ask[1] !== "0")
          //   .slice(-8)
          //   .reverse()
          //   .map(([price, size]) => {
          //     count += parseInt(size)

          //     return [parseFloat(price), parseInt(size), count]
          //   })
          //   .reverse()

          setAsks(asks)
        }

        if (bids.length >= 0) {
          // let count = 0

          // const formattedBids = bids
          //   .filter(([, size]) => size !== "0")
          //   .slice(0, 8)
          //   .map(([price, size]) => {
          //     count += parseInt(size)

          //     return [parseFloat(price), parseInt(size), count]
          //   })

          setBids(bids)
        }

        setMessageHistory(prev =>
          prev.concat(JSON.parse(lastMessage.data).data)
        )
      }
    }
  }, [lastMessage, setMessageHistory])

  useEffect(() => {
    if (lastMessageLastPriceWS) {
      const data = JSON.parse(lastMessageLastPriceWS.data).data

      if (data?.length > 0) {
        const { side, price } = data[0]

        setCurrentQuote({ side, price })
      }
    }
  }, [lastMessageLastPriceWS])

  useEffect(() => {
    sendMessage(JSON.stringify({ op: "subscribe", args: [target] }))

    sendMessageToLastPriceWS(
      JSON.stringify({
        op: "subscribe",
        args: [targetForLastPrice]
      })
    )
  }, [])

  const handleClickSendMessage = useCallback(() => {
    const payload = {
      op: "subscribe",
      args: [target]
    }

    sendMessage(JSON.stringify(payload))
  }, [])

  const handleUnsubscribe = useCallback(() => {
    const payload = {
      op: "unsubscribe",
      args: [target]
    }

    sendMessage(JSON.stringify(payload))
  }, [])

  return (
    <div>
      <button onClick={handleClickSendMessage}>
        Click Me to send &apos;Hello&apos;
      </button>
      <button onClick={handleUnsubscribe}>Click Me to Stop</button>
      <Orderbook
        asks={asks}
        bids={bids}
        currentQuote={currentQuote}
        displayCount={displayCount}
      />
    </div>
  )
}

export default App

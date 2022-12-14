import React from "react"
import styled from "styled-components"
import Asks from "./Asks"
import Bids from "./Bids"
import Quote from "./Quote"
import useFeed from "../hooks/useFeed"

const Orderbook = () => {
  const displayCount = 8
  const { asks, bids, currentQuote } = useFeed()

  return (
    <Wrapper>
      <Title>Orderbook</Title>
      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <th style={{ textAlign: "left" }}>Price (USD)</th>
              <th style={{ textAlign: "right" }}>Size</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </Thead>
          <tbody>
            <Asks
              asks={asks}
              currentPrice={currentQuote?.price}
              displayCount={displayCount}
            />
            <Quote currentQuote={currentQuote} />
            <Bids
              bids={bids}
              currentPrice={currentQuote?.price}
              displayCount={displayCount}
            />
          </tbody>
        </Table>
      </TableWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 400px;
  font-weight: 600;

  background-color: #131b29;
  color: #f0f4f8;
`

const Title = styled.div`
  padding: 8px 12px;
  color: #f0f4f8;
`

const TableWrapper = styled.div`
  padding: 0px 12px 12px 12px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Thead = styled.thead`
  color: #8698aa;
`

export default Orderbook

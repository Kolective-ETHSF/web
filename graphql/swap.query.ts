import { gql } from "graphql-request";

export const querySwaps = () => {
  return gql`{
    swaps(
      orderBy: "blockTimestamp", 
      orderDirection: "desc"
    ) {
      items {
        id
        sellPrice
        buyPrice
        amountIn
        amountOut
        sender
        tokenIn
        tokenOut
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  }`
}

export const querySwapsByUser = (address: string) => {
  return gql`{
    swaps(
      orderBy: "blockTimestamp", 
      orderDirection: "desc",
      where: {sender: "${address}"}
    ) {
      items {
        id
        sellPrice
        buyPrice
        amountIn
        amountOut
        sender
        tokenIn
        tokenOut
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  }`
}
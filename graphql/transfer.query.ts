import { gql } from "graphql-request";

export const queryTransfers = () => {
  return gql`{
    transfers(
      orderBy: "blockTimestamp", 
      orderDirection: "desc"
    ) {
      blockNumber
      blockTimestamp
      from
      id
      to
      transactionHash
      value
    }
  }`
}

export const queryTransfersByUser = (address: string) => {
  return gql`{
    transfers(
      orderBy: "blockTimestamp", 
      orderDirection: "desc",
      where: {from: "${address}"}
    ) {
      blockNumber
      blockTimestamp
      from
      id
      to
      transactionHash
      value
    }
  }`
}
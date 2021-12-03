import React from "react";
import { useMoralisQuery } from "react-moralis";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
const Transactions = ({ tokenId }) => {
    const { data, error, isLoading } = useMoralisQuery(
        "TransferEvents",
        (query) => query.equalTo("tokenId", tokenId)
    );
    if (isLoading) {
        return (
            <div className="transaction-history">
                <Text>Fetching transfer data</Text>
                <Spinner color="red.500" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="transaction-history">
                <Text>Failed to retrieve transfer data</Text>
            </div>
        );
    }
    return (
        <div className="transaction-history">
            <Table variant="simple">
                <TableCaption>NFT Transfer History</TableCaption>
                <Thead>
                    <Tr>
                        <Th>From</Th>
                        <Th>To</Th>
                        <Th>Date</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((token, index) => {
                        return (
                            <Tr key={index}>
                                <Td className="link-styling">
                                    {index == 0 ? (
                                        <Text>
                                            {token.attributes.from.slice(0, 5) +
                                                "..." +
                                                token.attributes.from.slice(
                                                    16,
                                                    21
                                                )}
                                        </Text>
                                    ) : (
                                        <Link
                                            to={{
                                                pathname: "/explore",
                                                state: {
                                                    addr: token.attributes.from,
                                                },
                                            }}
                                            style={{
                                                color: "#4f46e5",
                                            }}
                                        >
                                            {token.attributes.from.slice(0, 5) +
                                                "..." +
                                                token.attributes.from.slice(
                                                    16,
                                                    21
                                                )}
                                        </Link>
                                    )}
                                </Td>
                                <Td className="link-styling">
                                    <Link
                                        to={{
                                            pathname: "/explore",
                                            state: {
                                                addr: token.attributes.to,
                                            },
                                        }}
                                        style={{
                                            color: "#4f46e5",
                                        }}
                                    >
                                        {token.attributes.to.slice(0, 5) +
                                            "..." +
                                            token.attributes.to.slice(16, 21)}
                                    </Link>
                                </Td>
                                <Td>
                                    {token.attributes.block_timestamp.toString()}
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </div>
    );
};

export default Transactions;

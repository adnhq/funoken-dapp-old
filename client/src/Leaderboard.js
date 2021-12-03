import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useState from "react-usestateref";
import { Link, useHistory } from "react-router-dom";
import {
    Table,
    Thead,
    Tbody,
    Button,
    Tr,
    Text,
    Th,
    Td,
    TableCaption,
} from "@chakra-ui/react";

import { useMoralisQuery, useMoralisWeb3Api } from "react-moralis";
const Leaderboard = () => {
    const history = useHistory();
    const [metadata, setMetadata, metaRef] = useState({});
    const { data } = useMoralisQuery("Transactions", (query) =>
        query.descending("amount").limit(15)
    );
    const Web3Api = useMoralisWeb3Api();

    const fetchBlock = async (id) => {
        const result = await Web3Api.token.getTokenIdMetadata({
            address: "0xEea65793B3080367Ea727aB46D74215Ac2409b58",
            token_id: id,
            chain: "ropsten",
        });

        setMetadata(JSON.parse(result.metadata));
        history.push({
            pathname: "/view-token",
            state: {
                tokenId: id,
                name: metaRef.current.name,
                description: metaRef.current.description,
                imageUrl: metaRef.current.imageUrl,
                calledFrom: "Explore",
            },
        });
    };

    return (
        <div className="lead-parent">
            <Navbar></Navbar>
            <div className="leaderboard">
                <Table variant="simple">
                    <TableCaption placement="top">
                        <Text
                            fontFamily="'Nunito', sans-serif"
                            color="gray.600"
                            fontWeight="600"
                            letterSpacing={0.6}
                        >
                            HIGHEST SELLING NFTs
                        </Text>
                    </TableCaption>
                    <Thead>
                        <Tr>
                            <Th fontFamily="'Nunito', sans-serif">Token ID</Th>
                            <Th fontFamily="'Nunito', sans-serif">FROM</Th>
                            <Th fontFamily="'Nunito', sans-serif">TO</Th>
                            <Th fontFamily="'Nunito', sans-serif">AMOUNT</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {data?.map((item) => {
                            return (
                                <Tr>
                                    <Td>
                                        <Button
                                            colorScheme="purple"
                                            variant="outline"
                                            onClick={() =>
                                                fetchBlock(
                                                    item.attributes.tokenId
                                                )
                                            }
                                        >
                                            {item.attributes.tokenId}
                                        </Button>
                                    </Td>
                                    <Td className="link-styling">
                                        <Link
                                            to={{
                                                pathname: "/explore",
                                                state: {
                                                    addr: item.attributes.from,
                                                },
                                            }}
                                        >
                                            {item.attributes.from}
                                        </Link>
                                    </Td>
                                    <Td className="link-styling">
                                        <Link
                                            to={{
                                                pathname: "/explore",
                                                state: {
                                                    addr: item.attributes.to,
                                                },
                                            }}
                                        >
                                            {item.attributes.to}
                                        </Link>
                                    </Td>
                                    <Td>
                                        {(
                                            item.attributes.amount / 1e18
                                        ).toFixed(5)}
                                        &nbsp;
                                        <i className="fab fa-ethereum"></i>
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Leaderboard;

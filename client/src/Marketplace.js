import React, { useEffect } from "react";
import AuctionCard from "./AuctionCard";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Text } from "@chakra-ui/layout";
import { Spinner, useToast } from "@chakra-ui/react";
import { useMoralis, useMoralisQuery } from "react-moralis";

import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";

const Marketplace = () => {
    const { user } = useMoralis();
    const toast = useToast();
    const [auctionList, setAuctionList] = React.useState(null);
    const query = useMoralisQuery("AuctionEvents", (query) =>
        query.notEqualTo("currentOwner", user.get("ethAddress"))
    );
    const Web3Api = useMoralisWeb3Api();
    const { fetch, data } = useMoralisWeb3ApiCall(
        Web3Api.token.getAllTokenIds,
        {
            address: "0xEea65793B3080367Ea727aB46D74215Ac2409b58",
            chain: "ropsten",
        }
    );

    useEffect(() => fetch(), []);

    useEffect(() => {
        if (data && query) {
            const idList = query.data.map((o) => o.attributes.tokenId);
            let newList = data.result.filter((item) => {
                if (idList.includes(item.token_id)) return item;
            });
            setAuctionList(newList);
        }
    }, [data]);

    const fixURL = (url) => {
        if (url.startsWith("ipfs")) {
            return (
                "https://ipfs.moralis.io:2053/ipfs/" +
                url.split("ipfs://").slice(-1)
            );
        } else {
            return url + "?format=json";
        }
    };
    return (
        <div className="auction-parent">
            <Navbar></Navbar>
            <div className="auctions">
                <Text
                    fontSize="lg"
                    style={{
                        gridColumn: "1/-1",
                        justifySelf: "center",
                        marginBottom: "-10px",
                        fontFamily: "'Nunito', sans-serif",
                    }}
                >
                    Ongoing Auctions
                </Text>

                {auctionList?.length > 0 &&
                    auctionList.map((item) => {
                        const id = item.token_id;
                        try {
                            const { name, description, imageUrl } = JSON.parse(
                                item.metadata
                            );
                            return (
                                <AuctionCard
                                    key={id}
                                    tokenId={id}
                                    name={name}
                                    description={description}
                                    imageUrl={fixURL(imageUrl)}
                                />
                            );
                        } catch (e) {
                            toast({
                                title: "Could not retrieve NFT data!",
                                status: "error",
                                variant: "left-accent",
                                duration: 3000,
                                isClosable: false,
                            });
                        }
                    })}
                {auctionList == null && (
                    <>
                        Loading auctions <Spinner color="red.500" />
                    </>
                )}
                {auctionList?.length == 0 && (
                    <Text>No NFTs currently listed for auction</Text>
                )}
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Marketplace;

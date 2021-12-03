import React, { useEffect } from "react";
import Navbar from "./Navbar";
import AuctionStatus from "./AuctionStatus";
import Footer from "./Footer";
import { useMoralis, useMoralisQuery } from "react-moralis";

import { Spinner } from "@chakra-ui/react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";

const MyAuctions = () => {
    const { user } = useMoralis();

    const [myList, setMyList] = React.useState(null);
    const Web3Api = useMoralisWeb3Api();
    const { fetch, data } = useMoralisWeb3ApiCall(
        Web3Api.token.getAllTokenIds,
        {
            address: "0xEea65793B3080367Ea727aB46D74215Ac2409b58",
            chain: "ropsten",
        }
    );
    const { data: queryData } = useMoralisQuery("AuctionEvents", (query) =>
        query.equalTo("currentOwner", user.get("ethAddress"))
    );

    function retData() {
        let idList = queryData.map((item) => item.attributes.tokenId);

        if (data) {
            let newList = data.result.filter((item) => {
                if (idList.includes(item.token_id)) return item;
            });

            setMyList(newList);
        }
    }
    useEffect(() => {
        if (queryData) retData();
    }, [queryData, data]);

    return (
        <div className="auction-parent">
            <Navbar></Navbar>
            <div className="active-auctions">
                {myList ? (
                    myList.map((token) => {
                        const id = token.token_id;
                        const { name, imageUrl } = JSON.parse(token.metadata);
                        return (
                            <AuctionStatus
                                name={name}
                                id={id}
                                imageUrl={imageUrl}
                            />
                        );
                    })
                ) : (
                    <>
                        Loading auctions <Spinner color="red.500" />
                    </>
                )}
                {myList?.length == 0 && (
                    <>You currently have no active auctions.</>
                )}
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MyAuctions;

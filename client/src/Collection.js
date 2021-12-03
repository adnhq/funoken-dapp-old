import { Box } from "@chakra-ui/layout";
import React from "react";
import {
    useMoralis,
    useMoralisWeb3Api,
    useMoralisWeb3ApiCall,
} from "react-moralis";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    useToast,
    AlertDescription,
    Spinner,
} from "@chakra-ui/react";

import { Text } from "@chakra-ui/react";

import Card from "./Card";
import TokenModal from "./TokenModal";

const Collection = ({ user_address, calledFrom }) => {
    const toast = useToast();
    const Web3Api = useMoralisWeb3Api();
    const { user } = useMoralis();
    const { data, error } = useMoralisWeb3ApiCall(
        Web3Api.account.getNFTsForContract,
        {
            chain: "ropsten",
            address: user_address,
            token_address: "0xEea65793B3080367Ea727aB46D74215Ac2409b58",
        }
    );

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
    if (error) {
        return (
            <div className="err-alert">
                <Alert
                    status="error"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="200px"
                >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                        Fetch request failed!
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">
                        Could not retrieve the user's NFT collection. Please try
                        again!
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <>
            <Box className="gallery">
                <div className="coll-header">
                    <Text id="my-coll">
                        {user_address == user.get("ethAddress") ? (
                            <>My</>
                        ) : (
                            <>{user_address}'s</>
                        )}{" "}
                        Collection ({data ? <>{data.total}</> : <>...</>})
                    </Text>
                    {user_address == user.get("ethAddress") &&
                        calledFrom == "Home" && <TokenModal />}
                </div>

                {data ? (
                    data.result.map((token) => {
                        const id = token.token_id;
                        try {
                            const { name, description, imageUrl } = JSON.parse(
                                token.metadata
                            );
                            return (
                                <Card
                                    key={id}
                                    tokenId={id}
                                    name={name}
                                    description={description}
                                    user_address={user_address}
                                    imageUrl={fixURL(imageUrl)}
                                    calledFrom={calledFrom}
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
                    })
                ) : (
                    <>
                        Loading NFTs <Spinner color="red.500" />
                    </>
                )}
                {data?.result.length == 0 && <>No NFTs currently available</>}
            </Box>
        </>
    );
};

export default Collection;

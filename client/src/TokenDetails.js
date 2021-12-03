import React from "react";
import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import Options from "./Options";
import { useMoralisQuery } from "react-moralis";
import Transactions from "./Transactions";
import { Link } from "react-router-dom";
import Stats from "./Stats";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from "@chakra-ui/react";

const Details = ({ tokenId, description, imageUrl }) => {
    const { data } = useMoralisQuery("TransferEvents", (query) =>
        query
            .equalTo("tokenId", tokenId)
            .equalTo("from", "0x0000000000000000000000000000000000000000")
    );
    return (
        <div className="details-class">
            <div className="img-container">
                <Image src={imageUrl}></Image>
            </div>
            <div className="text-container">
                <Accordion defaultIndex={[0]} allowMultiple>
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    Description
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>{description}</AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    Details
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel className="desc-tab" pb={4}>
                            <div style={{ lineHeight: "2" }}>
                                <Text>Created by </Text>
                                <Text>Token ID </Text>

                                <Text>Token Standard </Text>
                                <Text>Chain ID </Text>
                            </div>
                            <div style={{ lineHeight: "2" }}>
                                {data[0] ? (
                                    <Link
                                        to={{
                                            pathname: "/explore",
                                            state: {
                                                addr: data[0].attributes.to,
                                            },
                                        }}
                                        style={{
                                            color: "#4f46e5",
                                        }}
                                    >
                                        <Text>
                                            {data[0].attributes.to.slice(0, 5) +
                                                "..." +
                                                data[0].attributes.to.slice(
                                                    16,
                                                    21
                                                )}
                                        </Text>
                                    </Link>
                                ) : (
                                    <Text>N/A</Text>
                                )}
                                <Text>{tokenId}</Text>

                                <Text>ERC-721</Text>
                                <Text>0x3</Text>
                            </div>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

const TokenDetails = ({
    tokenId,
    name,
    description,
    imageUrl,
    calledFrom,
    user_address,
}) => {
    return (
        <div className="token-details">
            <Details
                tokenId={tokenId}
                description={description}
                imageUrl={imageUrl}
            ></Details>
            <Options
                name={name}
                tokenId={tokenId}
                calledFrom={calledFrom}
                user_address={user_address}
            ></Options>
            <Transactions tokenId={tokenId}></Transactions>
            <Stats tokenId={tokenId}></Stats>
        </div>
    );
};

export default TokenDetails;

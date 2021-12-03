import React, { useContext, useState, useEffect } from "react";
import { chakra, Box, Image, Flex } from "@chakra-ui/react";
import { InstanceContext } from "./App";
import { useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const AuctionCard = ({ tokenId, name, description, imageUrl }) => {
    const instance = useContext(InstanceContext);

    const toast = useToast();
    const [price, setPrice] = useState(0);
    async function getPrice() {
        try {
            const result = await instance.methods.idToBid(tokenId).call();
            setPrice((result.highestBid / 1e18).toFixed(5));
        } catch (e) {
            toast({
                title: "Failed to retrieve price",
                status: "error",
                variant: "solid",
                duration: 3000,
                isClosable: false,
            });
        }
    }
    useEffect(() => {
        getPrice();
    }, []);
    return (
        <Flex w="full">
            <Box
                width="xs"
                mx="auto"
                my="auto"
                bg="white"
                className="auction-card"
                rounded="lg"
            >
                <Box px={4} py={2}>
                    <chakra.h1
                        color="gray.800"
                        fontWeight="bold"
                        fontSize="2xl"
                        textTransform="uppercase"
                    >
                        {name}
                    </chakra.h1>
                    <chakra.p mt={1} fontSize="sm" isTruncated color="gray.600">
                        {description}
                    </chakra.p>
                </Box>

                <Image h={64} w="full" fit="cover" mt={2} src={imageUrl} />

                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    px={4}
                    py={2}
                    bg="gray.900"
                    roundedBottom="lg"
                >
                    <chakra.h1 color="white" fontWeight="600" fontSize="lg">
                        Current Price: {price}&nbsp;
                        <i className="fab fa-ethereum"></i>
                    </chakra.h1>
                    <Link
                        to={{
                            pathname: "/view-token",
                            state: {
                                tokenId,
                                user_address: "",
                                name,
                                description,
                                imageUrl,
                                calledFrom: "Marketplace",
                            },
                        }}
                    >
                        <chakra.button
                            px={2}
                            py={1}
                            bg="white"
                            fontSize="xs"
                            color="gray.900"
                            fontWeight="bold"
                            rounded="lg"
                            textTransform="uppercase"
                            _hover={{
                                bg: "gray.200",
                            }}
                            _focus={{
                                bg: "gray.400",
                            }}
                        >
                            View
                        </chakra.button>
                    </Link>
                </Flex>
            </Box>
        </Flex>
    );
};

export default AuctionCard;

import React from "react";

import { chakra, Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
const Card = ({
    tokenId,
    name,
    description,
    imageUrl,
    calledFrom,
    user_address,
}) => {
    return (
        <Flex
            w="full"
            alignItems="center"
            justifyContent="center"
            className="card-item"
        >
            <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
                w="sm"
                mx="auto"
            >
                <Box
                    bg="gray.300"
                    h={64}
                    w="full"
                    rounded="lg"
                    shadow="md"
                    bgSize="cover"
                    bgPos="center"
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                    }}
                ></Box>

                <Box
                    w={{ base: 56, md: 64 }}
                    bg="white"
                    mt={-10}
                    shadow="lg"
                    rounded="lg"
                    overflow="hidden"
                >
                    <chakra.h3
                        py={2}
                        textAlign="center"
                        fontWeight="bold"
                        textTransform="uppercase"
                        color="gray.800"
                        isTruncated="true"
                        letterSpacing={0.5}
                    >
                        {name}
                    </chakra.h3>

                    <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        py={2}
                        px={3}
                        bg="gray.200"
                    >
                        <Text className="token-desc">{description}</Text>
                        <Link
                            to={{
                                pathname: "/view-token",
                                state: {
                                    tokenId,
                                    user_address,
                                    name,
                                    description,
                                    imageUrl,
                                    calledFrom,
                                },
                            }}
                        >
                            <chakra.button
                                bg="gray.800"
                                fontSize="xs"
                                fontWeight="bold"
                                color="white"
                                px={2}
                                py={1}
                                rounded="lg"
                                textTransform="uppercase"
                                _hover={{ bg: "#6b6b6b" }}
                                _focus={{
                                    bg: "gray.700",

                                    outline: "none",
                                }}
                            >
                                View
                            </chakra.button>
                        </Link>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Card;

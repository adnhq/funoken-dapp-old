import React, { useState, useEffect, useContext } from "react";
import { chakra, Box, useToast, Button, Text } from "@chakra-ui/react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { InstanceContext } from "./App";
import CountDownTimer from "./CountDownTimer";
const AuctionStatus = ({ name, id, imageUrl }) => {
    const [bidAmount, setBidAmount] = useState("0");

    const instance = useContext(InstanceContext);
    const toast = useToast();
    const { user } = useMoralis();

    const [timeLeft, setTimeLeft] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalBids, setTotalBids] = useState(0);
    const { data } = useMoralisQuery("AuctionEvents", (query) =>
        query.equalTo("tokenId", id)
    );

    async function getStats() {
        try {
            const result = await instance.methods.idToBid(id).call();

            const { auctionStart, activeTime, bidsPlaced, highestBid } = result;
            if (parseInt(bidsPlaced) > 0) {
                setBidAmount((highestBid / 1e18).toFixed(5));
                setTotalBids(bidsPlaced);
            }
            setTimeLeft(
                parseInt(auctionStart) +
                    parseInt(activeTime * 3600) -
                    Math.floor(Date.now() / 1000)
            );
        } catch (e) {
            toast({
                title: "Failed to retrieve auction data!",
                status: "error",
                duration: 2000,
                isClosable: false,
            });
        }
    }
    useEffect(() => getStats(), []);
    async function endAuction() {
        try {
            const result = await instance.methods
                .endAuction(id)
                .send({ from: user.get("ethAddress") });
            setTimeLeft(0);
            toast({
                title: "Auction Ended",
                description:
                    "Auction completed successfully. Updates will take effect shortly.",
                status: "success",
                duration: 2500,
                isClosable: false,
            });
        } catch (e) {
            toast({
                title: "Something went wrong!",
                status: "error",
                duration: 2500,
                isClosable: false,
            });
        }
        setLoading(false);
    }
    let hoursMinSecs;
    if (timeLeft > 0) {
        let hours = Math.floor(timeLeft / 3600);
        let newTime = timeLeft % 3600;
        let minutes = Math.floor(newTime / 60);
        let seconds = Math.floor(newTime % 60);
        hoursMinSecs = { hours, minutes, seconds };
    }
    async function handleEnd() {
        setLoading(true);
        await endAuction();
        const [object] = data;
        if (object) {
            await object.destroy();
        }
    }
    return (
        <Box display="flex" className="abox-parent">
            <Box
                className="img-box"
                h={64}
                w={{ lg: "22%" }}
                shadow="lg"
                rounded={{ lg: "lg" }}
                bgSize="cover"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                }}
            ></Box>
            <Box
                className="auction-box"
                backgroundColor="#fffff7"
                w={{ lg: "78%" }}
                paddingTop="10px"
                paddingBottom="10px"
                alignSelf="center"
            >
                <Box py={6} px={6}>
                    <Text
                        fontSize="4xl"
                        fontWeight="600"
                        casing="uppercase"
                        color="gray.800"
                        marginBottom="10px"
                    >
                        {name}
                    </Text>
                    <div style={{ lineHeight: "2", marginTop: "15px" }}>
                        <Text>&nbsp;Token ID: {id}</Text>
                        <Text>&nbsp;Highest bid: {bidAmount} ETH</Text>
                        <Text>&nbsp;Bids placed: {totalBids}</Text>
                    </div>
                </Box>
                <Box py={6} px={6} justifySelf="flex-end">
                    <chakra.h3
                        textAlign="center"
                        fontSize={{ base: "xl", md: "2xl" }}
                        color="gray.800"
                        fontWeight="600"
                    >
                        TIME LEFT
                    </chakra.h3>
                    {timeLeft <= 0 ? (
                        <chakra.h3
                            textAlign="center"
                            fontSize={{ base: "2xl", md: "4xl" }}
                            color="red"
                            fontWeight="600"
                        >
                            00:00:00
                        </chakra.h3>
                    ) : (
                        <CountDownTimer
                            hoursMinSecs={hoursMinSecs}
                            setTimeLeft={setTimeLeft}
                        ></CountDownTimer>
                    )}
                    <Box mt={8}>
                        <Button
                            bg="rgb(17, 24, 39)"
                            color="white"
                            _hover={{ bg: "#6b6b6b" }}
                            onClick={handleEnd}
                            isLoading={loading}
                            isDisabled={timeLeft > 0}
                        >
                            END AUCTION
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AuctionStatus;

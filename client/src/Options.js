import React, { useState, useEffect, useContext } from "react";
import AuctionModal from "./AuctionModal";
import BidModal from "./BidModal";
import CountDownTimer from "./CountDownTimer";
import { Text, Button, Heading, Input } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { InstanceContext } from "./App";
import { useDisclosure } from "@chakra-ui/hooks";
import { useToast } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";

const Options = ({ name, tokenId, calledFrom }) => {
    const { user } = useMoralis();
    const toast = useToast();
    const instance = useContext(InstanceContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [recipient, setRecipient] = useState(null);
    const [loading, setLoading] = useState(false);
    const initialRef = React.useRef();
    const finalRef = React.useRef();
    const [sale, setSale] = useState(null);
    const [transfer, setTransfer] = useState(false);
    const [maxBid, setMaxBid] = useState("");
    const [hBidder, sethBidder] = useState("N/A");
    const [totalBids, setTotalBids] = useState(0);
    const [success, setSuccess] = useState(false);
    const [owner, setOwner] = useState("");
    const [time, setTime] = useState("");
    async function getInfo() {
        try {
            const tokenOwner = await instance.methods.ownerOf(tokenId).call();
            const result = await instance.methods.idToBid(tokenId).call();
            setOwner(tokenOwner);
            setTotalBids(result.bidsPlaced);
            setSale(result.forSale);
            setMaxBid(result.highestBid);
            setTime(
                parseInt(result.auctionStart) +
                    parseInt(result.activeTime * 3600) -
                    Math.floor(Date.now() / 1000)
            );
            if (parseInt(result.bidsPlaced) > 0)
                sethBidder(result.highestBidder);
        } catch (e) {
            toast({
                title: "Failed to retrieve token information",
                status: "error",
                duration: 3000,
                isClosable: false,
            });
        }
    }

    useEffect(() => getInfo(), [success]);

    function updateSuccess() {
        setSuccess(true);
    }
    async function transferToken() {
        setLoading(true);
        try {
            await instance.methods
                .safeTransferFrom(user.get("ethAddress"), recipient, tokenId)
                .send({ from: user.get("ethAddress") });
            toast({
                title: "Transfer successful!",
                description:
                    "Token has been sent to recipient. Your collection will be updated shortly",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
            setTransfer(true);
        } catch (e) {
            toast({
                title: "Transfer Failed!",
                description: "Could not transfer token to recipient",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        }
        setLoading(false);
        onClose();
    }

    if (calledFrom == "Home") {
        return (
            <div className="options-class">
                <Text fontSize="4xl" fontWeight="600" casing="uppercase">
                    {name}
                </Text>
                {!transfer ? (
                    <Text className="link-styling">
                        Owned by:&nbsp;&nbsp;
                        <Link
                            to="/"
                            style={{
                                color: "#4f46e5",
                            }}
                        >
                            {owner || <Text display="inline">...</Text>}
                        </Link>
                    </Text>
                ) : (
                    <Text>
                        Item has been transferred. Ownership will be updated
                        shortly.
                    </Text>
                )}
                {sale === false && !transfer ? (
                    <div>
                        <AuctionModal
                            itemId={tokenId}
                            updateSuccess={updateSuccess}
                        />
                        <Button
                            colorScheme="blue"
                            height="50px"
                            width="230px"
                            marginLeft="20px"
                            onClick={onOpen}
                        >
                            Transfer &nbsp;<i className="fas fa-share"></i>
                        </Button>
                        <Modal
                            initialFocusRef={initialRef}
                            finalFocusRef={finalRef}
                            isOpen={isOpen}
                            onClose={onClose}
                        >
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Transfer Token</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody pb={6}>
                                    <FormControl>
                                        <FormLabel>Transfer to:</FormLabel>
                                        <Input
                                            ref={initialRef}
                                            placeholder="Recipient Address"
                                            value={recipient}
                                            onChange={(e) =>
                                                setRecipient(e.target.value)
                                            }
                                        />
                                    </FormControl>
                                </ModalBody>

                                <ModalFooter>
                                    <Button
                                        colorScheme="blue"
                                        width="100%"
                                        isLoading={loading}
                                        onClick={transferToken}
                                    >
                                        Transfer
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                ) : (
                    !transfer && (
                        <Text>Item has already been listed for auction</Text>
                    )
                )}
            </div>
        );
    }
    let hoursMinSecs;
    if (time > 0) {
        let hours = Math.floor(time / 3600);
        let newTime = time % 3600;
        let minutes = Math.floor(newTime / 60);
        let seconds = Math.floor(newTime % 60);
        hoursMinSecs = { hours, minutes, seconds };
    }
    if (calledFrom == "Explore") {
        return (
            <div className="options-class">
                <Text fontSize="4xl" fontWeight="600" casing="uppercase">
                    {name}
                </Text>
                <Text>
                    Owned by:&nbsp;&nbsp;
                    {owner || <Text display="inline">...</Text>}
                </Text>

                {sale === false ? (
                    <Text display="inline">
                        Auction Status:&nbsp;&nbsp;
                        <Text
                            display="inline"
                            fontSize="lg"
                            fontWeight="600"
                            color="red"
                        >
                            NOT FOR SALE
                        </Text>
                    </Text>
                ) : (
                    <>
                        <Text>Bids Placed: {totalBids}</Text>
                        <Text>
                            Current price: {(maxBid / 1e18).toFixed(5)}{" "}
                            <i className="fab fa-ethereum"></i>
                        </Text>
                        <Text className="link-styling">
                            Highest Bidder:&nbsp;
                            <Link
                                to={{
                                    pathname: "/explore",
                                    state: {
                                        addr: hBidder,
                                    },
                                }}
                                style={{
                                    color: "#4f46e5",
                                }}
                            >
                                {hBidder}
                            </Link>
                        </Text>
                        {time > 0 ? (
                            <>
                                <Text>
                                    Time Left:&nbsp;
                                    <CountDownTimer
                                        hoursMinSecs={hoursMinSecs}
                                        setTimeLeft={setTime}
                                        calledFrom="options"
                                    ></CountDownTimer>
                                </Text>
                                <BidModal itemId={tokenId}></BidModal>
                            </>
                        ) : (
                            <Text fontWeight="bold">
                                Bidding for this item has ended
                            </Text>
                        )}
                    </>
                )}
            </div>
        );
    }

    if (calledFrom == "Marketplace") {
        return (
            <div className="options-class">
                <Text fontSize="4xl" fontWeight="600" casing="uppercase">
                    {name}
                </Text>
                <Text className="link-styling">
                    Owned by:&nbsp;
                    <Link
                        to={{
                            pathname: "/explore",
                            state: {
                                addr: owner,
                            },
                        }}
                        style={{
                            color: "#4f46e5",
                        }}
                    >
                        {owner || <Text display="inline">...</Text>}
                    </Link>
                </Text>
                <Text>Bids Placed: {totalBids}</Text>
                <Text>
                    Current price: {(maxBid / 1e18).toFixed(5)}{" "}
                    <i className="fab fa-ethereum"></i>
                </Text>
                <Text className="link-styling">
                    Highest Bidder:&nbsp;
                    <Link
                        to={{
                            pathname: "/explore",
                            state: {
                                addr: hBidder,
                            },
                        }}
                        style={{
                            color: "#4f46e5",
                        }}
                    >
                        {hBidder}
                    </Link>
                </Text>
                {time > 0 ? (
                    <>
                        <Text>
                            Time Left:&nbsp;
                            <CountDownTimer
                                hoursMinSecs={hoursMinSecs}
                                setTimeLeft={setTime}
                                calledFrom="options"
                            ></CountDownTimer>
                        </Text>
                        <BidModal itemId={tokenId}></BidModal>
                    </>
                ) : (
                    <Text fontWeight="bold">
                        Bidding for this item has ended
                    </Text>
                )}
            </div>
        );
    }
};

export default Options;

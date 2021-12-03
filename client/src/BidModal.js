import React, { useState, useContext } from "react";
import { Text, Button, Input } from "@chakra-ui/react";
import { useMoralis } from "react-moralis";
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
import { InstanceContext } from "./App";

const Moralis = require("moralis");
const BidModal = ({ itemId }) => {
    const initialRef = React.useRef();
    const finalRef = React.useRef();
    const instance = useContext(InstanceContext);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();
    const { user } = useMoralis();
    async function startAuction() {
        if (!(amount > 0)) {
            toast({
                title: "Invalid bid amount!",
                status: "error",
                variant: "left-accent",
                duration: 3000,
                isClosable: false,
            });
            return;
        }

        try {
            setLoading(true);
            await instance.methods.bid(itemId).send({
                from: user.get("ethAddress"),
                value: Moralis.Units.ETH(amount),
            });
            toast({
                title: "Bid successful!",
                description:
                    "Your bid has been placed. Updates will take effect shortly",
                status: "success",
                variant: "left-accent",
                duration: 4000,
                isClosable: true,
            });
        } catch (e) {
            toast({
                title: "Bid failed!",
                description:
                    "Your bid could not be placed successfully. Please retry later",
                status: "error",
                variant: "left-accent",
                duration: 4000,
                isClosable: true,
            });
        }
        setLoading(false);
        onClose();
    }
    return (
        <>
            <Button colorScheme="blue" onClick={onOpen}>
                PLACE BID&nbsp;&nbsp;
                <i className="fas fa-credit-card"></i>
            </Button>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Place Bid</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Bid amount: </FormLabel>
                            <Input
                                ref={initialRef}
                                placeholder="Ether"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </FormControl>
                        <br />
                        <Text fontSize="0.7em" color="gray.500">
                            *Bid must be at least 0.001 ETH higher than the
                            current price. Amount will be refunded if you get
                            outbid.
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            width="100%"
                            isLoading={loading}
                            onClick={startAuction}
                        >
                            Bid
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default BidModal;

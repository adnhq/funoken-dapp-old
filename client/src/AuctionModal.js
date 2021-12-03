import React, { useState, useContext } from "react";
import { Text, Button, Input } from "@chakra-ui/react";
import { useMoralis } from "react-moralis";
import { useDisclosure } from "@chakra-ui/hooks";
import { useToast, Select } from "@chakra-ui/react";

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
const AuctionModal = ({ itemId, updateSuccess }) => {
    const initialRef = React.useRef();
    const finalRef = React.useRef();
    const instance = useContext(InstanceContext);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [choice, setChoice] = useState(1);

    const toast = useToast();
    const { user } = useMoralis();
    async function startAuction() {
        let time;
        if (!(amount > 0)) {
            toast({
                title: "Invalid reserve price!",
                status: "error",
                variant: "left-accent",
                duration: 3000,
                isClosable: false,
            });
            return;
        }
        switch (choice) {
            case "option1":
                time = 1;
                break;
            case "option2":
                time = 3;
                break;
            case "option3":
                time = 6;
                break;
            case "option4":
                time = 12;
                break;
            case "option5":
                time = 24;
                break;
            default:
                time = 1;
                break;
        }
        try {
            setLoading(true);
            await instance.methods
                .auction(itemId, Moralis.Units.ETH(amount), time)
                .send({ from: user.get("ethAddress") });
            toast({
                title: "Auction started! ",
                description:
                    "Item has been added to auction. Updates will take effect shortly",
                status: "success",
                variant: "left-accent",
                duration: 4000,
                isClosable: true,
            });
            updateSuccess();
        } catch (e) {
            toast({
                title: "Auction failed!",
                description: "Could not add item to auction. Please retry!",
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
            <Button
                bg="black"
                color="white"
                _hover={{ bg: "#6b6b6b" }}
                height="50px"
                onClick={onOpen}
                width="230px"
            >
                <i className="fas fa-gavel"></i>&nbsp; Auction
            </Button>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Start Auction</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Reserve price: </FormLabel>
                            <Input
                                ref={initialRef}
                                placeholder="Ether"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </FormControl>
                        <br />
                        <Select
                            placeholder="Select auction timespan"
                            isRequired
                            width="100%"
                            color="gray.500"
                            onChange={(e) => setChoice(e.target.value)}
                        >
                            <option value="option1">1 hour</option>
                            <option value="option2">3 hours</option>
                            <option value="option3">6 hours</option>
                            <option value="option4">12 hours</option>
                            <option value="option5">24 hours</option>
                        </Select>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            bg="black"
                            color="white"
                            _hover={{ bg: "#6b6b6b" }}
                            width="100%"
                            isLoading={loading}
                            onClick={startAuction}
                        >
                            Auction
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AuctionModal;

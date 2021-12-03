import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import {
    Input,
    Stack,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Button,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Collection from "./Collection";

const Explore = () => {
    const [address, setAddress] = useState("");
    const toast = useToast();
    const [show, setShow] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.addr) {
            setAddress(location.state.addr.toString());
            setShow(true);
        }
    }, []);
    function findAddress() {
        if (address.length != 42) {
            toast({
                title: "Invalid Address",
                status: "error",
                variant: "solid",
                duration: 3000,
                isClosable: false,
            });
            return;
        }
        setShow(true);
    }
    return (
        <div className="explore">
            <Navbar></Navbar>
            <div className="coll-container">
                <div className="search-bar">
                    <Stack
                        spacing={4}
                        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2)"
                        borderRadius="10px"
                    >
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents="none"
                                children={<SearchIcon color="gray.300" />}
                            />
                            <Input
                                placeholder="Enter address to view collection"
                                value={address}
                                onFocus={() => setShow(false)}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <InputRightElement width="5rem">
                                <Button
                                    bg="rgb(17, 24, 39)"
                                    color="white"
                                    _hover={{ bg: "#6b6b6b" }}
                                    onClick={findAddress}
                                >
                                    Search
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Stack>
                </div>
                {show && (
                    <Collection
                        user_address={address}
                        calledFrom="Explore"
                    ></Collection>
                )}
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Explore;

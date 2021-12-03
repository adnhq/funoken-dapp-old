import React from "react";
import { Button, Input } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { useDisclosure } from "@chakra-ui/hooks";
import "./index.css";

import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useMoralis, useMoralisFile } from "react-moralis";
import { useState, useEffect, useContext } from "react";
import { InstanceContext } from "./App";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Textarea,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
const TokenModal = () => {
    const { user } = useMoralis();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [file, setFile] = useState(null);
    const { saveFile } = useMoralisFile();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const instance = useContext(InstanceContext);
    const saveFileIPFS = async (f) => {
        const moralisFile = await saveFile(f.name, file, { saveIPFS: true });
        return moralisFile._ipfs;
    };
    async function uploadMetadata(imageUrl) {
        const metadata = {
            name,
            description,
            imageUrl,
        };

        const moralisFile = await saveFile(
            "data.json",
            { base64: btoa(JSON.stringify(metadata)) },
            { saveIPFS: true, throwOnError: true }
        );
        return moralisFile._ipfs;
    }

    const handleFinal = async () => {
        if (name == null || description == null || file == null) {
            toast({
                title: "All fields are required!",
                status: "error",
                duration: 3000,
                isClosable: false,
            });
            return;
        }
        setLoading(true);
        const image = await saveFileIPFS(file);
        const ipfsData = await uploadMetadata(image.toString());
        console.log(instance);
        try {
            await instance.methods
                .mintToken(ipfsData.toString())
                .send({ from: user.get("ethAddress") });
            toast({
                title: "Mint Successful!",
                description:
                    "NFT minted successfully. Your collection will be updated shortly",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (e) {
            toast({
                title: "Mint Failed!",
                description: "Could not mint new NFT. Please retry!",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setLoading(false);
        onClose();
    };

    return (
        <>
            <Button
                id="create-button"
                rightIcon={<AddIcon />}
                colorScheme="green"
                variant="outline"
                onClick={onOpen}
            >
                Create Token
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                initialFocusRef={initialRef}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Token</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                required
                                maxLength="20"
                                name="metaName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                ref={initialRef}
                                placeholder="Token name"
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                height="150px"
                                maxLength="200"
                                required
                                name="metaDescription"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Token description"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Image</FormLabel>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                name="fileInput"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            bg="rgb(17, 24, 39)"
                            color="white"
                            isLoading={loading}
                            _hover={{ bg: "#6b6b6b" }}
                            mr={3}
                            onClick={handleFinal}
                        >
                            Create
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TokenModal;

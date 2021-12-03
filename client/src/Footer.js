import React from "react";
import { Text, Button, Heading } from "@chakra-ui/react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
const Footer = () => {
    return (
        <div className="footer">
            <Heading id="footer-text">Funoken</Heading>
            <Text id="footer-desc">
                NFT Marketplace on Ropsten Test Network
            </Text>
            <div>
                <a
                    href="https://www.linkedin.com/in/sazinhaque/"
                    target="blank"
                >
                    <Button
                        colorScheme="teal"
                        marginRight="10px"
                        leftIcon={<FaLinkedin />}
                    >
                        LinkedIn
                    </Button>
                </a>
                <a href="https://github.com/sazinhaque" target="blank">
                    <Button
                        colorScheme="github"
                        variant="outline"
                        _hover={{ bg: "#4a4a4a" }}
                        leftIcon={<FaGithub />}
                    >
                        GitHub
                    </Button>
                </a>
                <a href="https://www.facebook.com/sazinhaque4/" target="blank">
                    <Button
                        colorScheme="facebook"
                        style={{ marginLeft: "10px" }}
                        leftIcon={<FaFacebook />}
                    >
                        Facebook
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default Footer;

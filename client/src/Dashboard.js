import React from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { useEffect, useState } from "react";
import { Text, Button, Heading } from "@chakra-ui/react";

const Dashboard = () => {
    const Web3Api = useMoralisWeb3Api();
    const { user } = useMoralis();
    const [balance, setBalance] = useState("...");
    const fetchBalance = async () => {
        const options = {
            chain: "ropsten",
            address: user.get("ethAddress"),
        };
        const result = await Web3Api.account.getNativeBalance(options);
        return result;
    };
    async function getBalance() {
        const result = await fetchBalance();
        setBalance((result.balance / 1e18).toFixed(5));
    }
    useEffect(() => {
        let isMounted = true;
        if (isMounted) getBalance();
        return () => {
            isMounted = false;
        };
    }, [user]);

    return (
        <div className="dash">
            <Text
                marginLeft="40px"
                marginTop="35px"
                fontSize="lg"
                fontFamily="'Nunito', sans-serif"
            >
                Welcome, {user.get("ethAddress")}
            </Text>
            <Text
                marginLeft="40px"
                marginTop="35px"
                fontFamily="'Nunito', sans-serif"
            >
                Current balance: {balance + "      "}
                <i className="fab fa-ethereum"></i>
            </Text>

            <a href="https://faucet.ropsten.be/" target="blank">
                <Button
                    variant="outline"
                    colorScheme="white"
                    _hover={{ bg: "#6b6b6b" }}
                    style={{ marginLeft: "40px", marginTop: "35px" }}
                >
                    Get Test Ether
                </Button>
            </a>
            <Heading id="title">Funoken</Heading>
        </div>
    );
};

export default Dashboard;

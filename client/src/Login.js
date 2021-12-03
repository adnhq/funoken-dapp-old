import "./index.css";
import { useMoralis } from "react-moralis";
import { Text, Button, Alert, AlertIcon, Heading } from "@chakra-ui/react";

function Login() {
    const { authenticate, isAuthenticating, authError } = useMoralis();
    return (
        <div className="login-dash">
            <Text
                style={{
                    marginLeft: "40px",
                    fontSize: "1.5rem",
                    marginTop: "40px",
                }}
            >
                Welcome to Funoken!
            </Text>
            <Text style={{ marginLeft: "40px", marginTop: "25px" }}>
                Please connect your MetaMask wallet to continue
            </Text>
            <Button
                bg="white"
                color="rgb(17, 24, 39)"
                isLoading={isAuthenticating}
                onClick={() => authenticate()}
                style={{ marginTop: "25px", marginLeft: "40px" }}
            >
                Connect Wallet
            </Button>
            <Heading id="title">Funoken</Heading>
            {authError && (
                <Alert
                    style={{ marginTop: "70px" }}
                    borderRadius="10px"
                    status="error"
                    variant="solid"
                >
                    <AlertIcon />
                    Failed to connect wallet! Please ensure that you are
                    connected to Ropsten Test Network and retry.
                </Alert>
            )}
        </div>
    );
}

export default Login;

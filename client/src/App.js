import FunokenContract from "./contracts/Funoken.json";
import "./index.css";
import { useMoralis } from "react-moralis";
import Home from "./Home";
import Login from "./Login";
import Marketplace from "./Marketplace";
import Explore from "./Explore";
import getWeb3 from "./getWeb3";
import { useState, useEffect } from "react";
import React, { createContext } from "react";

import { Switch, Route, Redirect } from "react-router-dom";

import MyAuctions from "./MyAuctions";
import Footer from "./Footer";
import ViewToken from "./ViewToken";
import Leaderboard from "./Leaderboard";
export const InstanceContext = createContext();
const App = () => {
    const { isAuthenticated, isAuthUndefined } = useMoralis();
    const [web3, setWeb3] = useState(null);
    const [instance, setInstance] = useState(null);
    async function loadContract() {
        const web3 = await getWeb3();
        setWeb3(web3);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FunokenContract.networks[networkId];
        const instance = new web3.eth.Contract(
            FunokenContract.abi,
            deployedNetwork && deployedNetwork.address
        );
        setInstance(instance);
    }
    useEffect(() => {
        loadContract();
    }, []);
    return (
        <InstanceContext.Provider value={instance}>
            {isAuthenticated ? (
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/marketplace">
                        <Marketplace />
                    </Route>
                    <Route exact path="/my-auctions">
                        <MyAuctions />
                    </Route>
                    <Route exact path="/explore">
                        <Explore />
                    </Route>
                    <Route exact path="/view-token">
                        <ViewToken />
                    </Route>
                    <Route exact path="/leaderboard">
                        <Leaderboard />
                    </Route>
                </Switch>
            ) : (
                <>
                    <div className="login-parent">
                        {!isAuthUndefined && <Redirect to="/"></Redirect>}
                        <Login></Login>
                    </div>
                    <Footer></Footer>
                </>
            )}
        </InstanceContext.Provider>
    );
};

export default App;

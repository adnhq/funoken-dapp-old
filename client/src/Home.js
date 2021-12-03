import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import Collection from "./Collection";
import React from "react";
import { useMoralis } from "react-moralis";
import Footer from "./Footer";

const Home = () => {
    const { user } = useMoralis();
    return (
        <div className="home">
            <Navbar></Navbar>
            <Dashboard></Dashboard>
            <Collection
                user_address={user.get("ethAddress")}
                calledFrom="Home"
            ></Collection>
            <Footer></Footer>
        </div>
    );
};

export default Home;

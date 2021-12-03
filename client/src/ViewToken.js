import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import TokenDetails from "./TokenDetails";

const ViewToken = () => {
    const location = useLocation();
    const { tokenId, name, description, imageUrl, calledFrom, user_address } =
        location.state;
    return (
        <div className="v-token">
            <Navbar></Navbar>
            <TokenDetails
                tokenId={tokenId}
                name={name}
                calledFrom={calledFrom}
                description={description}
                imageUrl={imageUrl}
                user_address={user_address}
            ></TokenDetails>
            <Footer></Footer>
        </div>
    );
};

export default ViewToken;

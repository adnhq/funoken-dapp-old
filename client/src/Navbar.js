import React from "react";
import { useMoralis } from "react-moralis";
import { NavLink } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import "./index.css";
const Navbar = () => {
    const { logout } = useMoralis();
    return (
        <div className="nav-parent">
            <nav>
                <ul className="navbar">
                    <li>
                        <NavLink exact to="/" activeClassName="nav-active">
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            exact
                            to="/marketplace"
                            activeClassName="nav-active"
                        >
                            Marketplace
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            exact
                            to="/my-auctions"
                            activeClassName="nav-active"
                        >
                            My Auctions
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            exact
                            to="/leaderboard"
                            activeClassName="nav-active"
                        >
                            Top Sellers
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            exact
                            to="/explore"
                            activeClassName="nav-active"
                        >
                            Explore
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <Button
                bg="rgb(17, 24, 39)"
                color="white"
                _hover={{ bg: "#6b6b6b" }}
                onClick={() => logout()}
            >
                Disconnect
            </Button>
        </div>
    );
};

export default Navbar;

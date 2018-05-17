import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "./axios";
import { Logo, Login } from "./welcome";
import { ProfilePic } from "./profile";
// import { UserMenu, UserMenuPopUp } from "./menus";
import { NamesToShow } from "./NamesToShow";

// import { OnlineUsers } from "./onlineUsers";
import MapContainer from "./mapcontainer";
import Chat from "./chat";

export class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userMenuIsVisible: false
        };
        this.toggleUserMenu = this.toggleUserMenu.bind(this);
        this.closeUserMenu = this.closeUserMenu.bind(this);
    }
    toggleUserMenu() {
        this.setState({
            userMenuIsVisible: !this.state.userMenuIsVisible
        });
    }
    closeUserMenu() {
        this.setState({
            userMenuIsVisible: false
        });
    }
    render() {
        let pic = this.props.profilepic || "/neo.png";
        return (
            <div className="navigationContainer">
                <div className="navigationIconBar">
                    <Link to="/map">
                        {" "}
                        <img
                            className="logoIconMenu"
                            src="/pinAppLogo.png"
                        />{" "}
                    </Link>
                    <NamesToShow id={this.props.id} />
                    <div className="navigationBarRight">
                        <Link to="/map">
                            {" "}
                            <img
                                src="/icons/mapWithPin.png"
                                className="navigationIcon"
                            />{" "}
                        </Link>
                        <Link to="/editProfile"> </Link>{" "}
                        <div className="navigationIconProfilepicCircle">
                            <img
                                src={pic}
                                className="navigationIconProfilepic"
                                onClick={this.toggleUserMenu}
                                onMouseEnter={this.toggleUserMenu}
                            />{" "}
                        </div>
                        {this.state.userMenuIsVisible && (
                            <UserMenuPopUp
                                id={this.props.id}
                                toggleUserMenu={this.toggleUserMenu}
                                closeUserMenu={this.closeUserMenu}
                                userMenuIsVisible={this.state.userMenuIsVisible}
                            />
                        )}
                        {/*<ProfilePic {...props} />*/}
                        {/*<ProfilePage {...props} />*/}
                        {/*<Link to="/user"> Hello {props.first}</Link>*/}
                        {/*<Link to="/onlineUsers"> Online </Link>*/}
                        {/*<Link to="/chat"> Chat </Link>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export class UserMenuPopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.closePopUp = this.closePopUp.bind(this);
    }

    closePopUp() {
        this.props.closeUserMenu();
    }

    render() {
        document.addEventListener("keydown", (e) => {
            if (e.keyCode == 27) {
                this.props.closeUserMenu();
            }
        });

        let pic = this.props.profilepic || "/neo.png";

        return (
            <React.Fragment>
                <div
                    id="overley"
                    onClick={(e) => {
                        this.props.closeUserMenu();
                        // e.stopPropagation();
                        // e.preventDefault();
                    }}
                />
                <div
                    className="dropDownMenu"
                    onMouseLeave={(e) => {
                        // this.props.closeUserMenu();
                        // e.stopPropagation();
                        // e.preventDefault();
                        console.log("running mouseleave");
                    }}
                >
                    <Link to="/friends" className="dropDownMenuItem">
                        {" "}
                        Friends{" "}
                    </Link>
                    <Link to="/" className="dropDownMenuItem">
                        {" "}
                        Profile{" "}
                    </Link>
                    {/* <div className="dropDownMenuItem"> Friends </div> */}
                    <a href="/logout" className="dropDownMenuItem">
                        {" "}
                        Logout{" "}
                    </a>
                    <NamesToShow id={this.props.id} />
                    {/* <button className="subtleButton" onClick={this.closePopUp}>
                        Cancel!{" "}
                    </button> */}
                </div>
            </React.Fragment>
        );
    }
}

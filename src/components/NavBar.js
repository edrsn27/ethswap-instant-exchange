import React, { Component } from "react";
import Identicon from "identicon.js";
class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          ETHSWAP
        </a>
        <ul className="nav navbar-nav ml-auto">
          <li className="nav-item text-secondary">
            {this.props.account}
            {this.props.account ? (
              <img
                src={`data:image/png;base64,${new Identicon(
                  this.props.account,
                  30
                ).toString()}`}
                alt="..."
                height={30}
                width={30}
              ></img>
            ) : (
              ""
            )}
          </li>
        </ul>
      </nav>
    );
  }
}

export default NavBar;

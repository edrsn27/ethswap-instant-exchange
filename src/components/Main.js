import React, { Component } from "react";

import BuyForm from "./BuyForm";
import SellForm from "./SellForm";
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "0",
      form: "buy",
    };
  }

  render() {
    let content;
    if (this.state.form === "buy") {
      content = (
        <BuyForm
          ethBalance={this.props.ethBalance}
          tokenBalance={this.props.tokenBalance}
          buyTokens={this.props.buyTokens}
        />
      );
    } else if (this.state.form === "sell") {
      content = (
        <SellForm
          ethBalance={this.props.ethBalance}
          tokenBalance={this.props.tokenBalance}
          sellTokens={this.props.sellTokens}
        />
      );
    }
    return (
      <div id="content">
        <div className="card mb-4">
          <div className="card-body">
            <button
              type="button"
              class="btn btn-primary"
              onClick={(event) => {
                this.setState({ form: "buy" });
              }}
            >
              Buy
            </button>
            <button
              type="button"
              class="btn btn-secondary float-right"
              onClick={(event) => {
                this.setState({ form: "sell" });
              }}
            >
              Sell
            </button>
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;

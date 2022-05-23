import "./App.css";
import React from "react";
import lottery from './lottery';
import web3 from './web3';

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (evt) => {
    evt.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on picking a winner...'});

    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });
  
      this.setState({ message: 'You have been entered!'});
    } catch (e) {
      this.setState({ message: 'There was an error!'});
      console.log(e);
    }
  };

  onClick = async (evt) => {
    evt.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on picking a winnter...'});

    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
  
      this.setState({ message: 'Winner picked'});
    } catch (e) {
      this.setState({ message: 'There was an error picking a winner!'});
      console.log(e);
    }
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>

        <p>This contract is managed by {this.state.manager}</p>

        <p>There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')}</p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value})}
            />
          </div>
          <button type="submit">Enter</button>
        </form>

        <hr />

        <form onSubmit={this.onClick}>
          <h4>Time to pick a winner?</h4>
          <button type="submit">Pick winner</button>
        </form>

        <hr />

        <p>{this.state.message}</p>
      </div>
    );
  }
}
export default App;

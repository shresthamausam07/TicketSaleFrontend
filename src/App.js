import React, { useEffect, useState } from "react";
import web3 from "./web3";
import ticketSale from "./ticketSale";
import "./App.css";

const App = () => {
  const [account, setAccount] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [swapTicketId, setSwapTicketId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [ticketPrice, setTicketPrice] = useState(""); // Ticket price in Ether
  const [totalTickets, setTotalTickets] = useState(0); // Total number of tickets

  useEffect(() => {
    const init = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        // Fetch ticket price and total tickets from the contract
        const price = await ticketSale.methods.ticketPrice().call();
        const total = await ticketSale.methods.maxTickets().call();

        setTicketPrice(web3.utils.fromWei(price.toString(), "ether"));
        setTotalTickets(total);
      } catch (error) {
        window.alert("Error fetching contract data: " + error.message);
      }
    };

    init();
  }, []);

  const buyTicket = async () => {
    try {
      console.log("Attempting to purchase ticket with ID:", ticketId);
      await ticketSale.methods.buyTicket(ticketId).send({
        from: account,
        value: web3.utils.toWei(ticketPrice, "ether"),
      });
      window.alert("Ticket purchased successfully!");
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      window.alert("Error: " + error.message);
    }
  };

  const offerSwap = async () => {
    try {
      if (!swapTicketId) {
        window.alert("Please enter a valid ticket ID to swap.");
        return;
      }
      console.log("Attempting to offer swap for ticket ID:", swapTicketId);
      await ticketSale.methods.offerSwap(swapTicketId).send({ from: account });
      window.alert("Swap offer sent!");
    } catch (error) {
      console.error("Error offering swap:", error);
      window.alert("Error: " + error.message);
    }
  };

  const acceptSwap = async () => {
    try {
      if (!swapTicketId) {
        window.alert("Please enter a valid ticket ID to accept.");
        return;
      }
      console.log("Attempting to accept swap for ticket ID:", swapTicketId);
      await ticketSale.methods.acceptSwap(swapTicketId).send({ from: account });
      window.alert("Swap completed!");
    } catch (error) {
      console.error("Error accepting swap:", error);
      window.alert("Error: " + error.message);
    }
  };

  const getTicketNumber = async () => {
    try {
      console.log("Fetching ticket number for wallet address:", walletAddress);
      const ticket = await ticketSale.methods.getTicketOf(walletAddress).call();
      window.alert(`Your Ticket ID is: ${ticket}`);
    } catch (error) {
      console.error("Error fetching ticket number:", error);
      window.alert("Error: " + error.message);
    }
  };

  const returnTicket = async () => {
    try {
      console.log("Attempting to return ticket for account:", account);
      await ticketSale.methods.returnTicket().send({ from: account });
      window.alert("Ticket returned successfully!");
    } catch (error) {
      console.error("Error returning ticket:", error);
      window.alert("Error: " + error.message);
    }
  };

  return (
    <div className="app-container">
      <h1>Ticket Sale</h1>
      <p>Connected Account: {account}</p>
      <div className="ticket-info">
        <p>
          <strong>Total Tickets Available:</strong> {totalTickets}
        </p>
        <p>
          <strong>Price per Ticket:</strong> {ticketPrice} ETH
        </p>
      </div>
      <div className="grid-container">
        <div className="card">
          <h3>Purchase Ticket</h3>
          <input
            type="text"
            placeholder="Enter Ticket ID"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
          />
          <button onClick={buyTicket}>Buy Ticket</button>
        </div>
        <div className="card">
          <h3>Offer Swap</h3>
          <input
            type="text"
            placeholder="Enter Ticket ID to Swap"
            value={swapTicketId}
            onChange={(e) => setSwapTicketId(e.target.value)}
          />
          <button onClick={offerSwap}>Offer Swap</button>
        </div>
        <div className="card">
          <h3>Accept Offer</h3>
          <input
            type="text"
            placeholder="Enter Ticket ID to Accept Swap"
            value={swapTicketId}
            onChange={(e) => setSwapTicketId(e.target.value)}
          />
          <button onClick={acceptSwap}>Accept Swap</button>
        </div>
        <div className="card">
          <h3>Get Ticket Number</h3>
          <input
            type="text"
            placeholder="Enter Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <button onClick={getTicketNumber}>Get Ticket Number</button>
        </div>
        <div className="card">
          <h3>Return Ticket</h3>
          <button onClick={returnTicket}>Return Ticket</button>
        </div>
      </div>
    </div>
  );
};

export default App;

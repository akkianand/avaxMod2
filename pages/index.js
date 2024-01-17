import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/FundManagementContract.sol/FundManagementContract.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [showContractAddress, setShowContractAddress] = useState(false);

  const contractAddress = "0xBdC2b3F8C5bcD545d9cbC676e3F9E25720700083";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      try {
        const balance = await atm.getBalance();
        setBalance(balance.toNumber());
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deposit = async () => {
    if (atm) {
      try {
        let tx = await atm.depositFunds(1);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdrawFunds(1);
      await tx.wait();
      getBalance();
    }
  };

  const buyNFT = async () => {
    if (atm) {
      try {
        let tx = await atm.purchaseNFT(1);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleContractAddress = () => {
    setShowContractAddress(
      (prevShowContractAddress) => !prevShowContractAddress
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (atm) {
      getBalance();
    }
  }, [atm]);

  return (
    <main className="container">
      <header>
        <h1>AVAX Module 2 Project </h1>
      </header>
      <div className="content">
        {!account ? (
          <button onClick={connectAccount}>Connect MetaMask wallet</button>
        ) : (
          <>
            <p>Your Account: {account}</p>
            <div className="button-group">
              <button onClick={toggleContractAddress}>
                {showContractAddress
                  ? "Hide Contract Address"
                  : "Show Contract Address"}
              </button>
              {showContractAddress && (
                <div>
                  <p>Contract Address: {contractAddress}</p>
                </div>
              )}
              <button onClick={deposit}>Deposit Token</button>
              <button onClick={withdraw}>Withdraw Token</button>
              <button onClick={buyNFT}>Buy NFT</button>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        * {
          padding: 0;
          margin: 0;
        }

        .container {
          text-align: center;
          padding-top: 4em;
          font-family: "Helvetica", sans-serif;
          background-color: #282c34;
          width: 100vw;
          height: 100vh;
          color: #61dafb;
          font-size: 1.3rem;
        }

        h1 {
          color: #ff69b4;
        }

        header {
          margin-bottom: 20px;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .button-group {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1em;
        }

        button {
          display: block;
          margin-bottom: 10px;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #61dafb;
          color: #282c34;
          border: none;
          cursor: pointer;
          border-radius: 0.4em;
          width: 20vw;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #2196f3;
        }
      `}</style>
    </main>
  );
}

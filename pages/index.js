import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import fundAtm_abi from "../artifacts/contracts/FundManagementContract.sol/FundManagementContract.json";

export default function HomePage() {
  const [ethWallet, setYourEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [fundAtm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [showContractAddress, setShowContractAddress] = useState(false);

  const contractAddress = "0xBdC2b3F8C5bcD545d9cbC676e3F9E25720700083";
  const atmABI = fundAtm_abi.abi;

  const getYourWallet = async () => {
    if (window.ethereum) {
      setYourEthWallet(window.ethereum);
    }
    if (!ethWallet) return;

    const acc = await ethWallet.request({ method: "eth_accounts" });
    handleAcc(acc);
  };

  const handleAcc = (acc) => {
    if (acc && acc?.length >= 1) {
      setAccount(acc[0]);
    } else {
      console.log("Doesn't got any account");
    }
  };

  const connectWalletAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const acc = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAcc(acc);
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (fundAtm) {
      try {
        const balance = await fundAtm.getBalance();
        setBalance(balance.toNumber());
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deposit = async () => {
    if (fundAtm) {
      try {
        let tx = await fundAtm.depositFunds(1);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const withdrawToken = async () => {
    if (!fundAtm) return;
    try {
      let tx = await fundAtm.withdrawFunds(1);
      await tx.wait();
      getBalance();
    } catch (error) {}
  };

  const buyNftToken = async () => {
    if (!fundAtm) return;
    try {
      let tx = await fundAtm.purchaseNFT(1);
      await tx.wait();
      getBalance();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleContractAddress = () => {
    setShowContractAddress(
      (prevShowContractAddress) => !prevShowContractAddress
    );
  };

  useEffect(() => {
    getYourWallet();
  }, []);

  useEffect(() => {
    if (fundAtm) {
      getBalance();
    }
  }, [fundAtm]);

  return (
    <main className="container">
      <header>
        <h1>AVAX Module 2 Project </h1>
      </header>
      <div className="content">
        {!account ? (
          <button onClick={connectWalletAccount}>
            Connect MetaMask wallet
          </button>
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
              <button onClick={withdrawToken}>withdraw Token</button>
              <button onClick={buyNftToken}>Buy NFT</button>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        * {
          padding: 0.5em;
          margin: 0.5em;
        }

        header {
          margin-top : 1em
          margin-bottom: 2em;
        }
           h1 {
          color: #fg78b4;
          font-size:2rem;
        }

        .container {
          text-align: center;
          font-family: "Helvetica", sans-serif;
          background-color: #193c34;
          font-size: 1.3rem;
          width: 99vw;
          padding-top: 3.85em;
          height: 99vh;
          color: #61dafb;
        }

        .button-group {
          margin-top: 3em;
          gap: 1.2em;
          display: flex;
          align-items: center;
          flex-direction: column;
          margin-bottom:0.5em;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }


        button {
          display: block;
          margin-bottom: 10px;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 0.4em;
          font-size: 1.3rem;
          background-color: #61dafb;
          color: #282c34;
          width: 20vw;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #2296g4;
          border:2px solid ; 
        }
      `}</style>
    </main>
  );
}

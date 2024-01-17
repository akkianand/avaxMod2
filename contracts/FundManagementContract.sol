// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import "hardhat/console.sol";

contract FundManagementContract {
    address payable public walletOwnerAddress;
    uint256 public walletBalanceAmount;

    event NFTPurchased(uint256 number);
    event FundsWithdrawn(uint256 amount);
    event FundsDeposited(uint256 amount);

    error InsufficientFunds(uint256 balance, uint256 withdrawAmount);

    constructor(uint initialAmount) payable {
        walletOwnerAddress = payable(msg.sender);
        walletBalanceAmount = initialAmount;
    }

    function getBalance() public view returns (uint256) {
        return walletBalanceAmount;
    }

    function depositFunds(uint256 depositAmount) public payable {
        uint256 previousBalance = walletBalanceAmount;
        require(msg.sender == walletOwnerAddress, "You do not own the wallet");

        walletBalanceAmount += depositAmount;
        assert(walletBalanceAmount == previousBalance + depositAmount);

        emit FundsDeposited(depositAmount);
    }

    function withdrawFunds(uint256 withdrawAmount) public {
        require(msg.sender == walletOwnerAddress, "You do not own the wallet");
        uint256 previousBalance = walletBalanceAmount;

        if (walletBalanceAmount < withdrawAmount) {
            revert InsufficientFunds({
                balance: walletBalanceAmount,
                withdrawAmount: withdrawAmount
            });
        }

        walletBalanceAmount -= withdrawAmount;
        assert(walletBalanceAmount == (previousBalance - withdrawAmount));

        emit FundsWithdrawn(withdrawAmount);
    }

    function getWalletAddress() public view returns (address) {
        return address(this);
    }

    function getWalletBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function purchaseNFT(uint256 number) public {
        withdrawFunds(number);

        emit NFTPurchased(number);
    }
}

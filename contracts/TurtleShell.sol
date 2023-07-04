// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "hardhat/console.sol";

/// @title TurtleShell - Firewall implementation, tracks Total Value Locked (TVL) for protocols
/// @notice This contract allows protocols to track their TVL and set security parameters.
/// Protocol can increase or decrease their TVL and set a threshold and a number of blocks as security parameters.
/// Protocol can then check the firewall status to check if its TVL has decreased more than its set threshold since a set number of blocks ago.
contract TurtleShell {
  struct ProtocolData {
    uint256 currentTVL;
    uint256 treshold;
    uint8 numberOfBlocks;
    mapping(uint => uint256) pastTVLs;
  }

  mapping(address => ProtocolData) private protocolData;

  event TVLChanged(address indexed protocol, uint256 currentTVL);
  event FirewallTriggered(address indexed protocol);

  /// @notice Decrease the TVL for the calling protocol by a given amount
  /// @param amount The amount to decrease the TVL by
  function decreaseTVL(uint256 amount) external {
    ProtocolData storage pData = protocolData[msg.sender];
    pData.currentTVL -= amount;
    pData.pastTVLs[block.number] = pData.currentTVL;
    console.log("decreaseTVL block.number: %s", block.number);

    emit TVLChanged(msg.sender, pData.currentTVL);
  }

  /// @notice Increase the TVL for the calling protocol by a given amount
  /// @param amount The amount to increase the TVL by
  function increaseTVL(uint256 amount) external {
    ProtocolData storage pData = protocolData[msg.sender];
    pData.currentTVL += amount;
    pData.pastTVLs[block.number] = pData.currentTVL;
    console.log("increaseTVL block.number: %s", block.number);

    emit TVLChanged(msg.sender, pData.currentTVL);
  }

  /// @notice Set security parameters for the calling protocol
  /// @param treshold The threshold as a percentage (represented as an integer)
  /// @param numberOfBlocks The number of blocks to use for checking the threshold
  function setSecurityParameter(uint256 treshold, uint8 numberOfBlocks) external {
    ProtocolData storage pData = protocolData[msg.sender];
    pData.treshold = treshold;
    pData.numberOfBlocks = numberOfBlocks;
  }

  /// @notice Check if the firewall is active: the firewall is trigerred when the TVL has decreased more than the set threshold since a set number of blocks ago
  /// @return Returns true if the TVL has decreased more than the threshold, false otherwise
  function getFirewallStatus() external returns (bool) {
    ProtocolData storage pData = protocolData[msg.sender];
    uint256 blockToCheck = block.number - pData.numberOfBlocks;
    console.log("block.number: %s", block.number);
    console.log("Block to check: %s", blockToCheck);

    require(pData.pastTVLs[blockToCheck] > 0, "Insufficient historical data");

    uint256 pastTVL = pData.pastTVLs[blockToCheck];
    uint256 tresholdAmount = (pastTVL * pData.treshold) / 100;
    bool isTriggered = pastTVL - pData.currentTVL >= tresholdAmount;

    console.log("pastTVL: %s", pastTVL);
    console.log("currentTVL: %s", pData.currentTVL);
    console.log("tresholdAmount: %s", tresholdAmount);
    console.log("isTriggered: %s", isTriggered);

    if (isTriggered) {
      emit FirewallTriggered(msg.sender);
    }

    return isTriggered;
  }

  /// @notice Get the current TVL for a given protocol
  /// @param protocol The address of the protocol to get the TVL for
  /// @return Returns the current TVL of the protocol
  function getProtocolTVL(address protocol) external view returns (uint256) {
    ProtocolData storage pData = protocolData[protocol];
    return pData.currentTVL;
  }

  /// @notice Get the security parameters for a given protocol
  /// @param protocol The address of the protocol to get the security parameters for
  /// @return Returns the threshold and number of blocks set as security parameters for the protocol
  function getSecurityParameters(address protocol) external view returns (uint256, uint8) {
    ProtocolData storage pData = protocolData[protocol];
    return (pData.treshold, pData.numberOfBlocks);
  }
}

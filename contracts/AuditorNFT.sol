// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract AuditorNFT {
    // STORAGE
    // address of the SmartContractNFT contract (to update array)

    struct AuditorData {
        uint8 reputationScore; // 0 to 100
        // TODO: implement audit data struct
    }

    // EVENTS
    event MintAuditorNFT(address auditor);

    // FUNCTIONS
    function mint() external {}
}

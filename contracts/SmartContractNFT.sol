// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// TODO: Create second version which stores security data on IPFS
contract SmartContractNFT {
    // STORAGE
    // struct for the Audit Security JSON
    struct AuditSecurityData {
        address auditor;
        // keccak256 of the contract name keccak("flashloan")
        bytes32 contractType;
    }
    // struct for the Contract Security JSON
    struct ContractSecurityData {
        address contractAddress;
        bytes32 contractType;
        uint8 score;
    }
    // address of the Auditor NFT contract (to update array)

    mapping(address contractAddress => AuditSecurityData[])
        private s_contractAudits;

    mapping(address contractAddress => ContractSecurityData)
        private s_contractSecurity;

    // EVENTS
    event MintSmartContractNFT(
        address auditor,
        address contractAddress,
        AuditSecurityData securityData
    );

    modifier onlyAuditor() {
        // check if has auditor NFT, revert otherwise

        _;
    }

    // FUNCTIONS
    // computeSecurityData internal
    function _computeSecurityData(address contractAddress) internal {
        // get Auditor NFT
        // loop through the array of AuditSecurityData
        AuditSecurityData[] memory audits = s_contractAudits[contractAddress];
        bytes32 contractType = s_contractSecurity[contractAddress].contractType;
        uint8 currentMaximumReputation = 0;
        for (uint256 i = 0; i < audits.length; i++) {
            // get the reputation score
            // update currentMaximumReputation if the reputationScore is higher
            // add repuationScore to the total
        }

        // divide absolute amount by length of audits (is average)

        s_contractSecurity[contractAddress] = ContractSecurityData(
            contractAddress,
            contractType,
            100 // put final average here
        );
    }

    // mint(contractAddress, securityJSON)
    function mint(
        address contractAddress,
        AuditSecurityData calldata newSecurityData
    ) external onlyAuditor {
        s_contractAudits[contractAddress].push(newSecurityData);

        _computeSecurityData(contractAddress);

        // update tokenIds
        // call ERC721 mint

        emit MintSmartContractNFT(msg.sender, contractAddress, newSecurityData);
    }

    // getContractSecurity(contractAddress) returns (uint8 score)
    function getContractSecurity(
        address contractAddress
    ) external view returns (ContractSecurityData memory) {
        return s_contractSecurity[contractAddress];
    }
}

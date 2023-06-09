// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./SmartContractNFT.sol";

contract AuditorNFT {
  // STORAGE

  struct AuditorData {
    uint8 reputationScore; // 0 to 100
    // array of audited SmartContractNFT
    SmartContractNFT[] auditedContracts;
  }

  mapping(address auditor => AuditorData) private s_auditorData;

  // EVENTS
  event MintAuditorNFT(address auditor);

  // FUNCTIONS
  function mint(address auditor) external {
    AuditorData memory auditorData = s_auditorData[auditor];
    auditorData.reputationScore = 50; //TODO: remove mock and get the reputation score when AuditorSBT is implemented
    s_auditorData[auditor] = auditorData;

    emit MintAuditorNFT(auditor);
  }

  function addAuditedContract(address auditor, SmartContractNFT contractAddress) external {
    // TODO: implement reputation algorithm
    s_auditorData[auditor].auditedContracts.push(contractAddress);
  }

  function getAuditorData(address auditor) external view returns (AuditorData memory) {
    return s_auditorData[auditor];
  }
}

const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { constants } = require("../../helper-hardhat-config")

if (!constants.developmentChains.includes(network.name)) {
  describe.skip
} else {
  describe("SmartContractNFT", () => {
    let deployer, user1, user2

    beforeEach(async () => {
      await deployments.fixture(["all"])
      deployer = (await getNamedAccounts()).deployer
      provider = ethers.provider

      smartContractNFT = await ethers.getContract("SmartContractNFT", deployer)
      auditorNFT = await ethers.getContract("AuditorNFT", deployer)
      user1 = (await getNamedAccounts()).user1
      user2 = (await getNamedAccounts()).user2
    })

    describe("mint", () => {
      context("with a valid smart contract Audit", () => {
        it("should add newAuditSecurityData to the list of audits", async () => {
          const fakeContractAddress = "0x000000000000000000000000000000000000dEaD"
          const newAuditSecurityData = {
            auditor: user1,
            contractType: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("flashloan")),
          }

          await smartContractNFT.mint(fakeContractAddress, newAuditSecurityData)

          const contractSecurityData = await smartContractNFT.getContractSecurity(fakeContractAddress)

          expect(contractSecurityData.contractAddress).to.equal(fakeContractAddress)
          expect(contractSecurityData.score).to.equal(50)
          expect(contractSecurityData.contractType).to.equal(newAuditSecurityData.contractType)
        })
      })
    })
  })
}

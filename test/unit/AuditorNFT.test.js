const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { constants } = require("../../helper-hardhat-config")

if (!constants.developmentChains.includes(network.name)) {
  describe.skip
} else {
  describe("AuditorNFT", function () {
    let auditorNFT, smartContractNFT, deployer, auditor1, auditor2, fakeContractAddress

    beforeEach(async function () {
      await deployments.fixture(["all"])
      deployer = (await getNamedAccounts()).deployer
      provider = ethers.provider

      auditorNFT = await ethers.getContract("AuditorNFT", deployer)
      smartContractNFT = await ethers.getContract("SmartContractNFT", deployer)
      auditor1 = (await getNamedAccounts()).user1
      auditor2 = (await getNamedAccounts()).user2
      fakeContractAddress = "0x000000000000000000000000000000000000dEaD"
    })

    describe("mint", function () {
      it("should set AuditorData for auditor", async function () {
        await auditorNFT.mint(auditor1)

        const auditorData = await auditorNFT.getAuditorData(auditor1)

        expect(auditorData.reputationScore).to.equal(50)
        expect(auditorData.auditedContracts).to.deep.equal([])
      })
    })
  })
}

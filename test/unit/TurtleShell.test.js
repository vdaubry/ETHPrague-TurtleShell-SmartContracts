const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { constants } = require("../../helper-hardhat-config")
const { time } = require("@nomicfoundation/hardhat-network-helpers")

if (!constants.developmentChains.includes(network.name)) {
  describe.skip
} else {
  describe("TurtleShell", function () {
    let turtleShell, deployer, protocol, connectedTurtleShell

    beforeEach(async function () {
      await deployments.fixture(["all"])
      deployer = (await getNamedAccounts()).deployer
      protocol = (await getNamedAccounts()).user1
      turtleShell = await ethers.getContract("TurtleShell", deployer)
      const signer = await ethers.getSigner(protocol)
      connectedTurtleShell = await turtleShell.connect(signer)
    })

    describe("increaseTVL and decreaseTVL", function () {
      it("should correctly increase and decrease the TVL for a protocol", async function () {
        await connectedTurtleShell.increaseTVL(100)
        let tvl = await turtleShell.getProtocolTVL(protocol)
        expect(tvl).to.equal(100)

        await connectedTurtleShell.decreaseTVL(50)
        tvl = await turtleShell.getProtocolTVL(protocol)
        expect(tvl).to.equal(50)
      })
    })

    describe("setSecurityParameter", function () {
      it("should correctly set the security parameters for a protocol", async function () {
        await connectedTurtleShell.setSecurityParameter(10, 5)
        const [threshold, numOfBlocks] = await turtleShell.getSecurityParameters(protocol)
        expect(threshold).to.equal(10)
        expect(numOfBlocks).to.equal(5)
      })
    })

    describe.only("getFirewallStatus", function () {
      it("should return true if TVL has decreased more than the threshold since numOfBlocks ago", async function () {
        await connectedTurtleShell.increaseTVL(100)
        await connectedTurtleShell.setSecurityParameter(10, 1)

        await ethers.provider.send("evm_mine")

        await connectedTurtleShell.decreaseTVL(15)

        const status = await connectedTurtleShell.getFirewallStatus()
        expect(status).to.equal(true)
      })
    })
  })
}

const { expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, constants } = require("../../helper-hardhat-config")

const chainId = network.config.chainId
const contractConfig = networkConfig[chainId].contracts.Contract
const contractName = contractConfig.name

const testContracts = networkConfig[chainId].forTests

!constants.developmentChains.includes(network.name)
    ? describe.skip
    : describe(contractName, () => {
          let contract, deployer

          beforeEach(async () => {
              deployer = await ethers.getSigner((await getNamedAccounts()).deployer)
              await deployments.fixture(["forTests", "Contract"])
              contract = await ethers.getContract(contractName, deployer.address)
          })

          describe("constructor", () => {
              it("", async () => {})
          })
      })

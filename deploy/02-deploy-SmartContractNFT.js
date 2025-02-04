const { networkConfig, constants } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/deployment/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  const isDevelopmentChain = constants.developmentChains.includes(network.name)
  const waitBlockConfirmations = isDevelopmentChain ? 1 : network.config.blockConfirmations
  const contractName = "SmartContractNFT"
  const auditorNFT = await ethers.getContract("AuditorNFT", deployer)

  log(`Deploying ${contractName}`)
  const constructorArguments = [auditorNFT.address]
  const deployedContract = await deploy(contractName, {
    from: deployer,
    args: constructorArguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })
  log(`${contractName} (${deployedContract.address}) deployed)`)

  if (!isDevelopmentChain && process.env.EXPLORER_API_KEY) {
    await verify(deployedContract.address, constructorArguments, network.name)
  }

  log("------------------------------")
}

module.exports.tags = ["all", "SmartContractNFT"]

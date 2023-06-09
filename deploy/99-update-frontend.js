require("dotenv").config()
const { ethers, network } = require("hardhat")
const { constants, networkConfig } = require("../helper-hardhat-config")
const fs = require("fs")
const path = require("path")

module.exports = async () => {
	// if (process.env.UPDATE_FRONTEND) {
	//     const chainId = network.config.chainId.toString()
	//     const contractName = networkConfig[chainId].contracts.Contract.name
	//     const names = [contractName]
	//     for (let i = 0; i < names.length; i++) {
	//         await createFilesIfNecessary(names[i])
	//         await updateAbi(names[i])
	//         await updateContractAddresses(chainId.toString(), names[i])
	//     }
	//     console.log("Frontend Application has been fed with the newest data")
	// }
}

const createFilesIfNecessary = async (contractName) => {
	const contractFolderPath = path.join(constants.FRONTEND_FILE_PATH, contractName)
	const abiFilePath = path.join(contractFolderPath, "abi.json")
	const addressesFilePath = path.join(contractFolderPath, "addresses.json")
	const indexFilePath = path.join(contractFolderPath, "index.js")

	if (!fs.existsSync(contractFolderPath)) {
		fs.mkdirSync(contractFolderPath)
	}
	if (!fs.existsSync(abiFilePath)) {
		fs.writeFileSync(abiFilePath, JSON.stringify({}))
	}
	if (!fs.existsSync(addressesFilePath)) {
		fs.writeFileSync(addressesFilePath, JSON.stringify({}))
	}

	if (!fs.existsSync(indexFilePath)) {
		const indexCode = `
            const addresses = require("./addresses.json")
            const abi = require("./abi.json")
            
            module.exports = {
                abi,
                addresses,
            }
        `

		fs.writeFileSync(indexFilePath, indexCode)
	}
}

// TODO: fetch abi data from artifacts
const updateAbi = async (contractName) => {
	// const contract = await ethers.getContract(contractName)
	// const filePath = path.join(constants.FRONTEND_FILE_PATH, contractName, "abi.json")
	// fs.writeFileSync(filePath, contract.interface.format(ethers.utils.FormatTypes.json))
}

const updateContractAddresses = async (chainIdString, contractName) => {
	const contract = await ethers.getContract(contractName)
	const filePath = path.join(constants.FRONTEND_FILE_PATH, contractName, "addresses.json")
	const currentAddresses = JSON.parse(fs.readFileSync(filePath, "utf8"))
	currentAddresses[chainIdString] = [contract.address]
	fs.writeFileSync(filePath, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "UpdateFrontend"]

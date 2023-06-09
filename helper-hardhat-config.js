const { ethers } = require("hardhat")

const constants = {
	developmentChains: ["hardhat", "localhost"],
	testNetChains: ["mumbai"],
	NULL_ADDRESS: ethers.constants.AddressZero,
	FRONTEND_FILE_PATH: "",
}

const scriptsConfig = {}

const contractsConfig = {}
const networkConfig = {
	137: {
		name: "polygon",
		contracts: contractsConfig,
	},
	80001: {
		name: "mumbai",
		contracts: contractsConfig,
		forTests: [],
	},
	31337: {
		name: "hardhat",
		contracts: contractsConfig,
		forTests: [{ name: "", args: [] }],
	},
}

module.exports = {
	constants,
	scriptsConfig,
	networkConfig,
}

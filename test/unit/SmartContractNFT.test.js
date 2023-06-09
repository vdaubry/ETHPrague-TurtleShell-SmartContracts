const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { constants } = require("../../helper-hardhat-config")

if (!constants.developmentChains.includes(network.name)) {
	describe.skip
} else {
	describe("SmartContractNFT", () => {
		let deployer

		beforeEach(async () => {
			await deployments.fixture(["all"])
			deployer = (await getNamedAccounts()).deployer
			provider = ethers.provider

			smartContractNFT = await ethers.getContract("SmartContractNFT", deployer)
			auditorNFT = await ethers.getContract("AuditorNFT", deployer)
		})

		describe("mint", () => {
			context("with a valid smart contract Audit", () => {
				it("should add newAuditSecurityData to the list of audits", async () => {
					const newAuditSecurityData = {
						auditId: 1,
						auditResult: true,
						auditResultHash: "0x1234",
						auditResultHashSignature: "0x5678",
					}

					await smartContractNFT.mint(newAuditSecurityData)

					const auditSecurityData = await smartContractNFT.auditSecurityData(0)

					expect(auditSecurityData.auditId).to.equal(newAuditSecurityData.auditId)
					expect(auditSecurityData.auditResult).to.equal(newAuditSecurityData.auditResult)
					expect(auditSecurityData.auditResultHash).to.equal(newAuditSecurityData.auditResultHash)
					expect(auditSecurityData.auditResultHashSignature).to.equal(
						newAuditSecurityData.auditResultHashSignature
					)
				})
			})
		})
	})
}

const Voting = artifacts.require("Voting");

// module.exports = (deployer) => {
//     // Deployer le smart contract!
//     deployer.deploy(SimpleStorage, 6);
// } 

module.exports =  async (deployer) => {
    // Deployer le smart contract!
    await deployer.deploy(Voting);
    // let instance = await Voting.deployed();
    // console.log(await instance.getVoter());
} 
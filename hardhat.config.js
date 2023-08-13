require('@nomicfoundation/hardhat-toolbox')
const keys = require('./keys.json')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.19',
  networks: {
    polygon_mumbai: {
      url: keys.RPC_URL,
      accounts: [
        `0x${keys.PRIVATE_KEY}`
      ]
    }
  }
}

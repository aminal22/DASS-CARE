require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:{
    ganache:{
     url : ' http://127.0.0.1:8545',
     accounts : ['0x3cea25807add97a76da83ef1f500c9b686d493c176629b7b109f2acfca1d1fb4','0xae7ccd129119b7cbbe7d02fea16ebfdad517e8fb119dfcbeb00bf00db25779a3']
  }
  }
};

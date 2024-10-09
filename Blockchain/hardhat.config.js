
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.11",
 networks:{
  ganache:{
   url : ' http://127.0.0.1:8545',
   accounts : ['0x10779d4fff4368ce4d485a671d7cedd301e89af9a345f2b0e806ea476fa824de','0x446a1f5b92e3d1c91a5f6ad1a0800591e7043782132ab8b668a08697646f03e2']
}
}
};

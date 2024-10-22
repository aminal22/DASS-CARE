
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
 networks:{
  ganache:{
   url : ' http://127.0.0.1:8545',
   accounts : ['0x62509150790269b66a01753af7d0a561e3fbf5d5aa1315f50130f9751208141f','0xabebc5f9fd4a17d089baa7a9bf9892214dacc9f6a1389839e8d47beeca5b64ea']
}
}
};

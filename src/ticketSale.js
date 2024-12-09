import web3 from "./web3";
import abi from "./ABI.json"; // Import ABI from JSON file

const address = "0xd81dbCE85C2E990CAACbBEA3F92698d4c6061599";

const ticketSale = new web3.eth.Contract(abi, address);

export default ticketSale;

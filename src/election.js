import {web3} from "./web3";
import Election from "./contracts/Election.json";

const getElectionInstance = (address)=>{
    // const networkId = await web3.eth.net.getId();
    
    return new web3.eth.Contract(Election.abi,address);
}

export default getElectionInstance;
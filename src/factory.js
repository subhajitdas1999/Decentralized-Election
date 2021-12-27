
import {web3} from "./web3";
import ElectionFactory from "./contracts/electionFactory.json"

const electionFactoryInstance = async()=>{
    const networkId = await web3.eth.net.getId();
    const networkData = ElectionFactory.networks[networkId];
    return new web3.eth.Contract(ElectionFactory.abi,networkData.address)}
    ;

export default electionFactoryInstance;
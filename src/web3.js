import Web3 from "web3";

let web3;

const loadWeb3 = async()=>{
    console.log("enter web3")
    if(window.ethereum){
        try{
            web3=new Web3(window.ethereum);
            await window.ethereum.send('eth_requestAccounts');
        }
        catch(err){
            alert("You need to add metamask whenever you need to do some transaction");
        }
    }
    else if(window.web3){
        web3 = new Web3(window.web3.currentProvider);
    }
    else{
        alert("Non-Ethereum browser detected. You should consider trying MetaMask!")
    }
    
}

loadWeb3();
export { web3,loadWeb3};
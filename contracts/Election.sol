// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16;

contract ElectionFactory{
    Election[] public allElections;
    
    function createElection(string memory _electionName) public{
        Election newElection = new Election(_electionName, msg.sender);
        allElections.push(newElection);
    }
    
    function getAllElections() public view returns (Election [] memory){
        
        return allElections;
    }
    

}

contract Election {
    
    
   //all variables
   string public electionName;
   address public manager;
   
   struct Candidate{
       uint candidateId;
       string candidateName;
       address candidateAddress;
       uint candidateVote;
   }
   
   uint public candidateCount;
   
   //to store the candidates
   
   mapping(uint => Candidate) public candidates;
   
   //to register the voters;
   mapping(address => bool) public voterRegister;

    //to register the candidate address
    mapping(address => bool) public candidateRegister;
   
   enum State {creation,voting,ended} State public state;
   
   
   //Modifiers
   modifier requireAdmin(){
       require(msg.sender==manager);
       _;
   }
   
   modifier inState(State _state){
       require(state ==_state);
       _;
   }
   
   //Functions
    constructor (string memory _electionName ,address _manager) {
        electionName=_electionName;
        manager=_manager;
        state = State.creation;
    }
    
    
    
    function getstate() public view returns(State) {
        return state;
    }
    
    //Creation Phase
    function addCandidate(string memory _candidateName,address  _candidateAddress) public requireAdmin inState(State.creation){
        require(candidateRegister[_candidateAddress]==false);
        candidateCount++;
        Candidate memory newCandidate = Candidate({
            candidateId:candidateCount,
            candidateName:_candidateName,
            candidateAddress:_candidateAddress,
            candidateVote:0
        });
        
        candidates[candidateCount]=newCandidate;
        candidateRegister[_candidateAddress]=true;
        
        
    }
    
    function finalizeCandidate() public requireAdmin inState(State.creation){
        state = State.voting;
    }
    
    
    //voting phase
    function doVote(uint _id) public inState(State.voting){
        require(voterRegister[msg.sender]==false);
        candidates[_id].candidateVote++;
        voterRegister[msg.sender]=true;
    }
    
    function endVoting() public requireAdmin inState(State.voting){
        state = State.ended;
    }

    
    
    
    
    


   
}
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { web3, loadWeb3 } from "../web3";
import getElectionInstance from "../election";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

//for progress
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

// for table

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

//this for get the enum state in string as we get uint in return
let enumStates = {
  0: "creation",
  1: "voting",
  2: "ended",
  3: "finish",
};

function ElectionPortal() {
  //details of url of the page
  let url = useParams();

  //for page loading manage
  const [isLoading, setIsLoading] = useState(true);

  //for adding candidate loading
  const [addingCandidate, setAddingCandidate] = useState(false);

  //finalize and end vote loading
  const [btnLoading, setBtnLoading] = useState(false);

  //for store candidate name and address
  const [inputCandidateDetails, setInputCandidateDetails] = useState({
    candidateName: "",
    candidateAddress: "",
  });

  //storing the instance of election
  const [blockchainData, setBlockchainData] = useState({
    electionInstance: "",
  });

  //this one is for table data
  const [electionDetail, setElectionDetail] = useState({
    state: "",
    candidates: [],
    totalCandidates: 0,
  });

  useEffect(() => {
    (async () => {
      await loadElectionData();
    })();
  }, []);

  const loadElectionData = async () => {
    const accounts = await web3.eth.getAccounts();
    const electionInstance = getElectionInstance(url.address);
    const state = enumStates[await electionInstance.methods.state().call()];

    const candidateCount = await electionInstance.methods
      .candidateCount()
      .call();

    const allCandidateDetails = await Promise.all(
      Array(parseInt(candidateCount))
        .fill()
        .map((element, idx) => {
          return electionInstance.methods.candidates(idx + 1).call();
        })
    );
    setElectionDetail({
      state: state,
      candidates: allCandidateDetails,
      totalCandidates: candidateCount,
    });

    setBlockchainData({
      electionInstance: electionInstance,
    });
    console.log(state);

    setIsLoading(false);
  };

  //to render all the candidate details to the page
  const renderCandidateTable = (electionData) => {
    // console.log(electionData.candidates);

    electionData.candidates.sort(
      (a, b) => !(a.candidateVote - b.candidateVote)
    );
    // console.log(electionData.candidates);

    return (
      <Paper className="table__container">
        <Table className="table__details">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Votes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {electionData.candidates.map((candidate, idx) => (
              <TableRow key={idx + 1}>
                <TableCell style={{ fontWeight: "bold" }}>
                  {candidate.candidateName}
                </TableCell>
                <TableCell align="center">
                  {candidate.candidateAddress}
                </TableCell>
                <TableCell align="center">
                  {electionData.state === "voting" ? (
                    <Button
                      onClick={handleVote}
                      id={candidate.candidateId}
                      variant="contained"
                      color="success"
                      size="small"
                    >
                      vote
                    </Button>
                  ) : (
                    candidate.candidateVote
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  };

  const handleChange = (e) => {
    setInputCandidateDetails((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingCandidate(true);
    try {
      //we are calling this func again because to make sure users has connected the metamask account
      await loadWeb3();
      const accounts = await web3.eth.getAccounts();
      // console.log("acc",accounts)
      await blockchainData.electionInstance.methods
        .addCandidate(
          inputCandidateDetails.candidateName,
          inputCandidateDetails.candidateAddress
        )
        .send({ from: accounts[0] });

      window.location.reload(false);
    } catch (err) {
      alert(`${err.message}\nTry again.\nRefresh The page`);
    }
    setAddingCandidate(false);
  };

  const handleFinalise = async () => {
    setBtnLoading(true)
    try {
      if (electionDetail.totalCandidates < 2) {
        throw new Error("Minimum 2 Candidates Required");
      }
      await loadWeb3();
      const accounts = await web3.eth.getAccounts();
      await blockchainData.electionInstance.methods
        .finalizeCandidate()
        .send({ from: accounts[0] });

      window.location.reload(false);
    } catch (err) {
      alert(`${err.message}\nTry again.\nRefresh The page`);
    }
    setBtnLoading(false);
  };

  const handleVote = async (e) => {
    console.log(parseInt(e.target.id));

    try {
      await loadWeb3();
      const accounts = await web3.eth.getAccounts();
      await blockchainData.electionInstance.methods
        .doVote(parseInt(e.target.id))
        .send({ from: accounts[0] });
    } catch (err) {
      alert(`${err.message}\nTry again.\nRefresh The page`);
    }
  };

  const handleEndVoting = async () => {
    setBtnLoading(true);
    try {
      await loadWeb3();
      const accounts = await web3.eth.getAccounts();
      await blockchainData.electionInstance.methods
        .endVoting()
        .send({ from: accounts[0] });

      window.location.reload(false);
    } catch (err) {
      alert(`${err.message}\nTry again.\nRefresh The page`);
    }
    setBtnLoading(false);
  };

  return (
    <div className="electionPortal">
      {electionDetail.state === "creation" ? (
        //this is for creation phase
        <div className="creationPhase">
          {addingCandidate ? (
            <div>
              <h2>Adding Candidates . . .</h2>
              <Box sx={{ width: "100%" }}>
                <LinearProgress color="primary" />
              </Box>
            </div>
          ) : (
            <div>
              <h2>Add candidates </h2>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="name"
                  name="candidateName"
                  onChange={handleChange}
                  className="name__filed"
                />
                <input
                  type="text"
                  placeholder="candidateAddress"
                  name="candidateAddress"
                  onChange={handleChange}
                  className="name__filed"
                />

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  className="submit__btn"
                >
                  Submit
                </Button>
              </form>
            </div>
          )}
        </div>
      ) : (
        electionDetail.state === "ended" && (
          <div className="endedPhase">
            <h1>Result</h1>
          </div>
        )
      )}
      <div className="electionPortal__details">
        <h2>Candidate Details</h2>
        {isLoading ? <h1>Loading...</h1> : renderCandidateTable(electionDetail)}
        {btnLoading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : electionDetail.state === "creation" ? (
          <Tooltip title="Only Manager Can Finalize" placement="top">
            <Button
              onClick={handleFinalise}
              className="finalise__btn"
              variant="contained"
            >
              finalise Candidates
            </Button>
          </Tooltip>
        ) : (
          electionDetail.state === "voting" && (
            <Tooltip title="Only Manager Can End Voting" placement="top">
              <Button
                onClick={handleEndVoting}
                className="finalise__btn"
                variant="contained"
              >
                end voting
              </Button>
            </Tooltip>
          )
        )}
      </div>
    </div>
  );
}

export default ElectionPortal;

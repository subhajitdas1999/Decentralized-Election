import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import electionFactoryInstance from "../factory";
import { web3, loadWeb3 } from "../web3";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

//for progress
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

function New() {
  const navigate = useNavigate();
  // const id = useParams();
  // console.log(id);
  const [isLoading, setIsLoading] = useState(false);
  const [electionName, setelectionName] = useState("");

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await loadWeb3();
      const accounts = await web3.eth.getAccounts();
      // console.log(accounts);
      const electionFactoryIns = await electionFactoryInstance();
      await electionFactoryIns.methods
        .createElection(electionName)
        .send({ from: accounts[0] });
      navigate("/");
    } catch (err) {
      alert("Something went wrong.\nRefresh The page and connect the metamask");
    }
    setIsLoading(false);
  };
  return (
    <div className="new">
      {isLoading ? (
        <div className="new__header">
          <h2>Creating A New Election ...</h2>
          <Box sx={{ width: "100%" }}>
            <LinearProgress color="primary" />
          </Box>
        </div>
      ) : (
        <div className="new__header">
          <h2>Create A New Election</h2>
        </div>
      )}

      <div className="new__container">
        <div className="new__left">
          <h2>Instructions</h2>
          <div className="new__left_guidlines">
            <p>Enter a election name and submit</p>
            <p>We will redirect you to home page on a successfull creation</p>
            <p>Find your election there</p>
            <p>Then Start operating</p>
          </div>
        </div>

        <div className="new__right">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Election name"
              onChange={(e) => setelectionName(e.target.value)}
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
      </div>
    </div>
  );
}

export default New;

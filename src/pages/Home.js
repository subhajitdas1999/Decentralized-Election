import React from "react";
import { useEffect, useState } from "react";
import { loadWeb3, web3 } from "../web3";
import electionFactoryInstance from "../factory";
import getElectionInstance from "../election";
import { Link } from "react-router-dom";

//for loading
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { AltRouteTwoTone } from "@mui/icons-material";

//to get the states of election
let enumStates = {
  0: "creation",
  1: "voting",
  2: "ended",
  3:"finish"
};

function Home() {
  const [loading, setLoading] = useState(true);
  const [blockchainData, setBlockchainData] = useState({});

  useEffect(() => {
    console.log("Enter use");
    (async () => {
      await loadElectionFactory();
    })();
    console.log("Exitt use");
  }, []);

  const loadElectionFactory = async () => {
    console.log("Enter LOad");
    const accounts = await web3.eth.getAccounts();

    //loading all election address
    // console.log(accounts)
    try {
      const electionFactoryIns = await electionFactoryInstance();
      let tmpAllElectionsAddress = await electionFactoryIns.methods
        .getAllElections()
        .call();
      //Here we are making copy because it was giving error to reverse form original
      let allElectionsAddress = [...tmpAllElectionsAddress];
      allElectionsAddress.reverse();

      // console.log(typeof allElectionsAddress)
      console.log(Array.isArray(allElectionsAddress));
      //get the all the election intance by its address
      const allElectionInstance = await Promise.all(allElectionsAddress.map((address) => {
        return getElectionInstance(address);
      }));

      //get the data of all election(name,address,manager)
      const allElectionData = await Promise.all(
        allElectionInstance.map((electionInstance) => {
          return fetchElectionData(electionInstance);
        })
      );

      // console.log(allElectionData);
      setBlockchainData({
        accounts: accounts,
        
        allElectionsDetails: allElectionData,
      });

      setLoading(false);
    } catch (err) {
      alert(err.message);
      alert(
        "Cannot connect to the Network. \nSomething Went wrong \nRefresh the Page and connect the metamask \nNote: Contract is deployed to the Rinkeby Network"
      );
    }

    console.log("Exit load");
  };

  //get one election data by its instance
  const fetchElectionData = async (contractIns) => {
    const name = await contractIns.methods.electionName().call();
    const manager = await contractIns.methods.manager().call();
    const state = enumStates[await contractIns.methods.state().call()];

    return {
      electionAddress: contractIns._address,
      name: name,
      manager: manager,
      state: state,
    };
  };

  

  //to render each election card

  const renderElection = (allElectionData) => {
    return allElectionData.map((data, idx) => {
      return (
        <Card sx={{ maxWidth: 300 }} key={idx} className="card">
          
          <CardContent className="card__content">
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="card__heading"
            >
              {data.name}
            </Typography>
            <Typography
              variant="body2"
              className="card__details"
              color={
                data.state === "creation"
                  ? "primary"
                  : data.state === "#20c997"
                  ? "primary"
                  : "error"
              }
              variant="h7"
            >
              Election: {data.state}
            </Typography>
            <Typography variant="body2" className="card__details">
              Address: {data.electionAddress}
            </Typography>
            <Typography variant="body2" className="card__details">
              Manager: {data.manager}
            </Typography>
          </CardContent>

          <CardActions >
            <Link to={`/election/${data.electionAddress}`}>
              <Button size="small" color="primary">
                Enter
              </Button>
            </Link>
            
          </CardActions>

          <CardActions>           
              
          </CardActions>
        </Card>
      );
    });
  };
  // loading
  return (
    <div className="home">
      <div className="home__part1">
        <div className="home__part1_details">
          <p>Some Text</p>
          <p className="home__part1_details_highlightText">Decentralised</p>
          <p>and again some text</p>
        </div>
      </div>
      <div className="home__part2">
        <h1 className="home_part2_heading">All Elections</h1>

        <div className="home__part2_card_container">
          {loading ? (
            <Box sx={{ display: "flex" }} className="home__part2_loading">
              <CircularProgress />
            </Box>
          ) : blockchainData.allElectionsDetails.length === 0 ? (
            <h1>Nothing To Show</h1>
          ) : (
            renderElection(blockchainData.allElectionsDetails)
          )}
        </div>
        {/* {renderElection(blockchainData.allElectionsDetails)} */}
      </div>
    </div>
  );
}

export default Home;

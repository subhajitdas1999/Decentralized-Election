// import reactDom from "react-dom";
import "./App.css"
import Home from "./pages/Home";
import New from "./pages/New";
import Header from "./pages/Header";
import ElectionPortal from "./pages/ElectionPortal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
function App() {
  const [isDay, setIsDay] = useState(true);
  return (
    <div className={`App ${isDay?"":"darkmode"}`}>
      
      <Router>
      <Header setIsDay={setIsDay} isDay={isDay}/>
      
        <Routes>
          <Route path="/" exact  element={<Home/>} />
          <Route path="/new" exact  element={<New/>} />
          <Route path="/election/:address" exact element={<ElectionPortal/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

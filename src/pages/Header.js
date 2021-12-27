import React, { useState } from 'react';
import {Link} from "react-router-dom";
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';
function Header({isDay,setIsDay}) {
    const [menuActive, setMenuActive] = useState(false);
    
    return (
        <div className="header">
            <div className="header__home">
                <Link to="/">Home</Link>
                
            </div>
            <div className="header__menu">
                <ul className={`header__menu_list ${menuActive?"active":""}`}>
                    <li onClick={()=>setMenuActive(!menuActive)}><Link to="/new">New</Link></li>
                    <li className="header__menu_list_lightmode" onClick={()=>{setIsDay(!isDay);setMenuActive(!menuActive)}}>{isDay?<NightlightIcon fontSize="large"/>:<LightModeIcon fontSize="large"/>}</li>
                </ul>

                <div className={`header__menu_hamberger ${menuActive?"active":""}`} onClick={()=>setMenuActive(!menuActive)}>
                    <div className="line line1"></div>
                    <div className="line line2"></div>
                    <div className="line line3"></div>
                </div>

                <div className={`header__menu_bg_cicle ${menuActive?"active":""}`}></div>
                
            </div>
        </div>
    )
}

export default Header;

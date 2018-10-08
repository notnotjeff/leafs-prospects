import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
    return(
        <div className="nav-container">
            <nav id="nav">
                <NavLink to="/prospects">Prospects</NavLink>
                <NavLink to="/games">Games</NavLink>
            </nav>
        </div>
    );
}

export default Navigation;
import React from 'react';
import {useState} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Burger from '../Components/Burger';

const Dashboard = ()=>{

    const [menuOpen ,setMenuOpen]=useState(false);
    return (
        <>
            <Navbar />
            <Burger onMenuToggle={setMenuOpen} />

            <div className={`big-box ${!menuOpen ? 'centered' : ''}`}>

        <Routes>
          
        </Routes>
      </div>
        </>
    )
}
export default Dashboard
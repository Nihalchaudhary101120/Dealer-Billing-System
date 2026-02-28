import React from 'react';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Burger from '../Components/Burger';
import Dealer from "./Dealer";
import BikeMaster from './Bikemaster/BikeRoutes';

const Dashboard = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <Navbar />
            <Burger onMenuToggle={setMenuOpen} />

            <div className={`big-box ${!menuOpen ? 'centered' : ''}`}>

                <Routes>
                    <Route path="/dealer" element={<Dealer />}></Route>
                    <Route path="/bike/*" element={<BikeMaster />} />
                </Routes>
            </div>
        </>
    )
}
export default Dashboard;
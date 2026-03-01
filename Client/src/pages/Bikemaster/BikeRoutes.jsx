import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import "./bike.css";

import Bike from './Bike';
import BikeModel from './BikeModel';
import BikeVarient from './BikeVarient';
import BikeColor from './BikeColor';
import BikeScheme from './BikeScheme';

const BikeMaster = () => {
    return (
        <>
            <div className="box">
                <h2>Bike Master</h2>
                <div className="options">
                    <ul>
                        <li><NavLink to={`/bike/model`} className={({ isActive }) => (isActive ? 'active' : '')}>Model</NavLink></li>
                        <li><NavLink to={`/bike/varient`} className={({ isActive }) => (isActive ? 'active' : '')}>Varient</NavLink></li>
                        <li><NavLink to={`/bike/color`} className={({ isActive }) => (isActive ? 'active' : '')}>Color</NavLink></li>
                        <li><NavLink to={`/bike/master`} className={({ isActive }) => (isActive ? 'active' : '')}>Bike</NavLink></li>
                        <li><NavLink to={`/bike/scheme`} className={({ isActive }) => (isActive ? 'active' : '')}>Scheme</NavLink></li>

                    </ul>
                </div>

                <Routes>
                    <Route index element={<Navigate to="master" replace />} />
                    <Route path="color" element={<BikeColor />} />
                    <Route path="varient" element={<BikeVarient />} />
                    <Route path="model" element={<BikeModel />} />
                    <Route path="master" element={<Bike />} />
                    <Route path="scheme" element ={<BikeScheme/>} />
                </Routes>
            </div>
        </>
    )
}

export default BikeMaster;

import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Part from './part';

const PartMaster = () => {
    return (
        <>
            <div className="box">
                <h2>Part Master</h2>
                <div className="options">
                    <ul>
                        <li><NavLink to={`/part/new-part`} className={({ isActive }) => (isActive ? 'active' : '')}>Part</NavLink></li>
                        

                    </ul>
                </div>

                <Routes>
                    <Route index element={<Navigate to="new-part" replace />} />
                    <Route path="new-part" element={<Part />} />
                  
                </Routes>

            </div>

        </>
    )
}
export default PartMaster;
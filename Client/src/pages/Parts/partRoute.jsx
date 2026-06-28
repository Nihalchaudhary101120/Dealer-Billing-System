import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Part from './part';
import Hsn from './hsn';
import JcNo from './jcNo';
import PartInvoice from './partInvoice';
import BillTo from './billTo';
import AllPartInvoice from './allPartInvoice';

const PartMaster = () => {
    return (
        <>
            <div className="box">
                <h2>Part Master</h2>
                <div className="options">
                    <ul>
                        <li><NavLink to={`/part/new-part`} className={({ isActive }) => (isActive ? 'active' : '')}>Part</NavLink></li>
                        <li><NavLink to={`/part/hsn`} className={({ isActive }) => (isActive ? 'active' : '')}>Hsn</NavLink></li>
                        <li><NavLink to={`/part/jcNo`} className={({ isActive }) => (isActive ? 'active' : '')}>Jc No.</NavLink></li>
                        <li><NavLink to={`/part/invoice`} className={({ isActive }) => (isActive ? 'active' : '')}>Part Invoice</NavLink></li>
                        <li><NavLink to={`/part/billTo`} className={({ isActive }) => (isActive ? 'active' : '')}>Bill To </NavLink></li>
                        <li><NavLink to={`/part/allInvoice`} className={({ isActive }) => (isActive ? 'active' : '')}>All Invoice </NavLink></li>


                    </ul>
                </div>

                <Routes>
                    <Route index element={<Navigate to="new-part" replace />} />
                    <Route path="new-part" element={<Part />} />
                    <Route path="hsn" element={<Hsn />} />
                    <Route path="jcNo" element={<JcNo />} />
                    <Route path="invoice" element={<PartInvoice />} />
                    <Route path="billTo" element={<BillTo />} />
                    <Route path="allInvoice" element={<AllPartInvoice />}></Route>
                    <Route path="invoice/:id?" element= {<PartInvoice/>}></Route>


                </Routes>

            </div>

        </>
    )
}
export default PartMaster;
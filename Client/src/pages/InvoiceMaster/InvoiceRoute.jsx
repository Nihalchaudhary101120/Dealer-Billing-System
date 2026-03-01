import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Invoice from './Invoice';
import Draft from './Draft';
import AllInvoice from './AllInvoice';

const InvoiceMaster = () => {
    return (
        <>
            <div className="box">
                <h2>Invoice Master</h2>
                <div className="options">
                    <ul>
                        <li><NavLink to={`/invoice/all-invoice`} className={({ isActive }) => (isActive ? 'active' : '')}>All Invoice</NavLink></li>
                        <li><NavLink to={`/invoice/draft`} className={({ isActive }) => (isActive ? 'active' : '')}>Draft</NavLink></li>
                        <li><NavLink to={`/invoice/create`} className={({ isActive }) => (isActive ? 'active' : '')}>Create Invoice</NavLink></li>
                    </ul>
                </div>

                <Routes>
                    <Route index element={<Navigate to="create" replace />} />
                    <Route path="all-invoice" element={<AllInvoice />} />
                    <Route path="draft" element={<Draft />} />
                    <Route path="create" element={<Invoice />} />
                </Routes>
            </div>
        </>
    )
}

export default InvoiceMaster;

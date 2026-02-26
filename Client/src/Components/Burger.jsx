import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext';
import { FaWineBottle } from "react-icons/fa";
import { IoMenu, IoClose } from "react-icons/io5";

const Burger = ({ onMenuToggle }) => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();


    const handleLogout = async () => {
        try {
            await logout();
            showToast("Logged out successfully", "success");
            navigate("/signin");
        } catch (err) {
            showToast("Logout failed", "error");
            console.error(err);
        }
    };

    const [open, setOpen] = useState(false);
    const handleMenuToggle = (isOpen) => {
        setOpen(isOpen);
        if (onMenuToggle) {
            onMenuToggle(isOpen);
        }
    };


    return (
        <>
            <button
                onClick={() => handleMenuToggle(true)}
                className={`menu-btn text-3xl p-2 ${open ? "hidden-menu" : ""}`}
            >
                <IoMenu />
            </button>


            <div className={`burger-box ${open ? "show" : "hide"}`}>
                <div className="heading">
                    <h3 >AJAY MOTORS</h3>

                    <IoClose className="close-icon"
                        onClick={() => handleMenuToggle(false)}
                    />

                </div>
                <div className="line"></div>
                <ul className="burger-ul">

                    <li><NavLink to={'/invoice'} className={({ isActive }) => (isActive ? 'active-link' : '')}>Invoice </NavLink></li>

                    <li><NavLink to={'/bike'} className={({ isActive }) => (isActive ? 'active-link' : '')}>Bike-Master</NavLink></li>

                    <li><NavLink to={'/bank'} className={({ isActive }) => (isActive ? 'active-link' : '')}>Bank</NavLink></li>
                    
                    <li><NavLink to={'/dealer'} className={({ isActive }) => (isActive ? 'active-link' : '')}>Dealer </NavLink></li>






                </ul>

                {user &&
                    (
                        <div className="user-section">
                            {/* <div className="user-info"> */}
                            {/* <div className="user-avatar">
                                    <i className="fas fa-user-circle"></i>
                                </div> */}
                            <div className="user-details">
                                <span className="user-name">{user.name}</span>
                            </div>
                            {/* </div> */}
                            <button className="logout-btn" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    )
                }

            </div>
        </>
    )
}

export default Burger
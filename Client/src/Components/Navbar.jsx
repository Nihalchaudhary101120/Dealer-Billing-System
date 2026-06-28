import React from 'react';
import image from "../assets/tvs.svg";

const Navbar = () => {
    return (
        <div className='nav'>
            <nav className="space-between">
                <div className="san-logo" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: "700",
                    fontSize: "20px",
                    color: "#fff"
                }}>
                    <img
                        src={image}
                        alt="TVS logo"
                        style={{
                            height: "36px",
                            width: "auto",
                            objectFit: "contain",
                            filter: "brightness(0) invert(1)"
                        }}
                    />
                    Ajay Motors
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
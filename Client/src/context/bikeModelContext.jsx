import { createContext, useContext, useState } from "react";
import { useBike } from "../context/BikeContext";
import "../pages/bike.css";

const BikeModelContext = createContext();

export const BikeModelProvider = ({ children }) => {
    const { bikes } = useBike();
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    const [onSelectCallback, setOnSelectCallback] = useState(null);

    const openBikeModel = (callback) => {
        setOnSelectCallback(() => callback);
        setShow(true);
    };

    const closeBikeModel = () => {
        setShow(false);
        setSearch("");
        setOnSelectCallback(null);
    }

    return (

        <BikeModelContext.Provider
            value={{
                openBikeModel,
                closeBikeModel,
            }}



        >
            {children}

            {show && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Select Bike</h3>
                            <button
                                className="modal-close-btn"
                                onClick={closeBikeModel}
                            >
                                ✕
                            </button>
                        </div>

                        <input
                            className="modal-search"
                            placeholder="Search by model"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <div className="modal-table">
                            <div className="modal-row modal-head">
                                <div>Model</div>
                                <div>Variant</div>
                                <div>Color</div>
                                <div>BasePrice</div>
                            </div>

                            {bikes
                                .filter(sm =>
                                    sm.modelName.toLowerCase().includes(search.toLowerCase()) ||
                                    sm.variant.toLowerCase().includes(search.toLowerCase()) ||
                                    sm.colorOptions.toLowerCase().includes(search.toLowerCase())
                                )
                                .map(sm => (
                                    <div
                                        key={sm._id}
                                        className="modal-row"
                                        onClick={() => {
                                            onSelectCallback?.(sm._id);
                                            closeBikeModel();
                                        }}
                                    >
                                        <div>{sm.modelName}</div>
                                        <div>{sm.variant}</div>
                                        <div>{sm.colorOptions}</div>
                                        <div>{sm.basePrice}</div>


                                        {/* <div
                                            className={`status-badge ${sm.status === "Inactive" ? "inactive" : "active"
                                                }`}
                                        >
                                            {sm.status}
                                        </div> */}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

        </BikeModelContext.Provider>
    );

};

export const useBikeModel =()=>
    useContext(BikeModelContext);

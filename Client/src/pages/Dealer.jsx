import React, { useState, useRef, useEffect } from "react";
import { useDealer } from "../context/DealerContext";
import "./dealer.css";
// import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Dealer = () => {
    const [showModal, setShowModal] = useState(false);
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const { showToast } = useToast();

    const { dealers, loading, deleteDealer, addDealer, updateDealer } = useDealer();

    const [editId, setEditId] = useState(null);
    const [editDealer, setEditDealer] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    // const { user } = useAuth();
    const [newDealer, setNewDealer] = useState({
        dealerName: "",
        branchName: "",
        nearBy: "",
        address: "",
        state: "",
        phone: "",
        gstNumber: ""
        
    });

    // const getDealer = (dealer) => {
    //     if (!dealer && !Array.isArray(dealers)) return "";
    //     const id = String(dealer).trim();
    //     const matchDealer = dealers.find((d) => String(d._id).trim() === id);
    //     return matchDealer;
    // }


    const dealerNameInputRef = useRef(null);
    const branchNameInputRef = useRef(null);
    const nearByInputRef = useRef(null);
    const addressInputRef = useRef(null);
    const stateInputRef = useRef(null);
    const phoneInputRef = useRef(null);
    const gstNumberInputRef = useRef(null);
    const saveBtnRef = useRef(null);

    const modalRef = useRef(null);
    const modalDealerNameRef = useRef(null);
    const modalBranchNameRef = useRef(null);
    const modalNearByRef = useRef(null);
    const modalAddressRef = useRef(null);
    const modalStateRef = useRef(null);
    const modalPhoneRef = useRef(null);
    const modalGstNumberRef = useRef(null);
    const modalSaveBtnRef = useRef(null);

    useEffect(() => {
        if (showModal) {
            setTimeout(() => {
                modalDealerNameRef.current.focus?.focus();
            }, 100);
        }
    }, [showModal]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowModal(false);

            }
        };
        if (showModal) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showModal]);

    const handleAddDealer = async (e) => {
        e.preventDefault();
        if (!newDealer.branchName && !newDealer.gstNumber && !newDealer.phone) {
            showToast("Please filled required fields");
            return;
        }
        try {
            const payLoad = {
                dealerName: newDealer.dealerName,
                branchName: newDealer.branchName,
                nearBy: newDealer.nearBy,
                address: newDealer.address,
                state: newDealer.state,
                phone: newDealer.phone,
                gstNumber: newDealer.gstNumber,
                isActive: newDealer.isActive
            }
            console.log("Sending dealer:", payLoad);
            await addDealer(payLoad);
            setNewDealer({ dealerName: "", branchName: "", nearBy: "", address: "", state: "", phone: "", gstNumber: "" });
            setShowModal(false);
        } catch (err) {
            console.error(err.response.data.message || 'Failed to add Dealer');
        }
    };

    const handleEdit = (dealer) => {
        setEditId(dealer._id);
        setEditDealer({ ...dealer });

        setTimeout(() => {
            dealerNameInputRef.current?.focus();
        }, 50);
    };

    const handleSaveEdit = async (id) => {
        try {
            await updateDealer(id, editDealer);
            setEditId(null);
        }
        catch (err) {
            console.error(err?.response?.data?.message || "Update failed");

        }
    };

    const handleDelete = async (id) => {
        await deleteDealer(id);
    };

    const filteredDealers = dealers.filter(
        (i) =>
            i?.dealerName &&
            i.dealerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clearInitialValue = () => {
        setNewDealer({
            dealerName: "",
            branchName: "",
            nearBy: "",
            address: "",
            state: "",
            phone: "",
            gstNumber: "",
            isActive: ""
        });
    };


    return (
        <div className="box">
            <h2>DEALER MASTER</h2>

            <div className="salesman-container">
                <div className="salesman-header-row">
                    <input
                        type="text"
                        placeholder="🔍 Search Dealer..."
                        className="salesman-search-box"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button className="salesman-new-item-btn" onClick={() => setShowModal(true)}> +New</button>
                </div>

                <div className="salesman-table-grid salesman-table-header">
                    <div>SL.NO.</div>
                    <div>DEALER NAME</div>
                    <div>BRANCH NAME</div>
                    <div>NEAR BY</div>
                    <div>ADDRESS</div>
                    <div>STATE</div>
                    <div>PHONE </div>
                    <div>DLR-GST</div>
                    <div>Actions</div>
                </div>

                {loading && <div className="loading">Loading</div>}

                {filteredDealers.map((dealer, index) =>(
                    <div key={dealer._id || index} className="salesman-table-grid salesman-table-row">
                        <div> {index + 1}</div>
                        {editId === dealer._id ? (
                            <>
                                <input
                                    type="text"
                                    ref={dealerNameInputRef}
                                    value={editDealer.dealerName}
                                    onChange={(e) =>
                                        setEditDealer({ ...editDealer, depoName: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNavigation(e, "dealername")}
                                />
                                <input
                                    type="text"
                                    ref={branchNameInputRef}
                                    value={editDealer.branchName}
                                    onChange={(e) =>
                                        setEditDealer({ ...editDealer, branchName: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNavigation(e, "branchname")}
                                />
                                <input
                                    type="text"
                                    ref={nearByInputRef}
                                    value={editDealer.nearBy}
                                    onChange={(e) =>
                                        setEditDealer({
                                            ...editDealer,
                                            nearBy: e.target.value,
                                        })
                                    }
                                    onKeyDown={(e) => handleKeyNavigation(e, "nearby")}
                                />
                                <input
                                    type="text"
                                    ref={addressInputRef}
                                    value={editDealer.address}
                                    onChange={(e) =>
                                        setEditDealer({
                                            ...editDealer,
                                            address: e.target.value,
                                        })
                                    }
                                    onKeyDown={(e) => handleKeyNavigation(e, "address")}
                                /><input
                                    type="text"
                                    ref={stateInputRef}
                                    value={editDealer.state}
                                    onChange={(e) =>
                                        setEditDealer({
                                            ...editDealer,
                                            state: e.target.value,
                                        })
                                    }
                                    onKeyDown={(e) => handleKeyNavigation(e, "state")}
                                /><input
                                    type="text"
                                    ref={phoneInputRef}
                                    value={editDealer.phone}
                                    onChange={(e) =>
                                        setEditDealer({
                                            ...editDealer,
                                            phone: e.target.value,
                                        })
                                    }
                                    onKeyDown={(e) => handleKeyNavigation(e, "phone")}
                                />
                                <input
                                    type="text"
                                    ref={gstNumberInputRef}
                                    value={editDealer.gstNumber}
                                    onChange={(e) =>
                                        setEditDealer({
                                            ...editDealer,
                                            gstNumber: e.target.value,
                                        })
                                    }
                                    onKeyDown={(e) => handleKeyNavigation(e, "gstnumber")}
                                />

                                <div className="actions">
                                    <button
                                        className="save"
                                        ref={saveBtnRef}
                                        disabled={loading}
                                        onClick={() => handleSaveEdit(dealer._id)}
                                    >
                                        Save
                                    </button>{" "}
                                    |{" "}
                                    <span className="cancel" onClick={() => setEditId(null)}>
                                        Cancel
                                    </span>
                                </div>

                            </>
                        ) : (
                            <>
                                <div>{dealer.dealerName}</div>
                                <div>{dealer.branchName}</div>
                                <div>{dealer.nearBy}</div>
                                <div>{dealer.address}</div>
                                <div>{dealer.state}</div>
                                <div>{dealer.phone}</div>
                                <div>{dealer.gstNumber}</div>

                                <div className="actions">
                                    <span className="edit" onClick={() => handleEdit(dealer)}>
                                        Edit
                                    </span>{" "}
                                    |{" "}
                                    <span
                                        className="delete"
                                        onClick={() => handleDelete(dealer._id)}
                                    >
                                        Delete
                                    </span>
                                </div>
                            </>
                        )}

                    </div>
                ))}


                {/* Add Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={handleClose}>
                        <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                            <h2>Add New Dealer</h2>
                            <form className="modal-form" onSubmit={handleAddDealer}>
                                <div className="form-group">
                                    <label>Dealer Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Dealer Name"
                                        ref={modalDealerNameRef}
                                        value={newDealer.dealerName}
                                        onChange={(e) =>
                                            setNewDealer({ ...newDealer, dealerName: e.target.value })
                                        }
                                        onKeyDown={(e) => handleModalKeyNavigation(e, "dealername")}
                                    />
                                </div>

                                <div className="form-group">
                                    <label> Branch Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name of Depo"
                                        ref={modalBranchNameRef}
                                        value={newDealer.branchName}
                                        onChange={(e) =>
                                            setNewDealer({ ...newDealer, branchName: e.target.value })
                                        }
                                        onKeyDown={(e) => handleModalKeyNavigation(e, "branchname")}
                                    />
                                </div>
                                <div className="form-group">
                                    <label> NearBy</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name of Depo"
                                        ref={modalNearByRef}
                                        value={newDealer.nearBy}
                                        onChange={(e) =>
                                            setNewDealer({ ...newDealer, nearBy: e.target.value })
                                        }
                                        onKeyDown={(e) => handleModalKeyNavigation(e, "nearby")}
                                    />
                                </div>
                                <div className="form-group">
                                    <label> Address</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name of Depo"
                                        ref={modalAddressRef}
                                        value={newDealer.address}
                                        onChange={(e) =>
                                            setNewDealer({ ...newDealer, address: e.target.value })
                                        }
                                        onKeyDown={(e) => handleModalKeyNavigation(e, "address")}
                                    />
                                </div>
                                <div className="form-group">
                                    <label> State</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name of Depo"
                                        ref={modalStateRef}
                                        value={newDealer.state}
                                        onChange={(e) =>
                                            setNewDealer({ ...newDealer, state: e.target.value })
                                        }
                                        onKeyDown={(e) => handleModalKeyNavigation(e, "state")}
                                    />
                                </div>
                                <div className="form-group">
                                    <label> Phone</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name of Depo"
                                        ref={modalPhoneRef}
                                        value={newDealer.phone}
                                        onChange={(e) =>
                                            setNewDealer({ ...newDealer, phone: e.target.value })
                                        }
                                        onKeyDown={(e) => handleModalKeyNavigation(e, "phone")}
                                    />
                                </div><div className="form-group">
                                    <label>GST-Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name of Depo"
                                        ref={modalGstNumberRef}
                                        value={newDealer.gstNumber}
                                        onChange={(e) =>
                                            setNewDealer({ ...newDealer, gstNumber: e.target.value })
                                        }
                                        onKeyDown={(e) => handleModalKeyNavigation(e, "gstnumber")}
                                    />
                                </div>
                                


                                <div className="modal-buttons">
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        ref={modalSaveBtnRef}
                                        disabled={loading}

                                        onKeyDown={(e) => handleModalKeyNavigation(e, "save")}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {!loading && filteredDealers.length === 0 && (
                    <div className="no-data">No Dealer found.</div>
                )}
            </div>

        </div>

    );
};

export default Dealer;
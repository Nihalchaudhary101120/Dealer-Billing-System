import React, { useState, useRef, useEffect } from "react";
import { useBank } from "../context/BankContext";
import "./dealer.css";
import { useToast } from "../context/ToastContext";

const BankMaster = () => {
    const [showModal, setShowModal] = useState(false);
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const { showToast } = useToast();

    const { banks, loading, deleteBank, addBank, getAllBanks, updateBank } = useBank();

    const [editId, setEditId] = useState(null);
    const [editBank, setEditBank] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const [newBank, setNewBank] = useState({
        companyName: "",
        companyType: "NBFC",
        isActive: true
    });

    const companyNameInputRef = useRef(null);

    const modalRef = useRef(null);
    const modalCompanyNameRef = useRef(null);


    useEffect(() => {
        if (showModal) {
            setTimeout(() => {
                modalCompanyNameRef.current?.focus();
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

    const handleAddBank = async (e) => {
        e.preventDefault();
        if (!newBank.companyName || !newBank.companyType) {
            showToast("Please filled required fields");
            return;
        }
        try {
            const payLoad = {
                companyName: newBank.companyName,
                companyType: newBank.companyType,
                isActive: newBank.isActive
            }
            console.log("Sending bank", payLoad);
            await addBank(payLoad);
            setNewBank({
                companyName: "",
                companyType: "NBFC",
                isActive: true
            });
            setShowModal(false);
        } catch (err) {
            console.error(err.response.data.message || "Failed to add Bank");
        }
    };


    const handleEdit = (bank) => {
        setEditId(bank._id);
        setEditBank({ ...bank });

        setTimeout(() => {
            companyNameInputRef.current?.focus();

        }, 50);
    };
    const handleSaveEdit = async (id) => {
        try {
            await updateBank(id, editBank);
            setEditId(null);
        }
        catch (err) {
            console.error(err?.response?.data?.message || "Update failed");
        }
    };

    const handleDelete = async (id) => {
        await deleteBank(id);
    };

    const filteredBanks = banks.filter((i) =>
        i?.companyName && i.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clearInitialValue = () => {
        setNewBank({
            companyName: "",
            companyType: "NBFC",
            isActive: true
        });
    };


    return (
        <div className="box">
            <h2> BANK MASTER</h2>

            <div className="salesman-container">
                <div className="salesman-header-row">
                    <input
                        type="text"
                        placeholder="🔍 Search Dealer..."
                        className="salesman-search-box"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="salesman-new-item-btn" onClick={() => {
                        clearInitialValue();
                        setShowModal(true);
                    }}> +New</button>
                </div>

                <div className="salesman-table-grid2 salesman-table-header">
                    <div>SL.NO.</div>
                    <div>COMPANY NAME</div>
                    <div>COMPANY TYPE</div>
                    <div>isActive</div>
                    <div>Action</div>
                </div>

                {loading && <div className="loading">Loading</div>}

                {filteredBanks.map((bank, index) => (
                    <div key={bank._id || index} className="salesman-table-grid2 salesman-table-row" >
                        <div>{index + 1}</div>
                        {editId === bank._id ? (
                            <>
                                <input
                                    type="text"
                                    ref={companyNameInputRef}
                                    value={editBank.companyName}
                                    onChange={(e) =>
                                        setEditBank({ ...editBank, companyName: e.target.value })
                                    }
                                />
                                <select
                                    value={editBank.companyType}
                                    onChange={(e) =>
                                        setEditBank({ ...editBank, companyType: e.target.value })
                                    }

                                >
                                    <option>BANK</option>
                                    <option>NBFC</option>
                                </select>

                                <select
                                    value={String(editBank.isActive)}
                                    onChange={(e) =>
                                        setEditBank({
                                            ...editBank,
                                            isActive: e.target.value === "true",
                                        })
                                    }
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>

                                <div className="actions">
                                    <button
                                        className="save"
                                        disabled={loading}
                                        onClick={() => handleSaveEdit(bank._id)}
                                    >
                                        Save
                                    </button>
                                    |{" "}
                                    <span className="cancel" onClick={() => setEditId(null)}>
                                        Cancel
                                    </span>
                                </div>

                            </>
                        ) : (
                            <>
                                <div>{bank.companyName}</div>
                                <div>{bank.companyType}</div>
                                <div className='status'>
                                    <span
                                        className={`status-badge ${bank.isActive ? "active" : "inactive"
                                            }`}
                                    >
                                        {bank.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="actions">
                                    <span className="edit" onClick={() => handleEdit(bank)}>
                                        Edit
                                    </span>{" "}
                                    |{" "}
                                    <span
                                        className="delete"
                                        onClick={() => handleDelete(bank._id)}
                                    >
                                        Delete
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {showModal && (
                    <div className="modal-overlay" onClick={handleClose}>
                        <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                            <h2> Add New Bank</h2>
                            <form className="modal-form" onSubmit={handleAddBank}>
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter CompanyName"
                                        ref={modalCompanyNameRef}
                                        value={newBank.companyName}
                                        onChange={(e) =>
                                            setNewBank({ ...newBank, companyName: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company Type</label>
                                    <select
                                        value={newBank.companyType}
                                        onChange={(e) =>
                                            setNewBank({ ...newBank, companyType: e.target.value })
                                        }
                                    >
                                        <option value="NBFC">NBFC</option>
                                        <option value="BANK">BANK</option>

                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={String(newBank.isActive)}
                                        onChange={(e) =>
                                            setNewBank({ ...newBank, isActive: e.target.value === "true" })
                                        }
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>


                                <div className="modal-buttons">
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={loading}

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


                {!loading && filteredBanks.length === 0 && (
                    <div className="no-data">No Bank found.</div>
                )}

            </div>



        </div>
    );



};

export default BankMaster;
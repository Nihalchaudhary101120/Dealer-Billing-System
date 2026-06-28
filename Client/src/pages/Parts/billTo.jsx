import React, { useState, useRef, useEffect } from "react";
import { useBillTo } from "../../context/BillToContext";
import "../dealer.css";

import { useToast } from "../../context/ToastContext";

const BillTo = () => {
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);

    const { showToast } = useToast();

    const [editId, setEditId] = useState(null);
    const [editBillTo, setEditBillTo] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const [newBillTo, setNewBillTo] = useState({
        address: "",
        gstNo: ""
    });

    const {
        billTos,
        loading,
        addBillTo,
        updateBillTo,
        deleteBillTo
    } = useBillTo();

    const addressInputRef = useRef(null);
    const gstNoInputRef = useRef(null);
    const saveBtnRef = useRef(null);

    const modalRef = useRef(null);
    const modalAddressRef = useRef(null);
    const modalGstNoRef = useRef(null);
    const modalSaveBtnRef = useRef(null);

    useEffect(() => {
        if (showModal) {
            setTimeout(() => {
                modalAddressRef.current?.focus();
            }, 100);
        }
    }, [showModal]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowModal(false);
            }
        };

        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showModal]);

    const handleAddBillTo = async (e) => {
        e.preventDefault();

        if (!newBillTo.address || !newBillTo.gstNo) {
            showToast("Please fill required fields", "error");
            return;
        }

        try {
            const payload = {
                address: newBillTo.address,
                gstNo: newBillTo.gstNo
            };

            await addBillTo(payload);

            setNewBillTo({
                address: "",
                gstNo: ""
            });

            setShowModal(false);
        } catch (err) {
            console.error(
                err?.response?.data?.message || "Failed to add Bill To"
            );
        }
    };

    const handleEdit = (billTo) => {
        setEditId(billTo._id);
        setEditBillTo({ ...billTo });

        setTimeout(() => {
            addressInputRef.current?.focus();
        }, 50);
    };

    const handleSaveEdit = async (id) => {
        try {
            await updateBillTo(id, editBillTo);
            setEditId(null);
        } catch (err) {
            console.error(
                err?.response?.data?.message || "Update Failed"
            );
        }
    };

    const handleDelete = async (id) => {
        await deleteBillTo(id);
    };

    const filteredBillTo = billTos.filter(
        (b) =>
            b?.address &&
            b.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clearInitialValue = () => {
        setNewBillTo({
            address: "",
            gstNo: ""
        });
    };

    return (
        <div className="box">
            <h2>BILL TO MASTER</h2>

            <div className="salesman-container">

                <div className="salesman-header-row">
                    <input
                        type="text"
                        placeholder="🔍 Search Address..."
                        className="salesman-search-box"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button
                        className="salesman-new-item-btn"
                        onClick={() => {
                            clearInitialValue();
                            setShowModal(true);
                        }}
                    >
                        +New
                    </button>
                </div>

                <div className="salesman-table-grid3 salesman-table-header">
                    <div>Sr No.</div>
                    <div>Address</div>
                    <div>GST No.</div>
                    <div>Action</div>
                </div>

                {loading && <div className="loading">Loading</div>}

                {filteredBillTo.map((billTo, index) => (
                    <div
                        key={billTo._id}
                        className="salesman-table-grid3 salesman-table-row"
                    >
                        <div>{index + 1}</div>

                        {editId === billTo._id ? (
                            <>
                                <input
                                    type="text"
                                    ref={addressInputRef}
                                    value={editBillTo.address}
                                    onChange={(e) =>
                                        setEditBillTo({
                                            ...editBillTo,
                                            address: e.target.value
                                        })
                                    }
                                />

                                <input
                                    type="text"
                                    ref={gstNoInputRef}
                                    value={editBillTo.gstNo}
                                    onChange={(e) =>
                                        setEditBillTo({
                                            ...editBillTo,
                                            gstNo: e.target.value
                                        })
                                    }
                                />

                                <div className="actions">
                                    <button
                                        className="save"
                                        ref={saveBtnRef}
                                        disabled={loading}
                                        onClick={() =>
                                            handleSaveEdit(billTo._id)
                                        }
                                    >
                                        Save
                                    </button>

                                    {" | "}

                                    <span
                                        className="cancel"
                                        onClick={() => setEditId(null)}
                                    >
                                        Cancel
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>{billTo.address}</div>

                                <div>{billTo.gstNo}</div>

                                <div className="actions">
                                    <span
                                        className="edit"
                                        onClick={() => handleEdit(billTo)}
                                    >
                                        Edit
                                    </span>

                                    {" | "}

                                    <span
                                        className="delete"
                                        onClick={() =>
                                            handleDelete(billTo._id)
                                        }
                                    >
                                        Delete
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {showModal && (
                    <div
                        className="modal-overlay"
                        onClick={handleClose}
                    >
                        <div
                            className="modal"
                            ref={modalRef}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Add New Bill To</h2>

                            <form
                                className="modal-form"
                                onSubmit={handleAddBillTo}
                            >
                                <div className="form-group">
                                    <label>Address</label>

                                    <input
                                        type="text"
                                        placeholder="Enter Address"
                                        ref={modalAddressRef}
                                        value={newBillTo.address}
                                        onChange={(e) =>
                                            setNewBillTo({
                                                ...newBillTo,
                                                address: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>GST No.</label>

                                    <input
                                        type="text"
                                        placeholder="Enter GST Number"
                                        ref={modalGstNoRef}
                                        value={newBillTo.gstNo}
                                        onChange={(e) =>
                                            setNewBillTo({
                                                ...newBillTo,
                                                gstNo: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="modal-buttons">
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        ref={modalSaveBtnRef}
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

                {!loading && filteredBillTo.length === 0 && (
                    <div className="no-data">
                        No Bill To found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillTo;
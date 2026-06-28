import React, { useState, useRef, useEffect } from "react";
import { useHsn } from "../../context/HsnContext";
import "../dealer.css";

import { useToast } from "../../context/ToastContext";

const Hsn = () => {
    const [showModal, setShowModal] = useState(false);
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const { showToast } = useToast();

    const [editId, setEditId] = useState(null);
    const [editHsn, setEditHsn] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const [newHsn, setNewHsn] = useState({
        forWhat: "",
        hsnCode: ""
    });


    const { hsns, loading, deleteHsn, addHsn, updateHsn } = useHsn();

    const forWhatInputRef = useRef(null);
    const hsnCodeInputRef = useRef(null);
    const saveBtnRef = useRef(null);

    const modalRef = useRef(null);
    const modalForWhatRef = useRef(null);
    const modalHsnCodeRef = useRef(null);
    const modalSaveBtnRef = useRef(null);

    useEffect(() => {
        if (showModal) {
            setTimeout(() => {
                modalForWhatRef.current?.focus();
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

    const handleAddHsn = async (e) =>{
        e.preventDefault();
        if(!newHsn.forWhat && !newHsn.hsnCode){
            showToast("please filled required fields");
            return ;
        }
        try{
            const payLoad = {
                forWhat: newHsn.forWhat,
                hsnCode: newHsn.hsnCode
        
            }
            console.log("sending Hsn",payLoad);
            await addHsn(payLoad);
            setNewHsn({ forWhat :"",hsnCode:""});
            setShowModal(false);
        }catch(err){
            console.error(err.response.data.message || 'failed to add Hsn');
        }

    };

    const handleEdit = (hsn)=>{
        setEditId(hsn._id);
        setEditHsn({...hsn});

        setTimeout(()=>{
            forWhatInputRef.current?.focus();
        },50);
    };

    const handleSaveEdit = async (id)=>{
        try{
            await updateHsn(id,editHsn);
            setEditId(null);

        }catch(err){
            console.error(err?.response?.data?.message || "update failed");
        }
    };

    const handleDelete = async (id) => {
        await deleteHsn(id);
    };

    const filteredHsns = hsns.filter(
        (i) =>
            i?.forWhat && 
        i.forWhat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clearInitialValue = () => {
        setNewHsn({
            forWhat: "",
            hsnCode: ""
        });
    };

    return (
        <div className="box">
            <h2>HSN MASTER</h2>

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

                <div className="salesman-table-grid3 salesman-table-header">
                    <div>Sr No.</div>
                    <div>For What</div>
                    <div>HSN Code</div>
                    <div>Action </div>

                </div>

                {loading && <div className="loading">Loading</div>}

                {filteredHsns.map((hsn, index) => (
                    <div key={hsn._id || index} className="salesman-table-grid3 salesman-table-row">
                        <div> {index + 1}</div>
                        {editId === hsn._id ? (
                            <>
                                <input
                                    type="text"
                                    ref={forWhatInputRef}
                                    value={editHsn.forWhat}
                                    onChange={(e) =>
                                        setEditHsn({ ...editHsn, forWhat: e.target.value })
                                    }
                                />
                                <input
                                    type="text"
                                    ref={hsnCodeInputRef}
                                    value={editHsn.hsnCode}
                                    onChange={(e) =>
                                        setEditHsn({ ...editHsn, hsnCode: e.target.value })
                                    }
                                />


                                <div className="actions">
                                    <button
                                        className="save"
                                        ref={saveBtnRef}
                                        disabled={loading}
                                        onClick={() => handleSaveEdit(hsn._id)}
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
                                <div>{hsn.forWhat}</div>
                                <div>{hsn.hsnCode}</div>


                                <div className="actions">
                                    <span className="edit" onClick={() => handleEdit(hsn)}>
                                        Edit
                                    </span>{" "}
                                    |{" "}
                                    <span
                                        className="delete"
                                        onClick={() => handleDelete(hsn._id)}
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
                            <h2>Add New HSN</h2>
                            <form className="modal-form" onSubmit={handleAddHsn}>
                                <div className="form-group">
                                    <label>For What</label>
                                    <input
                                        type="text"
                                        placeholder="Enter For What"
                                        ref={modalForWhatRef}
                                        value={newHsn.forWhat}
                                        onChange={(e) =>
                                            setNewHsn({ ...newHsn, forWhat: e.target.value })
                                        }
                                    />
                                </div>


                                <div className="form-group">
                                    <label> HsnCode</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Hsn code"
                                        ref={modalHsnCodeRef}
                                        value={newHsn.hsnCode}
                                        onChange={(e) =>
                                            setNewHsn({ ...newHsn, hsnCode: e.target.value })
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
                {!loading && filteredHsns.length === 0 && (
                    <div className="no-data">No Hsn found.</div>
                )}
            </div>

        </div>

    )
}
export default Hsn;
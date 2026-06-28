import React, { useState, useRef, useEffect } from "react";
import { usePart } from "../../context/partContext";
import "../dealer.css";
import { useHsn } from "../../context/HsnContext";

import { useToast } from "../../context/ToastContext";

const Part = () => {
    const [showModal, setShowModal] = useState(false);
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const { showToast } = useToast();

    const [editId, setEditId] = useState(null);
    const [editPart, setEditPart] = useState({
        itemNo: "",
        particulars: "",
        rate: "",
        hsn: ""
    });

    const [searchTerm, setSearchTerm] = useState("");

    const [newPart, setNewPart] = useState({
        itemNo: "",
        particulars: "",
        rate: "",
        hsn: ""
    });


    const { parts, loading, deletePart, addPart, updatePart } = usePart();
    const { hsns } = useHsn();

    const modalRef = useRef(null);

    const handleAddPart = async (e) => {
        e.preventDefault();

        if (
            !newPart.itemNo ||
            !newPart.particulars ||
            !newPart.rate ||
            !newPart.hsn
        ) {
            showToast("Please fill all fields");
            return;
        }

        try {
            await addPart({
                itemNo: newPart.itemNo,
                particulars: newPart.particulars,
                rate: Number(newPart.rate),
                hsn: newPart.hsn
            });

            setNewPart({
                itemNo: "",
                particulars: "",
                rate: "",
                hsn: ""
            });

            setShowModal(false);
        } catch (err) {
            console.error(err);
        }
    };

   

    const handleEdit = (part) => {
        setEditId(part._id);

        setEditPart({
            itemNo: part.itemNo,
            particulars: part.particulars,
            rate: part.rate,
            hsn: part.hsn?._id
        });
    };

    const handleSaveEdit = async (id) => {
        try {
            await updatePart(id, {
                itemNo: editPart.itemNo,
                particulars: editPart.particulars,
                rate: Number(editPart.rate),
                hsn: editPart.hsn
            });

            setEditId(null);
        } catch (err) {
            console.error(err);
        }
    };
    const handleDelete = async (id) => {
        await deletePart(id);
    };
    const filteredParts = parts.filter(
        (p) =>
            p.particulars &&
            p.particulars
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const clearInitialValue = () => {
        setNewPart({
            itemNo: "",
            particulars: "",
            rate: "",
            hsn: ""
        })
    }



    return (
        <div className="box">
            <h2>PART MASTER</h2>

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

                <div className="salesman-table-grid4 salesman-table-header">
                    <div>Sr No.</div>
                    <div>Item No.</div>
                    <div>Particulars</div>
                    <div>Rate </div>
                    <div>HSN</div>
                    <div>Action</div>

                </div>

                {loading && <div className="loading">Loading</div>}

                {filteredParts.map((part, index) => (
                    <div
                        key={part._id || index}
                        className="salesman-table-grid4 salesman-table-row"
                    >
                        <div>{index + 1}</div>

                        {editId === part._id ? (
                            <>
                                <input
                                    type="text"
                                    value={editPart.itemNo}
                                    onChange={(e) =>
                                        setEditPart({
                                            ...editPart,
                                            itemNo: e.target.value
                                        })
                                    }
                                />   

                                <input
                                    type="text"
                                    value={editPart.particulars}
                                    onChange={(e) =>
                                        setEditPart({
                                            ...editPart,
                                            particulars: e.target.value
                                        })
                                    }
                                />

                                <input
                                    type="number"
                                    value={editPart.rate}
                                    onChange={(e) =>
                                        setEditPart({
                                            ...editPart,
                                            rate: e.target.value
                                        })
                                    }
                                />

                                <select
                                    value={editPart.hsn}
                                    onChange={(e) =>
                                        setEditPart({
                                            ...editPart,
                                            hsn: e.target.value
                                        })
                                    }
                                >
                                    {hsns.map((h) => (
                                        <option key={h._id} value={h._id}>
                                            {h.forWhat} 
                                        </option>
                                    ))}
                                </select>

                                <div className="actions">
                                    <button
                                        className="save"
                                        onClick={() =>
                                            handleSaveEdit(part._id)
                                        }
                                    >
                                        Save
                                    </button>

                                    {" | "}

                                    <span
                                        className="cancel"
                                        onClick={() =>
                                            setEditId(null)
                                        }
                                    >
                                        Cancel
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>{part.itemNo}</div>

                                <div>{part.particulars}</div>

                                <div>{part.rate}</div>

                                <div>
                                   
                                    {part.hsn?.hsnCode}
                                    
                                </div>

                                <div className="actions">
                                    <span
                                        className="edit"
                                        onClick={() =>
                                            handleEdit(part)
                                        }
                                    >
                                        Edit
                                    </span>

                                    {" | "}

                                    <span
                                        className="delete"
                                        onClick={() =>
                                            handleDelete(part._id)
                                        }
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
                            <h2>Add New Part</h2>

                            <form
                                className="modal-form"
                                onSubmit={handleAddPart}
                            >
                                <div className="form-group">
                                    <label>Item No</label>

                                    <input
                                        type="text"
                                        value={newPart.itemNo}
                                        onChange={(e) =>
                                            setNewPart({
                                                ...newPart,
                                                itemNo: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Particulars</label>

                                    <input
                                        type="text"
                                        value={newPart.particulars}
                                        onChange={(e) =>
                                            setNewPart({
                                                ...newPart,
                                                particulars:
                                                    e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Rate</label>

                                    <input
                                        type="number"
                                        value={newPart.rate}
                                        onChange={(e) =>
                                            setNewPart({
                                                ...newPart,
                                                rate: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>HSN</label>

                                    <select
                                        value={newPart.hsn}
                                        onChange={(e) =>
                                            setNewPart({
                                                ...newPart,
                                                hsn: e.target.value
                                            })
                                        }
                                    >
                                        <option value="">
                                            Select HSN
                                        </option>

                                        {hsns.map((h) => (
                                            <option
                                                key={h._id}
                                                value={h._id}
                                            >
                                                {h.forWhat} 
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="modal-buttons">
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                    >
                                        Save
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() =>
                                            setShowModal(false)
                                        }
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {!loading && filteredParts.length === 0 && (
                    <div className="no-data">No Part found.</div>
                )}
            </div>

        </div>
    );

}
export default Part;
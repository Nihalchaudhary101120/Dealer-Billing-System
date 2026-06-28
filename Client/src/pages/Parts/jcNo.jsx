
import React, { useState, useEffect, useRef } from "react";
import api from "../../api/api";
import "../dealer.css";
import { useToast } from "../../context/ToastContext";

const JcNo = () => {
    const { showToast } = useToast();

    const [jcNos, setJcNos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [editId, setEditId] = useState(null);
    const [editJc, setEditJc] = useState({});

    const [newJc, setNewJc] = useState({
        jcNo: ""
    });

    const modalRef = useRef(null);

    useEffect(() => {
        getAllJcNos();
    }, []);

    const getAllJcNos = async () => {
        try {
            setLoading(true);

            const res = await api.get("/jcno");

            if (res.data.success) {
                setJcNos(res.data.jcNos);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddJc = async (e) => {
        e.preventDefault();

        if (!newJc.jcNo) {
            showToast("Please enter JC No");
            return;
        }

        try {
            const res = await api.post("/jcno", {
                jcNo: Number(newJc.jcNo)
            });

            if (res.data.success) {
                showToast(res.data.message);
                setJcNos(prev => [...prev, res.data.created]);
                setNewJc({ jcNo: "" });
                setShowModal(false);
            }
        } catch (err) {
            console.error(err);
            showToast(
                err?.response?.data?.message || "Error creating JC No"
            );
        }
    };

    const handleEdit = (jc) => {
        setEditId(jc._id);
        setEditJc({ ...jc });
    };

    const handleSaveEdit = async (id) => {
        try {
            const res = await api.patch(`/jcno/${id}`, {
                jcNo: Number(editJc.jcNo)
            });

            if (res.data.success) {
                setJcNos(prev =>
                    prev.map(j =>
                        j._id === id ? res.data.updated : j
                    )
                );

                setEditId(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await api.delete(`/jcno/${id}`);

            if (res.data.success) {
                setJcNos(prev =>
                    prev.filter(j => j._id !== id)
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredJcNos = jcNos.filter(
        (j) =>
            String(j.jcNo)
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="box">
            <h2>JC NO MASTER</h2>

            <div className="salesman-container">

                <div className="salesman-header-row">

                    <input
                        type="text"
                        placeholder="Search JC No..."
                        className="salesman-search-box"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                    <button
                        className="salesman-new-item-btn"
                        onClick={() => {
                            setNewJc({ jcNo: "" });
                            setShowModal(true);
                        }}
                    >
                        +New
                    </button>

                </div>

                <div className="salesman-table-grid3 salesman-table-header">
                    <div>Sr No.</div>
                    <div>JC No</div>
                    <div>Action</div>
                </div>

                {loading && (
                    <div className="loading">
                        Loading...
                    </div>
                )}

                {filteredJcNos.map((jc, index) => (
                    <div
                        key={jc._id}
                        className="salesman-table-grid3 salesman-table-row"
                    >
                        <div>{index + 1}</div>

                        {editId === jc._id ? (
                            <>
                                <input
                                    type="number"
                                    value={editJc.jcNo}
                                    onChange={(e) =>
                                        setEditJc({
                                            ...editJc,
                                            jcNo: e.target.value
                                        })
                                    }
                                />

                                <div className="actions">
                                    <button
                                        className="save"
                                        onClick={() =>
                                            handleSaveEdit(jc._id)
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
                                <div>{jc.jcNo}</div>

                                <div className="actions">
                                    <span
                                        className="edit"
                                        onClick={() =>
                                            handleEdit(jc)
                                        }
                                    >
                                        Edit
                                    </span>

                                    {" | "}

                                    <span
                                        className="delete"
                                        onClick={() =>
                                            handleDelete(jc._id)
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
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="modal"
                            ref={modalRef}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >
                            <h2>Add JC No</h2>

                            <form
                                className="modal-form"
                                onSubmit={handleAddJc}
                            >
                                <div className="form-group">
                                    <label>JC No</label>

                                    <input
                                        type="number"
                                        placeholder="JcNo"
                                        value={newJc.jcNo}
                                        onChange={(e) =>
                                            setNewJc({
                                                jcNo:
                                                    e.target.value
                                            })
                                        }
                                    />
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
            </div>
        </div>
    );
};

export default JcNo;


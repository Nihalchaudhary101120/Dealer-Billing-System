// import React, { useState,  useRef, useEffect } from "react";

// import "./color.css";
// import { useBike } from "../../context/BikeContext";

// const BikeScheme = () => {
//     const { schemes, addScheme, updateScheme, deleteScheme, loading } = useBike();
//     const [editId, setEditId] = useState(null);
//     const [editValue, setEditValue] = useState("");
//     const [showForm, setShowForm] = useState(false);
//     const [newScheme, setNewScheme] = useState("");
//     const [searchTerm, setSearchTerm] = useState("");
//     const addInputRef = useRef(null);
//     const searchRef = useRef(null);

//     useEffect(() => {
//         if (showForm && addInputRef.current) addInputRef.current.focus();
//     }, [showForm]);

//     const filteredSchemes = schemes.filter((scheme) => (
//         scheme?.scheme ?? "").toLowerCase().includes(searchTerm.toLowerCase()));

//     const handleAddScheme = async () => {
//         if (newScheme.trim() === "") return;
//         await addScheme({ scheme: newScheme });
//         setNewScheme("");
//     };

//     const handleSaveEdit = async (id) => {
//         if (editValue.trim() === "") return;
//         await updateScheme(id, { scheme: editValue });
//         setEditId(null);
//         setEditValue("");
//     };

//     const handleDelete = async (id) => {
//         await deleteScheme(id);
//     }


//     return (
//         <div className="container-wrapper">
//             <div className="top-bar">
//                 <input
//                     type="text"
//                     ref={searchRef}
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="🔍 Search Scheme..."
//                     className="search-input"
//                 />
//                 <button className="add-btn-con" onClick={() => setShowForm(true)}>
//                     + New
//                 </button>
//             </div>

//             {showForm && (
//                 <div className="form-wrapper">
//                     <input
//                         type="text"
//                         value={newScheme}
//                         ref={addInputRef}
//                         onChange={(e) => setNewScheme(e.target.value)}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                                 handleAddScheme();
//                             }
//                         }}
//                         placeholder="Enter Scheme name"
//                         className="name-input"
//                     />
//                     <button onClick={handleAddScheme}>Add</button>
//                     <button onClick={() => setShowForm(false)}>Cancel</button>
//                 </div>
//             )}

//             <div className="grid-layout header-section">
//                 <div>S NO.</div>
//                 <div>SCHEME</div>
//                 <div>ACTIONS</div>
//             </div>

//             {loading && <div className="loading">Loading...</div>}

//             {filteredSchemes.map((item, index) => (
//                 <div key={item._id || index} className="grid-layout data-row">
//                     <div>{index + 1}</div>

//                     <div>
//                         {editId === item._id ? (
//                             <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={(e) => setEditValue(e.target.value)}
//                                 onKeyDown={(e) => {
//                                     if (e.key === "Enter") handleSaveEdit(item._id);
//                                 }}
//                                 autoFocus
//                                 className="inline-edit"
//                             />
//                         ) : (
//                             item.scheme
//                         )}
//                     </div>

//                     <div className="action-buttons">
//                         {editId === item._id ? (
//                             <>
//                                 <span
//                                     className="btn-save"
//                                     onClick={() => handleSaveEdit(item._id)}
//                                 >
//                                     Save
//                                 </span>{" "}
//                                 |{" "}
//                                 <span
//                                     className="btn-cancel"
//                                     onClick={() => setEditId(null)}
//                                 >
//                                     Cancel
//                                 </span>
//                             </>
//                         ) : (
//                             <>
//                                 <span
//                                     className="btn-edit"
//                                     onClick={() => {
//                                         setEditId(item._id);
//                                         setEditValue(item.name);
//                                     }}
//                                 >
//                                     Edit
//                                 </span>{" "}
//                                 |{" "}
//                                 <span
//                                     className="btn-delete"
//                                     onClick={() => handleDelete(item._id)}
//                                 >
//                                     Delete
//                                 </span>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             ))}
//             {!loading && filteredSchemes.length === 0 && (
//                 <div className="no-data">No colors found.</div>
//             )}
//         </div>
//     );
// }

// export default BikeScheme;


import React, { useState, useMemo, useRef, useEffect } from "react";
import "./color.css";
import { useBike } from "../../context/BikeContext";

const BikeScheme = () => {
    const { schemes, models, addScheme, updateScheme, deleteScheme, loading } = useBike();

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const modalRef = useRef(null);

    const [formData, setFormData] = useState({
        scheme: "",
        fromDate: "",
        toDate: "",
        toBike: "",
        value: ""
    });

    const filteredSchemes = useMemo(() => {
        return schemes.filter(s =>
            s.scheme?.toLowerCase().includes(search.toLowerCase())
        );
    }, [schemes, search]);

    const resetForm = () => {
        setFormData({
            scheme: "",
            fromDate: "",
            toDate: "",
            toBike: "",
            value: ""
        });
    };

    const openAddModal = () => {
        setEditingId(null);
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setEditingId(item._id);
        setFormData({
            scheme: item.scheme,
            fromDate: item.fromDate?.split("T")[0],
            toDate: item.toDate?.split("T")[0],
            toBike: item.toBike?._id || item.toBike,
            value: item.value
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { scheme, fromDate, toDate, toBike, value } = formData;
        if (!scheme || !fromDate || !toDate || !toBike || !value) return;

        try {
            setIsSubmitting(true);

            if (editingId) {
                await updateScheme(editingId, formData);
            } else {
                await addScheme(formData);
            }

            setShowModal(false);
            resetForm();
            setEditingId(null);

        } finally {
            setIsSubmitting(false);
        }
    };

    // Close modal on outside click
    useEffect(() => {
        const handleOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowModal(false);
            }
        };

        if (showModal) document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [showModal]);

    return (
        <div className="container-wrapper">

            {/* Top Bar */}
            <div className="top-bar">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 Search Scheme..."
                    className="search-input"
                />
                <button className="add-btn-con" onClick={openAddModal}>
                    + New
                </button>
            </div>

            {/* Header */}
            <div className="grid-layout header-section">
                <div>#</div>
                <div>Scheme</div>
                <div>From</div>
                <div>To</div>
                <div>Bike</div>
                <div>Value</div>
                <div>Actions</div>
            </div>

            {loading && <div className="loading">Loading...</div>}

            {!loading && filteredSchemes.map((item, index) => (
                <div key={item._id} className="grid-layout data-row">
                    <div>{index + 1}</div>
                    <div>{item.scheme}</div>
                    <div>{new Date(item.fromDate).toLocaleDateString()}</div>
                    <div>{new Date(item.toDate).toLocaleDateString()}</div>
                    <div>{item.toBike?.model}</div>
                    <div>{item.value}</div>
                    <div className="action-buttons">
                        <span className="btn-edit" onClick={() => openEditModal(item)}>
                            Edit
                        </span>
                        {" | "}
                        <span className="btn-delete" onClick={() => deleteScheme(item._id)}>
                            Delete
                        </span>
                    </div>
                </div>
            ))}

            {!loading && filteredSchemes.length === 0 && (
                <div className="no-data">No schemes found.</div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal" ref={modalRef}>
                        <h2>{editingId ? "Edit Scheme" : "Add Scheme"}</h2>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label>Scheme Name</label>
                                <input
                                    type="text"
                                    value={formData.scheme}
                                    onChange={(e) =>
                                        setFormData({ ...formData, scheme: e.target.value })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>From Date</label>
                                <input
                                    type="date"
                                    value={formData.fromDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fromDate: e.target.value })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>To Date</label>
                                <input
                                    type="date"
                                    value={formData.toDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, toDate: e.target.value })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Bike</label>
                                <select
                                    value={formData.toBike}
                                    onChange={(e) =>
                                        setFormData({ ...formData, toBike: e.target.value })
                                    }
                                >
                                    <option value="">Select Bike</option>
                                    {models.map((m) => (
                                        <option key={m._id} value={m._id}>
                                            {m.model}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Value</label>
                                <input
                                    type="number"
                                    value={formData.value}
                                    onChange={(e) =>
                                        setFormData({ ...formData, value: e.target.value })
                                    }
                                />
                            </div>

                            <div className="modal-buttons">
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Saving..."
                                        : editingId
                                            ? "Update"
                                            : "Save"}
                                </button>

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                        setEditingId(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BikeScheme;
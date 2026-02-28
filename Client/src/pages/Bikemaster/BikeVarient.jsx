import React, { useState, useMemo , useRef, useEffect } from "react";
import "./color.css";
import { useBike } from "../../context/BikeContext";

const BikeVarient = () => {
  const { varients, addVarient, updateVarient, deleteVarient, loading } = useBike();

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newVarient, setNewVarient] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const addInputRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (showForm && addInputRef.current) addInputRef.current.focus();
  }, [showForm]);

  const filteredVarients = varients.filter((item) =>
    item.varient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVarient = async () => {
    if (newVarient.trim() === "") return;
    await addVarient({ varient: newVarient.toUpperCase() });
    setNewVarient("");
  };

  const handleSaveEdit = async (id) => {
    if (editValue.trim() === "") return;
    await updateVarient(id, { varient: editValue.toUpperCase() });
    setEditId(null);
    setEditValue("");
  };

  const handleDelete = async (id) => {
    await deleteVarient(id);
  };

  return (
    <div className="container-wrapper">
      <div className="top-bar">
        <input
          type="text"
          ref={searchRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search Varients..."
          className="search-input"
        />
        <button className="add-btn-con" onClick={() => setShowForm(true)}>
          + New
        </button>
      </div>

      {showForm && (
        <div className="form-wrapper">
          <input
            type="text"
            value={newVarient}
            ref={addInputRef}
            onChange={(e) => setNewVarient(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddVarient();
              }
            }}
            placeholder="Enter varient name"
            className="name-input"
          />
          <button onClick={handleAddVarient}>Add</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      <div className="grid-layout header-section">
        <div>S NO.</div>
        <div>VARIENT</div>
        <div>ACTIONS</div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {filteredVarients.map((item, index) => (
        <div key={item._id || index} className="grid-layout data-row">
          <div>{index + 1}</div>

          <div>
            {editId === item._id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(item._id);
                }}
                autoFocus
                className="inline-edit"
              />
            ) : (
              item.varient
            )}
          </div>

          <div className="action-buttons">
            {editId === item._id ? (
              <>
                <span
                  className="btn-save"
                  onClick={() => handleSaveEdit(item._id)}
                >
                  Save
                </span>{" "}
                |{" "}
                <span
                  className="btn-cancel"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </span>
              </>
            ) : (
              <>
                <span
                  className="btn-edit"
                  onClick={() => {
                    setEditId(item._id);
                    setEditValue(item.name);
                  }}
                >
                  Edit
                </span>{" "}
                |{" "}
                <span
                  className="btn-delete"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </span>
              </>
            )}
          </div>
        </div>
      ))}
      {!loading && filteredVarients.length === 0 && (
        <div className="no-data">No varients found.</div>
      )}
    </div>
  );
};

export default BikeVarient;

import React, { useState, useRef, useEffect } from "react";
import "./color.css";
import { useBike } from "../../context/BikeContext";

const BikeModel = () => {
  const { models, addModel, updateModel, deleteModel, loading } = useBike();

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newModel, setNewModel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const addInputRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (showForm && addInputRef.current) addInputRef.current.focus();
  }, [showForm]);

  const filteredModels = (models || []).filter((item) =>
    (item?.model ?? "").toLowerCase().includes((searchTerm ?? "").toLowerCase())
  );

  const handleAddModel = async () => {
    if (newModel.trim() === "") return;
    await addModel({ model: newModel.toUpperCase() });
    setNewModel("");
  };

  const handleSaveEdit = async (id) => {
    if (editValue.trim() === "") return;
    await updateModel(id, { model: editValue.toUpperCase() });
    setEditId(null);
    setEditValue("");
  };

  const handleDelete = async (id) => {
    await deleteModel(id);
  };

  return (
    <div className="container-wrapper">
      <div className="top-bar">
        <input
          type="text"
          ref={searchRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search Models..."
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
            value={newModel}
            ref={addInputRef}
            onChange={(e) => setNewModel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddModel();
              }
            }}
            placeholder="Enter model name"
            className="name-input"
          />
          <button onClick={handleAddModel}>Add</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      <div className="grid-layout header-section">
        <div>S NO.</div>
        <div>MODEL</div>
        <div>ACTIONS</div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {filteredModels.map((item, index) => (
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
              item.model
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
                    setEditValue(item.model);
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
      {!loading && filteredModels.length === 0 && (
        <div className="no-data">No Models found.</div>
      )}
    </div>
  );
};

export default BikeModel;

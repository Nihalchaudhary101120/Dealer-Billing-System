import React, { useState, useMemo , useRef, useEffect } from "react";
import "./color.css";
import { useBike } from "../../context/BikeContext";

const BikeColor = () => {
  const { colors, addColor, updateColor, deleteColor, loading } = useBike();

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const addInputRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (showForm && addInputRef.current) addInputRef.current.focus();
  }, [showForm]);

  const filteredColors = colors.filter((item) =>
    (item?.color ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddColor = async () => {
    if (newColor.trim() === "") return;
    await addColor({ color: newColor.toUpperCase() });
    setNewColor("");
  };

  const handleSaveEdit = async (id) => {
    if (editValue.trim() === "") return;
    await updateColor(id, { color: editValue.toUpperCase() });
    setEditId(null);
    setEditValue("");
  };

  const handleDelete = async (id) => {
    await deleteColor(id);
  };

  return (
    <div className="container-wrapper">
      <div className="top-bar">
        <input
          type="text"
          ref={searchRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search Colors..."
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
            value={newColor}
            ref={addInputRef}
            onChange={(e) => setNewColor(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddColor();
              }
            }}
            placeholder="Enter color name"
            className="name-input"
          />
          <button onClick={handleAddColor}>Add</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      <div className="grid-layout header-section">
        <div>S NO.</div>
        <div>COLOR</div>
        <div>ACTIONS</div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {filteredColors.map((item, index) => (
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
              item.color
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
      {!loading && filteredColors.length === 0 && (
        <div className="no-data">No colors found.</div>
      )}
    </div>
  );
};

export default BikeColor;

import React, { useState, useMemo } from "react";
import "./color.css";
import { useBike } from "../../context/BikeContext";

const BikeColor = () => {
  const { colors, addColor, updateColor, deleteColor, loading } = useBike();

  const [formVisible, setFormVisible] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [editing, setEditing] = useState(null); // { id, value }
  const [search, setSearch] = useState("");

  const filteredColors = useMemo(() => {
    return colors.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [colors, search]);

  const handleAdd = async () => {
    const value = newColor.trim();
    if (!value) return;

    await addColor({ color: value.toUpperCase() });
    setNewColor("");
    setFormVisible(false);
  };

  const handleUpdate = async () => {
    if (!editing?.value.trim()) return;

    await updateColor(editing.id, {
      name: editing.value.toUpperCase()
    });

    setEditing(null);
  };

  return (
    <div className="color-wrapper">

      {/* Top Bar */}
      <div className="color-topbar">
        <input
          type="text"
          placeholder="Search colors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setFormVisible(true)}>+ New</button>
      </div>

      {/* Add Form */}
      {formVisible && (
        <div className="color-form">
          <input
            type="text"
            placeholder="Enter color name"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
          />
          <button onClick={handleAdd}>Add</button>
          <button onClick={() => setFormVisible(false)}>Cancel</button>
        </div>
      )}

      {/* Header */}
      <div className="color-grid header">
        <div>#</div>
        <div>Name</div>
        <div>Actions</div>
      </div>

      {/* Loading */}
      {loading && <div className="loading">Loading...</div>}

      {/* Data */}
      {!loading &&
        filteredColors.map((color, index) => (
          <div key={color._id} className="color-grid row">
            <div>{index + 1}</div>

            <div>
              {editing?.id === color._id ? (
                <input
                  value={editing.value}
                  onChange={(e) =>
                    setEditing({ ...editing, value: e.target.value })
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleUpdate()
                  }
                  autoFocus
                />
              ) : (
                color.name
              )}
            </div>

            <div className="actions">
              {editing?.id === color._id ? (
                <>
                  <span onClick={handleUpdate} className="save">Save</span>
                  <span onClick={() => setEditing(null)} className="cancel">
                    Cancel
                  </span>
                </>
              ) : (
                <>
                  <span
                    onClick={() =>
                      setEditing({ id: color._id, value: color.name })
                    }
                    className="edit"
                  >
                    Edit
                  </span>
                  <span
                    onClick={() => deleteColor(color._id)}
                    className="delete"
                  >
                    Delete
                  </span>
                </>
              )}
            </div>
          </div>
        ))}

      {!loading && filteredColors.length === 0 && (
        <div className="no-data">No colors found</div>
      )}
    </div>
  );
};

export default BikeColor;
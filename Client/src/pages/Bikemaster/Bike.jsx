
import React, { useState, useMemo, useRef } from "react";
import "./bike.css";
import { useBike } from "../../context/BikeContext";
import { useToast } from "../../context/ToastContext";

const Bike = () => {
  const { showToast } = useToast();
  const {
    bikes,
    models,
    varients,
    colors,
    loading,
    addBike,
    updateBike,
    deleteBike
  } = useBike();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    variant: "",
    colorOptions: "",
    basePrice: "",
    hsnCode: ""
  });

  const modalRef = useRef(null);
  const modalBrandRef = useRef(null);
  const modalModelNameRef = useRef(null);
  const modalVarientRef = useRef(null);
  const modalColorRef = useRef(null);
  const modalBasePriceRef = useRef(null);
  const modalHsnCodeRef = useRef(null);
  const modalSaveBtnRef = useRef(null);


  const filteredBikes = useMemo(() => {
    return bikes.filter(b =>
      (b?.modelName?.model ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [bikes, search]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      brand: "",
      model: "",
      variant: "",
      colorOptions: "",
      basePrice: "",
      hsnCode: ""
    });
    setShowModal(true);
  };

  const handleModalKeyNavigation = (e, nextField) => {
    if (["Enter", "ArrowDown", "ArrowRight"].includes(e.key)) {
      e.preventDefault();

      switch (nextField) {
        case "model":
          modalModelNameRef.current?.focus();
          break;
        case "variant":
          modalVarientRef.current?.focus();
          break;
        case "color":
          modalColorRef.current?.focus();
          break;
        case "baseprice":
          modalBasePriceRef.current?.focus();
          break;
        case "hsnCode":
          modalHsnCodeRef.current?.focus();
          break;
        case "save":
          modalSaveBtnRef.current?.focus();
          break;
        default:
          break;
      }
    }
  };

  const openEditModal = (bike) => {
    setEditingId(bike._id);
    setFormData({
      brand: bike.brand,
      model: bike.modelName?._id,
      variant: bike.variant?._id,
      colorOptions: bike.colorOptions?._id,
      basePrice: bike.basePrice,
      hsnCode: bike.hsnCode
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation before even mapping names
    if (!formData.model || !formData.variant || !formData.colorOptions || !formData.basePrice) {
      showToast("Fill all fields", "error");
      return;
    }

    // backend expects "modelName" instead of "model"; build a payload accordingly
    const payload = {
      brand: formData.brand,
      modelName: formData?.model,
      variant: formData.variant,
      colorOptions: formData.colorOptions,
      basePrice: formData.basePrice,
      hsnCode: formData.hsnCode,
    };

    console.log("payload to send", payload);

    try {
      setIsSubmitting(true);
      if (editingId) {
        await updateBike(editingId, payload);
      } else {
        await addBike(payload);
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="table-container">

      <div className="header-row">
        <input
          type="text"
          placeholder="Search Model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />
        <button className="new-item-btn" onClick={openAddModal}>
          + New Bike
        </button>
      </div>

      <div className="tabular-grid tabular-header">
        <div>S NO.</div>
        <div>Brand</div>
        <div>Model</div>
        <div>Variant</div>
        <div>Color</div>
        <div>Base Price</div>
        <div>HSN</div>
        <div>Actions</div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {!loading && filteredBikes.map((bike, index) => (
        <div key={bike._id} className="tabular-grid table-row">
          <div>{index + 1}</div>
          <div>{bike.brand}</div>
          <div>{bike.modelName?.model}</div>
          <div>{bike.variant?.varient}</div>
          <div>{bike.colorOptions?.color}</div>
          <div>₹ {bike.basePrice}</div>
          <div>{bike.hsnCode}</div>
          <div className="actions">
            <span onClick={() => openEditModal(bike)} className="edit">Edit</span>
            {" | "}
            <span onClick={() => deleteBike(bike._id)} className="delete">Delete</span>
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <h2>{editingId ? "Edit Bike" : "Add New Bike"}</h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Brand</label>
                <input
                  ref={modalBrandRef}
                  type="text"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      brand: e.target.value.toUpperCase()
                    })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "model")}
                  placeholder="Enter Brand"
                />
              </div>

              <div className="form-group">
                <label>Model</label>
                <select
                  ref={modalModelNameRef}
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "variant")}
                >
                  <option value="">Select Model</option>
                  {models.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Variant</label>
                <select
                  ref={modalVarientRef}
                  value={formData.variant}
                  onChange={(e) =>
                    setFormData({ ...formData, variant: e.target.value })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "color")}
                >
                  <option value="">Select Variant</option>
                  {varients.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.varient}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Color</label>
                <select
                  ref={modalColorRef}
                  value={formData.colorOptions}
                  onChange={(e) =>
                    setFormData({ ...formData, colorOptions: e.target.value })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "baseprice")}
                >
                  <option value="">Select Color</option>
                  {colors.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.color}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Base Price</label>
                <input
                  ref={modalBasePriceRef}
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "hsnCode")}
                  placeholder="Enter Base Price"
                />
              </div>

              <div className="form-group">
                <label>HSN Code</label>
                <input
                  ref={modalHsnCodeRef}
                  type="text"
                  value={formData.hsnCode}
                  onChange={(e) =>
                    setFormData({ ...formData, hsnCode: e.target.value })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "save")}
                  placeholder="Enter HSN Code"
                />
              </div>

              <div className="modal-buttons">
                <button
                  type="submit"
                  className="submit-btn"
                  ref={modalSaveBtnRef}
                  disabled={isSubmitting}
                  onKeyDown={(e) => handleModalKeyNavigation(e, "save")}
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update" : "Save"}
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
    </div>
  );
};

export default Bike;
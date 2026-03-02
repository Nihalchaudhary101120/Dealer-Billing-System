import React, { useState, useEffect } from "react";
import api from "../../api/api.js";
import "../dealer.css";
import { useToast } from "../../context/ToastContext.jsx";
import { useBike } from "../../context/BikeContext.jsx";
import { useNavigate } from "react-router-dom";

const Draft = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [allInvoice, setAllInvoice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { bikes } = useBike();

  const getAllDraft = async () => {
    try {
      setLoading(true);
      const res = await api.get("/invoice/draft");

      console.log("drafts", res.data?.drafts);

      if (res.data?.success) {
        showToast(res.data.message, "success");
        setAllInvoice(res.data?.drafts || []);
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Error getting drafts",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = async (id) => {
    if (!id) return;
    navigate(`/invoice/create/${id}`);
  }


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Draft?')) {
      return;
    }
    try {
      const res = await api.delete(`/invoice/${id}`);
      showToast(res.data?.message, "success");
      setAllInvoice((prev) =>
        prev.filter((inv) => inv._id !== id)
      );
    }
    catch (err) {
      showToast(err.response?.data?.message || "Error deleting draft");

    }
  }

  const filteredAllInvoice = allInvoice.filter((i)=>
    i?.customerName && i.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getAllDraft();
  }, []);

  return (
    <div className="trans">
      <div className="trans-container">
        <div className="all-table">
          <input
            type="text"
            placeholder="🔍 Search Customer Draft..."
            className="salesman-search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="headerr">
            <div>CUSTOMER NAME</div>
            <div>CUSTOMER FATHERNAME</div>
            <div>MODEL </div>
            <div>VARIANT</div>
            <div>COLOR</div>
            <div>ACTIONS</div>
          </div>

          {filteredAllInvoice.length === 0 && (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#666',
              backgroundColor: 'white'
            }}>
              {loading ? 'Loading...' : "No Drafts found"}
            </div>
          )}

          {filteredAllInvoice.map((p, i) => {

            const matchedBike = Array.isArray(bikes) ? bikes.find((b) =>
              String(b._id) === String(p.bike) || ""
            ) : null

            return (
              <div key={p?._id || i} className="all-row11">
                <div>{p?.customerName}</div>
                <div>{p?.customerFatherName}</div>
                <div>{matchedBike?.modelName?.model}</div>
                <div>{matchedBike?.variant.varient}</div>
                <div>{matchedBike?.colorOptions?.color}</div>
                <div className="actions">
                  <span className="edit" onClick={() => handleEdit(p._id)}>
                    Edit
                  </span>
                  {" | "}
                  <span className="delete" onClick={() => handleDelete(p._id)}>
                    Delete
                  </span>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </div>

  );
};

export default Draft;
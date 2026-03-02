import React, { useState, useEffect } from 'react';
import api from "../../api/api.js";
import { useToast } from '../../context/ToastContext.jsx';
import { useBike } from '../../context/BikeContext.jsx';
import { useNavigate } from 'react-router-dom';
import InvoicePrint from './InvoicePrint.jsx';


const AllInvoice = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [allInvoice, setAllInvoice] = useState([]);
  const [invoicePrintId, setInvoicePrintId] = useState("");
  const [find, setFind] = useState({
    startDate: "",
    endDate: ""
  });
  const { bikes } = useBike();

  const [loading, setLoading] = useState(false);

  const handleFind = async (e) => {
    e.preventDefault();
    if (!find.startDate || !find.endDate) {
      showToast("Fill all fields", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/invoice/print", find);
      if (res.data?.success) {
        showToast(res.data?.message, "success");
        setAllInvoice(res.data?.inv);
        console.log(res.data?.inv);
        setFind({
          startDate: "",
          endDate: ""
        });
      }
    } catch (err) {
      console.error(err.response?.data?.message || "Error");
      showToast(err.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    if (!id) return;
    navigate(`/invoice/create/${id}`);
  }


  const [searchTerm, setSearchTerm] = useState("");
  const filteredAllInvoice = allInvoice.filter((i) =>
    i?.customerName && i.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="trans">
      <div className="trans-container">
        {invoicePrintId && (
          <InvoicePrint
            invoiceId={invoicePrintId}
            onClose={() => setInvoicePrintId(null)}
          />
        )}
        <div className="trans-form width100">
          <div className="flex2">
            <div className="form-group">
              <input
                type="date"
                value={find.startDate}
                onChange={(e) => setFind({ ...find, startDate: e.target.value })}
                placeholder='From'
              />
            </div>
            <div className="form-group">
              <input
                type="date"
                value={find.endDate}
                onChange={(e) => setFind({ ...find, endDate: e.target.value })}
                placeholder='To'
              />
            </div>
            <div className="form-group">
              <button
                type="button"
                onClick={handleFind}
                className="filter-btn"
              >
                Find
              </button>
            </div>
          </div>
        </div>
      </div>



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

          {allInvoice.length === 0 && (
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
                  <span className="delete" onClick={() => setInvoicePrintId(p._id)}>
                    Print
                  </span>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </div>

  )
}

export default AllInvoice

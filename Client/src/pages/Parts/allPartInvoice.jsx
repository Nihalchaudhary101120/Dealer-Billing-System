import React, { useState, useEffect } from 'react';
import api from "../../api/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import "../InvoiceMaster/invoice.css";
import { useNavigate } from 'react-router-dom';



const AllInvoice = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [allInvoice, setAllInvoice] = useState([]);
    const [invoicePrintId, setInvoicePrintId] = useState("");
    const [find, setFind] = useState({
        startDate: "",
        endDate: ""
    });

    const [loading, setLoading] = useState(false);

    const handleFind = async (e) => {
        e.preventDefault();
        if (!find.startDate || !find.endDate) {
            showToast("Fill all the field ", "error");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/partInvoice/print", find);
            console.log(res?.data);
            if (res.data?.success) {
                showToast(res.data?.message, "success");
                setAllInvoice(res.data?.inv);
                setFind({
                    startDate: "",
                    endDate: ""
                });
            }
        } catch (err) {
            showToast(err.response?.data?.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id) => {
        if (!id) return;
        navigate(`/part/invoice/${id}`);
    }


    const [searchTerm, setSearchTerm] = useState("");
    const filteredAllInvoice = allInvoice.filter((i) => i?.customer.name && i.customer.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const FormatDate = (isodate) => {
        if (!isodate) return ""
        const date = new Date(isodate);
        const day = String(date.getDate()).padStart(2, "0");
        const Month = String(date.getMonth() + 1).padStart(2, "0");
        const Year = date.getFullYear();
        return `${day}-${Month}-${Year}`
    };


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
              <p style={{ textAlign: "left" }}>Start-Date</p>
              <input
                type="date"
                value={find.startDate}
                onChange={(e) => setFind({ ...find, startDate: e.target.value })}
                placeholder='From'
              />
            </div>
            <div className="form-group">
              <p style={{textAlign: "left" }}>End-Date</p>
              <input
                type="date"
                value={find.endDate}
                onChange={(e) => setFind({ ...find, endDate: e.target.value })}
                placeholder='To'
              />
            </div>

            <div className="form-group excel">


              <button
                type="button"
                onClick={handleFind}
                className="filter-btn"
              >
                Find
              </button>
              {/* <button
                type="button"
                onClick={excelExportInvoices}
                className="filter-btn1"
              >
                Excel
              </button> */}
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
            <div>INVOICE </div>
            <div>CUSTOMER NAME</div>
            <div>MODEL </div>
            <div>Regn No.</div>
            <div>JC-No.</div>                   
            <div>mechanic</div>
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

            
            return (
              <div key={p?._id || i} className="all-row11">
                <div>{p?.invoiceNo}</div>
                <div>{p?.customer?.name}</div>
                <div>{p?.BikeModel?.modelName.model}</div>
                <div>{p?.vehicle?.regnNo}</div>
                <div>{p?.jcNo}</div>
                <div>{p?.service.mechanic}</div>
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
export default AllInvoice;
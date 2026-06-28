import React, { useState } from 'react';
import api from "../../api/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import "../InvoiceMaster/invoice.css";
import { useNavigate } from 'react-router-dom';
import InvoicePrint from './InvoicePrint.jsx'; // adjust path if needed

const AllInvoice = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [allInvoice, setAllInvoice]     = useState([]);
    const [printInvoice, setPrintInvoice] = useState(null); // holds full invoice object
    const [printLoading, setPrintLoading] = useState(false);
    const [find, setFind] = useState({ startDate: "", endDate: "" });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    /* ── fetch list by date range ── */
    const handleFind = async (e) => {
        e.preventDefault();
        if (!find.startDate || !find.endDate) {
            showToast("Fill all the fields", "error");
            return;
        }
        try {
            setLoading(true);
            const res = await api.post("/partInvoice/print", find);
            if (res.data?.success) {
                showToast(res.data?.message, "success");
                setAllInvoice(res.data?.inv);
                setFind({ startDate: "", endDate: "" });
            }
        } catch (err) {
            showToast(err.response?.data?.message || "Error fetching invoices", "error");
        } finally {
            setLoading(false);
        }
    };

    /* ── navigate to edit page ── */
    const handleEdit = (id) => {
        if (!id) return;
        navigate(`/part/invoice/${id}`);
    };

    /* ── fetch single invoice → open print modal ── */
    const handlePrint = async (id) => {
        if (!id) return;
        try {
            setPrintLoading(true);
            const res = await api.get(`/partInvoice/${id}`);
            if (res.data?.success) {
                setPrintInvoice(res.data.invoice);
            } else {
                showToast("Could not load invoice", "error");
            }
        } catch (err) {
            showToast(err.response?.data?.message || "Error loading invoice", "error");
        } finally {
            setPrintLoading(false);
        }
    };

    const FormatDate = (isodate) => {
        if (!isodate) return "";
        const date = new Date(isodate);
        const day   = String(date.getDate()).padStart(2, "0");
        const Month = String(date.getMonth() + 1).padStart(2, "0");
        const Year  = date.getFullYear();
        return `${day}-${Month}-${Year}`;
    };

    const filteredAllInvoice = allInvoice.filter(
        (i) => i?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="trans">

            {/* ── print modal overlay ── */}
            {printInvoice && (
                <InvoicePrint
                    invoice={printInvoice}
                    onClose={() => setPrintInvoice(null)}
                />
            )}

            {/* ── date filter ── */}
            <div className="trans-container">
                <div className="trans-form width100">
                    <div className="flex2">
                        <div className="form-group">
                            <p style={{ textAlign: "left" }}>Start-Date</p>
                            <input
                                type="date"
                                value={find.startDate}
                                onChange={(e) => setFind({ ...find, startDate: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <p style={{ textAlign: "left" }}>End-Date</p>
                            <input
                                type="date"
                                value={find.endDate}
                                onChange={(e) => setFind({ ...find, endDate: e.target.value })}
                            />
                        </div>
                        <div className="form-group excel">
                            <button type="button" onClick={handleFind} className="filter-btn">
                                {loading ? "Finding..." : "Find"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── table ── */}
            <div className="trans-container">
                <div className="all-table">
                    <input
                        type="text"
                        placeholder="🔍 Search Customer..."
                        className="salesman-search-box"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="headerr">
                        <div>INVOICE</div>
                        <div>CUSTOMER NAME</div>
                        <div>MODEL</div>
                        <div>Regn No.</div>
                        <div>JC-No.</div>
                        <div>Mechanic</div>
                        <div>ACTIONS</div>
                    </div>

                    {filteredAllInvoice.length === 0 && (
                        <div style={{ padding: "40px", textAlign: "center", color: "#666", background: "white" }}>
                            {loading ? "Loading..." : "No invoices found"}
                        </div>
                    )}

                    {filteredAllInvoice.map((p, i) => (
                        <div key={p?._id || i} className="all-row11">
                            <div>{p?.invoiceNo}</div>
                            <div>{p?.customer?.name}</div>
                            <div>{p?.BikeModel?.modelName?.model}</div>
                            <div>{p?.vehicle?.regnNo}</div>
                            <div>{p?.jcNo}</div>
                            <div>{p?.service?.mechanic}</div>
                            <div className="actions">
                                <span className="edit" onClick={() => handleEdit(p._id)}>Edit</span>
                                {" | "}
                                <span
                                    className="delete"
                                    onClick={() => handlePrint(p._id)}
                                    style={{ cursor: printLoading ? "wait" : "pointer" }}
                                >
                                    {printLoading ? "Loading..." : "Print"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllInvoice;
import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../../context/ToastContext";
import { useDealer } from "../../context/DealerContext";
import { useBillTo } from "../../context/BillToContext";
import { usePart } from "../../context/PartContext";
import { useBike } from "../../context/BikeContext";
import api from "../../api/api";

// import "../InvoiceMaster/invoice.css";
import "./partInvoice.css";

const PartInvoice = () => {
    const { showToast } = useToast();
    const { dealers } = useDealer();
    const { billTos } = useBillTo();
    const { parts } = usePart();
    const { models, varients } = useBike();

    // ─── Part Modal State ───────────────────────────────────────────────────────
    const [showPartModal, setShowPartModal] = useState(false);
    const [editPartIndex, setEditPartIndex] = useState(null);
    const [partModal, setPartModal] = useState({
        part: "",
        qty: 1,
        rate: 0,
        discount: 0,
        hsn: "",
        mrp: 0,
        sgstPercent: 9,
        cgstPercent: 9,
        taxable: 0,
        sgstAmount: 0,
        cgstAmount: 0,
        amount: 0,
    });

    // ─── Labour Modal State ─────────────────────────────────────────────────────
    const [showLabourModal, setShowLabourModal] = useState(false);
    const [editLabourIndex, setEditLabourIndex] = useState(null);
    const [labourModal, setLabourModal] = useState({
        particulars: "",
        qty: 1,
        rate: 0,
        discount: 0,
        sgstPercent: 9,
        cgstPercent: 9,
        taxable: 0,
        sgstAmount: 0,
        cgstAmount: 0,
        amount: 0,
    });

    // ─── Main Invoice State ─────────────────────────────────────────────────────
    const [newInvoice, setNewInvoice] = useState({
        dealer: "",
        billTo: "",
        billType: "CREDIT",
        jcNo: "",
        invoiceDate: new Date().toISOString().split("T")[0],
        customer: {
            name: "",
            mobile: "",
            address: "",
            gst: "",
        },
        vehicle: {
            regnNo: "",
            kms: "",
            frameNo: "",
        },
        BikeModel: {
            modelName: "",
            variant: "",
           
        },
        service: {
            jobType: "",
            mechanic: "",
            nxtDue: "",
            nxtDueDt: "",
        },
        parts: [],
        labours: [],
        summary: {
            partsQty: 0,
            labourQty: 0,
            taxableTotal: 0,
            sgstTotal: 0,
            cgstTotal: 0,
            grandTotal: 0,
            netTotal: 0,
        },
    });
    // ─── JC No fetch on mount ───────────────────────────────────────────────────
    const [jcNoData, setJcNoData] = useState(null);

    useEffect(() => {
        const fetchJcNo = async () => {
            try {
                const res = await api.get("/jcno");
                if (res.data?.success) {
                    const current = res.data.jcNos[0] || "0"; 
                    // only one exists
                    setJcNoData(current);
                    setNewInvoice((prev) => ({
                        ...prev,
                        jcNo: (current.jcNo || 0),
                    }));
                }
            } catch (err) {
                showToast(err?.response?.data?.message || "Error fetching JC No", "error");
            }
        };
        fetchJcNo();
    }, []);

    const [loading, setLoading] = useState(false);
   


    // ─── Recalculate Summary whenever parts or labours change ──────────────────
    useEffect(() => {
        const partsQty = newInvoice.parts.reduce((sum, p) => sum + Number(p.qty || 0), 0);
        const labourQty = newInvoice.labours.reduce((sum, l) => sum + Number(l.qty || 0), 0);
        const taxableTotal =
            newInvoice.parts.reduce((sum, p) => sum + Number(p.taxable || 0), 0) +
            newInvoice.labours.reduce((sum, l) => sum + Number(l.taxable || 0), 0);
        const sgstTotal =
            newInvoice.parts.reduce((sum, p) => sum + Number(p.sgstAmount || 0), 0) +
            newInvoice.labours.reduce((sum, l) => sum + Number(l.sgstAmount || 0), 0);
        const cgstTotal =
            newInvoice.parts.reduce((sum, p) => sum + Number(p.cgstAmount || 0), 0) +
            newInvoice.labours.reduce((sum, l) => sum + Number(l.cgstAmount || 0), 0);
        const grandTotal = taxableTotal + sgstTotal + cgstTotal;
        const netTotal = grandTotal;

        setNewInvoice((prev) => ({
            ...prev,
            summary: {
                partsQty,
                labourQty,
                taxableTotal,
                sgstTotal,
                cgstTotal,
                grandTotal,
                netTotal,
            },
        }));
    }, [newInvoice.parts, newInvoice.labours]);

    // ─── Part Modal: recalculate when part/qty/discount/gst changes ────────────
    useEffect(() => {
        const rate = Number(partModal.rate || 0);
        const qty = Number(partModal.qty || 1);
        const discount = Number(partModal.discount || 0);
        const sgstPercent = Number(partModal.sgstPercent || 9);
        const cgstPercent = Number(partModal.cgstPercent || 9);

        const taxable = (rate - discount) * qty;
        const sgstAmount = parseFloat(((taxable * sgstPercent) / 100).toFixed(2));
        const cgstAmount = parseFloat(((taxable * cgstPercent) / 100).toFixed(2));
        const amount = parseFloat((taxable + sgstAmount + cgstAmount).toFixed(2));

        setPartModal((prev) => ({
            ...prev,
            taxable,
            sgstAmount,
            cgstAmount,
            amount,
        }));
    }, [partModal.rate, partModal.qty, partModal.discount, partModal.sgstPercent, partModal.cgstPercent]);

    // ─── Labour Modal: recalculate when fields change ──────────────────────────
    useEffect(() => {
        const rate = Number(labourModal.rate || 0);
        const qty = Number(labourModal.qty || 1);
        const discount = Number(labourModal.discount || 0);
        const sgstPercent = Number(labourModal.sgstPercent || 9);
        const cgstPercent = Number(labourModal.cgstPercent || 9);

        const taxable = (rate - discount) * qty;
        const sgstAmount = parseFloat(((taxable * sgstPercent) / 100).toFixed(2));
        const cgstAmount = parseFloat(((taxable * cgstPercent) / 100).toFixed(2));
        const amount = parseFloat((taxable + sgstAmount + cgstAmount).toFixed(2));

        setLabourModal((prev) => ({
            ...prev,
            taxable,
            sgstAmount,
            cgstAmount,
            amount,
        }));
    }, [labourModal.rate, labourModal.qty, labourModal.discount, labourModal.sgstPercent, labourModal.cgstPercent]);

    // ─── Part Modal: when a part is selected, auto-fill rate/hsn/mrp/gst ───────
    const handlePartSelect = (partId) => {
        const selected = parts.find((p) => String(p._id) === String(partId));
        if (!selected) {
            setPartModal((prev) => ({ ...prev, part: partId }));
            return;
        }
        const hsnGst = Number(selected?.hsn?.gst || 18);
        const half = hsnGst / 2;
        setPartModal((prev) => ({
            ...prev,
            part: partId,
            rate: Number(selected.rate || 0),
            mrp: Number(selected.rate || 0),
            hsn: selected.hsn?._id || "",
            sgstPercent: half,
            cgstPercent: half,
        }));
    };

    // ─── Open Part Modal for Add ────────────────────────────────────────────────
    const openAddPartModal = () => {
        setEditPartIndex(null);
        setPartModal({
            part: "",
            qty: 1,
            rate: 0,
            discount: 0,
            hsn: "",
            mrp: 0,
            sgstPercent: 9,
            cgstPercent: 9,
            taxable: 0,
            sgstAmount: 0,
            cgstAmount: 0,
            amount: 0,
        });
        setShowPartModal(true);
    };

    // ─── Open Part Modal for Edit ───────────────────────────────────────────────
    const openEditPartModal = (index) => {
        setEditPartIndex(index);
        setPartModal({ ...newInvoice.parts[index] });
        setShowPartModal(true);
    };

    // ─── Save Part from Modal ───────────────────────────────────────────────────
    const savePartModal = () => {
        if (!partModal.part) {
            showToast("Please select a part", "error");
            return;
        }
        if (editPartIndex !== null) {
            const updated = [...newInvoice.parts];
            updated[editPartIndex] = { ...partModal };
            setNewInvoice((prev) => ({ ...prev, parts: updated }));
        } else {
            setNewInvoice((prev) => ({
                ...prev,
                parts: [...prev.parts, { ...partModal }],
            }));
        }
        setShowPartModal(false);
    };

    // ─── Delete Part Row ────────────────────────────────────────────────────────
    const deletePart = (index) => {
        const updated = newInvoice.parts.filter((_, i) => i !== index);
        setNewInvoice((prev) => ({ ...prev, parts: updated }));
    };

    // ─── Open Labour Modal for Add ──────────────────────────────────────────────
    const openAddLabourModal = () => {
        setEditLabourIndex(null);
        setLabourModal({
            particulars: "",
            qty: 1,
            rate: 0,
            discount: 0,
            sgstPercent: 9,
            cgstPercent: 9,
            taxable: 0,
            sgstAmount: 0,
            cgstAmount: 0,
            amount: 0,
        });
        setShowLabourModal(true);
    };

    // ─── Open Labour Modal for Edit ─────────────────────────────────────────────
    const openEditLabourModal = (index) => {
        setEditLabourIndex(index);
        setLabourModal({ ...newInvoice.labours[index] });
        setShowLabourModal(true);
    };

    // ─── Save Labour from Modal ─────────────────────────────────────────────────
    const saveLabourModal = () => {
        if (!labourModal.particulars) {
            showToast("Please enter particulars", "error");
            return;
        }
        if (editLabourIndex !== null) {
            const updated = [...newInvoice.labours];
            updated[editLabourIndex] = { ...labourModal };
            setNewInvoice((prev) => ({ ...prev, labours: updated }));
        } else {
            setNewInvoice((prev) => ({
                ...prev,
                labours: [...prev.labours, { ...labourModal }],
            }));
        }
        setShowLabourModal(false);
    };

    // ─── Delete Labour Row ──────────────────────────────────────────────────────
    const deleteLabour = (index) => {
        const updated = newInvoice.labours.filter((_, i) => i !== index);
        setNewInvoice((prev) => ({ ...prev, labours: updated }));
    };

    // ─── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const payload = {
                dealer: newInvoice.dealer,
                billTo: newInvoice.billTo,
                billType: newInvoice.billType,
                jcNo: newInvoice.jcNo,
                customer: newInvoice.customer,
                vehicle: newInvoice.vehicle,
                BikeModel: newInvoice.BikeModel,
                service: newInvoice.service,
                parts: newInvoice.parts,
                labours: newInvoice.labours,
                summary: newInvoice.summary,
            };

            const res = await api.post("/partInvoice", payload);

            if (res.data?.success) {
                // Increment JC counter
                if (jcNoData?._id) {
                    await api.patch(`/jcno/counter/${jcNoData._id}`);
                }
                showToast(res.data.message, "success");

                // Reset form
                setNewInvoice({
                    dealer: "",
                    billTo: "",
                    billType: "CREDIT",
                    jcNo: "",
                    invoiceDate: new Date().toISOString().split("T")[0],
                    customer: { name: "", mobile: "", address: "", gst: "" },
                    vehicle: { regnNo: "", kms: "", frameNo: "" },
                    BikeModel: { modelName: "", variant: ""},
                    service: { jobType: "", mechanic: "", nxtDue: "", nxtDueDt: "" },
                    parts: [],
                    labours: [],
                    summary: {
                        partsQty: 0,
                        labourQty: 0,
                        taxableTotal: 0,
                        sgstTotal: 0,
                        cgstTotal: 0,
                        grandTotal: 0,
                        netTotal: 0,
                    },
                });
            } else {
                showToast(res.data?.message, "error");
            }
        } catch (err) {
            console.error("PartInvoice submit failed", err?.response?.data || err?.message || err);
            showToast(err?.response?.data?.message || "Error submitting invoice", "error");
        } finally {
            setLoading(false);
        }
    };

    // ─── JSX ────────────────────────────────────────────────────────────────────
    // =====================================================
    // EXACT JSX STRUCTURE FOR PartInvoice.jsx
    // Replace your return() with this skeleton exactly
    // =====================================================

    return (
        <div className="pi-page">
            <div className="pi-card">
                <form onSubmit={handleSubmit}>

                    {/* ================================================
            TWO-COLUMN LAYOUT
            Left col  = Dealer info + Bike + Service
            Right col = Customer + Vehicle
            ================================================ */}
                    <div className="pi-two-col">

                        {/* ── LEFT COLUMN ── */}
                        <div className="pi-col">

                            <p className="pi-section-title">Invoice Details</p>

                            {/* Dealer */}
                            <div className="pi-fg">
                                <label>Dealer*</label>
                                <select value={newInvoice.dealer} onChange={(e) => setNewInvoice({ ...newInvoice, dealer: e.target.value })}>
                                    <option value="">Select Dealer</option>
                                    {dealers.map((d) => <option key={d._id} value={d._id}>{d.branchName}</option>)}
                                </select>
                            </div>

                            {/* Bill To + Bill Type side by side */}
                            <div className="pi-inline-2">
                                <div className="pi-fg">
                                    <label>Bill To</label>
                                    <select value={newInvoice.billTo} onChange={(e) => setNewInvoice({ ...newInvoice, billTo: e.target.value })}>
                                        <option value="">Select Bill To</option>
                                        {billTos.map((b) => <option key={b._id} value={b._id}>{b.address}</option>)}
                                    </select>
                                </div>
                                <div className="pi-fg">
                                    <label>Bill Type*</label>
                                    <select value={newInvoice.billType} onChange={(e) => setNewInvoice({ ...newInvoice, billType: e.target.value })}>
                                        <option value="CREDIT">CREDIT</option>
                                        <option value="CASH">CASH</option>
                                    </select>
                                </div>
                            </div>

                            {/* JC No + Invoice Date side by side */}
                            <div className="pi-inline-2">
                                <div className="pi-fg">
                                    <label>JC No*</label>
                                    <input 
                                    readOnly   
                                    type="number" 
                                    value={newInvoice.jcNo} />
                                </div>
                                <div className="pi-fg">
                                    <label>Invoice Date*</label>
                                    <input type="date" value={newInvoice.invoiceDate} onChange={(e) => setNewInvoice({ ...newInvoice, invoiceDate: e.target.value })} />
                                </div>
                            </div>

                            {/* ── Bike Model Section ── */}
                            <p className="pi-section-title">Bike Details</p>

                            <div className="pi-inline-3">
                                <div className="pi-fg">
                                    <label>Model*</label>
                                    <select value={newInvoice.BikeModel.modelName} onChange={(e) => setNewInvoice({ ...newInvoice, BikeModel: { ...newInvoice.BikeModel, modelName: e.target.value } })}>
                                        <option value="">Select Model</option>
                                        {models.map((m) => <option key={m._id} value={m._id}>{m.model}</option>)}
                                    </select>
                                </div>
                                <div className="pi-fg">
                                    <label>Variant</label>
                                    <select value={newInvoice.BikeModel.variant} onChange={(e) => setNewInvoice({ ...newInvoice, BikeModel: { ...newInvoice.BikeModel, variant: e.target.value } })}>
                                        <option value="">Select Variant</option>
                                        {varients.map((v) => <option key={v._id} value={v._id}>{v.varient}</option>)}
                                    </select>
                                </div>
                                {/* <div className="pi-fg">
                                    <label>Color</label>
                                    <select value={newInvoice.BikeModel.colorOptions} onChange={(e) => setNewInvoice({ ...newInvoice, BikeModel: { ...newInvoice.BikeModel, colorOptions: e.target.value } })}>
                                        <option value="">Select Color</option>
                                        {colors.map((c) => <option key={c._id} value={c._id}>{c.color}</option>)}
                                    </select>
                                </div> */}
                            </div>

                            {/* ── Service Section ── */}
                            <p className="pi-section-title">Service Details</p>

                            <div className="pi-inline-2">
                                <div className="pi-fg">
                                    <label>Job Type</label>
                                    <select value={newInvoice.service.jobType} onChange={(e) => setNewInvoice({ ...newInvoice, service: { ...newInvoice.service, jobType: e.target.value } })}>
                                        <option value="">Select Job Type</option>
                                        <option value="Accident Repair">Accident Repair</option>
                                    </select>
                                </div>
                                <div className="pi-fg">
                                    <label>Mechanic</label>
                                    <input type="text" value={newInvoice.service.mechanic} onChange={(e) => setNewInvoice({ ...newInvoice, service: { ...newInvoice.service, mechanic: e.target.value } })} />
                                </div>
                            </div>

                            <div className="pi-inline-2">
                                <div className="pi-fg">
                                    <label>Next Due</label>
                                    <select value={newInvoice.service.nxtDue} onChange={(e) => setNewInvoice({ ...newInvoice, service: { ...newInvoice.service, nxtDue: e.target.value } })}>
                                        <option value="">Select Next Due</option>
                                        <option value="Paid Service">Paid Service</option>
                                    </select>
                                </div>
                                <div className="pi-fg">
                                    <label>Next Due Date</label>
                                    <input type="date" value={newInvoice.service.nxtDueDt} onChange={(e) => setNewInvoice({ ...newInvoice, service: { ...newInvoice.service, nxtDueDt: e.target.value } })} />
                                </div>
                            </div>

                        </div>
                        {/* END LEFT COLUMN */}

                        {/* ── RIGHT COLUMN ── */}
                        <div className="pi-col">

                            <p className="pi-section-title">Customer Details</p>

                            {/* Name + Mobile + GST */}
                            <div className="pi-inline-3">
                                <div className="pi-fg">
                                    <label>Customer Name*</label>
                                    <input type="text" value={newInvoice.customer.name} onChange={(e) => setNewInvoice({ ...newInvoice, customer: { ...newInvoice.customer, name: e.target.value } })} />
                                </div>
                                <div className="pi-fg">
                                    <label>Mobile*</label>
                                    <input type="number" value={newInvoice.customer.mobile} onChange={(e) => setNewInvoice({ ...newInvoice, customer: { ...newInvoice.customer, mobile: e.target.value } })} />
                                </div>
                                <div className="pi-fg">
                                    <label>Customer GST</label>
                                    <input type="text" value={newInvoice.customer.gst} onChange={(e) => setNewInvoice({ ...newInvoice, customer: { ...newInvoice.customer, gst: e.target.value } })} />
                                </div>
                            </div>

                            {/* Address — full width */}
                            <div className="pi-inline-full">
                                <div className="pi-fg">
                                    <label>Customer Address*</label>
                                    <input type="text" value={newInvoice.customer.address} onChange={(e) => setNewInvoice({ ...newInvoice, customer: { ...newInvoice.customer, address: e.target.value } })} />
                                </div>
                            </div>

                            {/* ── Vehicle Section ── */}
                            <p className="pi-section-title">Vehicle Details</p>

                            <div className="pi-inline-3">
                                <div className="pi-fg">
                                    <label>Regn No*</label>
                                    <input type="text" value={newInvoice.vehicle.regnNo} onChange={(e) => setNewInvoice({ ...newInvoice, vehicle: { ...newInvoice.vehicle, regnNo: e.target.value } })} />
                                </div>
                                <div className="pi-fg">
                                    <label>KMS</label>
                                    <input type="number" value={newInvoice.vehicle.kms} onChange={(e) => setNewInvoice({ ...newInvoice, vehicle: { ...newInvoice.vehicle, kms: e.target.value } })} />
                                </div>
                                <div className="pi-fg">
                                    <label>Frame No</label>
                                    <input type="text" value={newInvoice.vehicle.frameNo} onChange={(e) => setNewInvoice({ ...newInvoice, vehicle: { ...newInvoice.vehicle, frameNo: e.target.value } })} />
                                </div>
                            </div>

                        </div>
                        {/* END RIGHT COLUMN */}

                    </div>
                    {/* END pi-two-col */}


                    {/* ================================================
            PARTS TABLE
            ================================================ */}
                    <div className="pi-table-section">
                        <div className="pi-table-title-row">
                            <h4>Parts</h4>
                            <button type="button" className="pi-add-btn" onClick={openAddPartModal}>+ Add Part</button>
                        </div>
                        <div className="pi-table-wrap">
                            <div className="pi-parts-head">
                                <div>Part No</div>
                                <div>Particular</div>
                                <div>Qty</div>
                                <div>Rate</div>
                                <div>Discount</div>
                                <div>HSN</div>
                                <div>Taxable</div>
                                <div>CGST</div>
                                <div>SGST</div>
                                <div>Amount</div>
                                <div>Action</div>
                            </div>
                            {newInvoice.parts.length === 0 ? (
                                <div className="pi-table-empty">No parts added</div>
                            ) : (
                                newInvoice.parts.map((row, index) => {
                                    const selectedPart = parts.find((p) => String(p._id) === String(row.part));
                                    return (
                                        <div className="pi-parts-row" key={index}>
                                            <div>{selectedPart?.itemNo || "-"}</div>
                                            <div>{selectedPart?.particulars || "-"}</div>
                                            <div>{row.qty}</div>
                                            <div>{row.rate}</div>
                                            <div>{row.discount}</div>
                                            <div>{selectedPart?.hsn?.hsnCode || "-"}</div>
                                            <div>{Number(row.taxable).toFixed(2)}</div>
                                            <div>{row.cgstPercent}% / {Number(row.cgstAmount).toFixed(2)}</div>
                                            <div>{row.sgstPercent}% / {Number(row.sgstAmount).toFixed(2)}</div>
                                            <div>{Number(row.amount).toFixed(2)}</div>
                                            <div>
                                                <span className="pi-edit" onClick={() => openEditPartModal(index)}>Edit</span>
                                                <span className="pi-delete" onClick={() => deletePart(index)}>Delete</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>


                    {/* ================================================
            LABOUR TABLE
            ================================================ */}
                    <div className="pi-table-section">
                        <div className="pi-table-title-row">
                            <h4>Labour</h4>
                            <button type="button" className="pi-add-btn" onClick={openAddLabourModal}>+ Add Labour</button>
                        </div>
                        <div className="pi-table-wrap">
                            <div className="pi-labour-head">
                                <div>Particular</div>
                                <div>Qty</div>
                                <div>Rate</div>
                                <div>Discount</div>
                                <div>Taxable</div>
                                <div>CGST</div>
                                <div>SGST</div>
                                <div>Amount</div>
                                <div>Action</div>
                            </div>
                            {newInvoice.labours.length === 0 ? (
                                <div className="pi-table-empty">No labours added</div>
                            ) : (
                                newInvoice.labours.map((row, index) => (
                                    <div className="pi-labour-row" key={index}>
                                        <div>{row.particulars}</div>
                                        <div>{row.qty}</div>
                                        <div>{row.rate}</div>
                                        <div>{row.discount}</div>
                                        <div>{Number(row.taxable).toFixed(2)}</div>
                                        <div>{row.cgstPercent}% / {Number(row.cgstAmount).toFixed(2)}</div>
                                        <div>{row.sgstPercent}% / {Number(row.sgstAmount).toFixed(2)}</div>
                                        <div>{Number(row.amount).toFixed(2)}</div>
                                        <div>
                                            <span className="pi-edit" onClick={() => openEditLabourModal(index)}>Edit</span>
                                            <span className="pi-delete" onClick={() => deleteLabour(index)}>Delete</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>


                    {/* ================================================
            SUMMARY
            ================================================ */}
                    <div className="pi-summary-section">
                        <h4>Summary</h4>
                        <div className="pi-summary-grid">
                            <div className="pi-fg">
                                <label>Parts Qty</label>
                                <input type="number" readOnly value={newInvoice.summary.partsQty} />
                            </div>
                            <div className="pi-fg">
                                <label>Labour Qty</label>
                                <input type="number" readOnly value={newInvoice.summary.labourQty} />
                            </div>
                            <div className="pi-fg">
                                <label>Taxable Total</label>
                                <input type="number" readOnly value={newInvoice.summary.taxableTotal.toFixed(2)} />
                            </div>
                            <div className="pi-fg">
                                <label>SGST Total</label>
                                <input type="number" readOnly value={newInvoice.summary.sgstTotal.toFixed(2)} />
                            </div>
                            <div className="pi-fg">
                                <label>CGST Total</label>
                                <input type="number" readOnly value={newInvoice.summary.cgstTotal.toFixed(2)} />
                            </div>
                            <div className="pi-fg">
                                <label>Grand Total</label>
                                <input type="number" readOnly value={newInvoice.summary.grandTotal.toFixed(2)} />
                            </div>
                            <div className="pi-fg">
                                <label>Net Total</label>
                                <input type="number" readOnly value={newInvoice.summary.netTotal.toFixed(2)} />
                            </div>
                        </div>
                    </div>


                    {/* ================================================
            SUBMIT
            ================================================ */}
                    <div className="pi-submit-row">
                        <button type="submit" className="pi-submit-btn" disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>

                </form>
            </div>


            {/* ================================================
        PART MODAL
        ================================================ */}
            {showPartModal && (
                <div className="pi-modal-overlay">
                    <div className="pi-modal-box">
                        <div className="pi-modal-header">
                            <h3>{editPartIndex !== null ? "Edit Part" : "Add Part"}</h3>
                            <button type="button" className="pi-modal-close" onClick={() => setShowPartModal(false)}>✕</button>
                        </div>

                        {/* Select Part — full width */}
                        <div className="pi-modal-full">
                            <div className="pi-fg">
                                <label>Select Part*</label>
                                <select value={partModal.part} onChange={(e) => handlePartSelect(e.target.value)}>
                                    <option value="">Select Part</option>
                                    {parts.map((p) => <option key={p._id} value={p._id}>{p.particulars}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Rate / MRP / HSN */}
                        <div className="pi-modal-3">
                            <div className="pi-fg">
                                <label>Rate</label>
                                <input type="number" readOnly value={partModal.rate} />
                            </div>
                            <div className="pi-fg">
                                <label>MRP</label>
                                <input type="number" readOnly value={partModal.mrp} />
                            </div>
                            <div className="pi-fg">
                                <label>HSN</label>
                                <input type="text" readOnly value={parts.find((p) => String(p._id) === String(partModal.part))?.hsn?.hsnCode || ""} />
                            </div>
                        </div>

                        {/* Qty / Discount */}
                        <div className="pi-modal-2">
                            <div className="pi-fg">
                                <label>Qty*</label>
                                <input type="number" value={partModal.qty} onChange={(e) => setPartModal({ ...partModal, qty: Number(e.target.value) })} />
                            </div>
                            <div className="pi-fg">
                                <label>Discount</label>
                                <input type="number" value={partModal.discount} onChange={(e) => setPartModal({ ...partModal, discount: Number(e.target.value) })} />
                            </div>
                        </div>

                        {/* SGST % / CGST % / Taxable */}
                        <div className="pi-modal-3">
                            <div className="pi-fg">
                                <label>SGST %</label>
                                <input type="number" readOnly value={partModal.sgstPercent} />
                            </div>
                            <div className="pi-fg">
                                <label>CGST %</label>
                                <input type="number" readOnly value={partModal.cgstPercent} />
                            </div>
                            <div className="pi-fg">
                                <label>Taxable</label>
                                <input type="number" readOnly value={partModal.taxable} />
                            </div>
                        </div>

                        {/* SGST Amt / CGST Amt / Amount */}
                        <div className="pi-modal-3">
                            <div className="pi-fg">
                                <label>SGST Amount</label>
                                <input type="number" readOnly value={partModal.sgstAmount} />
                            </div>
                            <div className="pi-fg">
                                <label>CGST Amount</label>
                                <input type="number" readOnly value={partModal.cgstAmount} />
                            </div>
                            <div className="pi-fg">
                                <label>Amount</label>
                                <input type="number" readOnly value={partModal.amount} />
                            </div>
                        </div>

                        <div className="pi-modal-buttons">
                            <button type="button" className="pi-modal-save" onClick={savePartModal}>Save</button>
                            <button type="button" className="pi-modal-cancel" onClick={() => setShowPartModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}


            {/* ================================================
        LABOUR MODAL
        ================================================ */}
            {showLabourModal && (
                <div className="pi-modal-overlay">
                    <div className="pi-modal-box">
                        <div className="pi-modal-header">
                            <h3>{editLabourIndex !== null ? "Edit Labour" : "Add Labour"}</h3>
                            <button type="button" className="pi-modal-close" onClick={() => setShowLabourModal(false)}>✕</button>
                        </div>

                        {/* Particulars full width */}
                        <div className="pi-modal-full">
                            <div className="pi-fg">
                                <label>Particulars*</label>
                                <input type="text" value={labourModal.particulars} onChange={(e) => setLabourModal({ ...labourModal, particulars: e.target.value })} />
                            </div>
                        </div>

                        {/* Qty / Rate / Discount */}
                        <div className="pi-modal-3">
                            <div className="pi-fg">
                                <label>Qty*</label>
                                <input type="number" value={labourModal.qty} onChange={(e) => setLabourModal({ ...labourModal, qty: Number(e.target.value) })} />
                            </div>
                            <div className="pi-fg">
                                <label>Rate*</label>
                                <input type="number" value={labourModal.rate} onChange={(e) => setLabourModal({ ...labourModal, rate: Number(e.target.value) })} />
                            </div>
                            <div className="pi-fg">
                                <label>Discount</label>
                                <input type="number" value={labourModal.discount} onChange={(e) => setLabourModal({ ...labourModal, discount: Number(e.target.value) })} />
                            </div>
                        </div>

                        {/* SGST % / CGST % / Taxable */}
                        <div className="pi-modal-3">
                            <div className="pi-fg">
                                <label>SGST %</label>
                                <input type="number" readOnly value={labourModal.sgstPercent} />
                            </div>
                            <div className="pi-fg">
                                <label>CGST %</label>
                                <input type="number" readOnly value={labourModal.cgstPercent} />
                            </div>
                            <div className="pi-fg">
                                <label>Taxable</label>
                                <input type="number" readOnly value={labourModal.taxable} />
                            </div>
                        </div>

                        {/* SGST Amt / CGST Amt / Amount */}
                        <div className="pi-modal-3">
                            <div className="pi-fg">
                                <label>SGST Amount</label>
                                <input type="number" readOnly value={labourModal.sgstAmount} />
                            </div>
                            <div className="pi-fg">
                                <label>CGST Amount</label>
                                <input type="number" readOnly value={labourModal.cgstAmount} />
                            </div>
                            <div className="pi-fg">
                                <label>Amount</label>
                                <input type="number" readOnly value={labourModal.amount} />
                            </div>
                        </div>

                        <div className="pi-modal-buttons">
                            <button type="button" className="pi-modal-save" onClick={saveLabourModal}>Save</button>
                            <button type="button" className="pi-modal-cancel" onClick={() => setShowLabourModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PartInvoice;
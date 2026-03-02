import React, { useRef, useEffect, useState } from "react";
import api from "../../api/api";

const InvoicePrint = ({ invoiceId, onClose }) => {
  const printRef = useRef();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/invoice/${invoiceId}`);
        if (res.data?.success) {
          setInvoice(res.data?.draftInvoice || res.data?.invoice);
        }
      } catch (err) {
        console.error("Failed to fetch invoice", err);
      } finally {
        setLoading(false);
      }
    };
    if (invoiceId) fetchInvoice();
  }, [invoiceId]);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${invoice?.invoiceNumber || ""}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; font-size: 11px; color: #000; background: #fff; }
            .invoice-wrapper { width: 794px; margin: 0 auto; padding: 24px 28px; }
            .invoice-title { text-align: center; font-size: 15px; font-weight: bold; letter-spacing: 1px; margin-bottom: 8px; border-bottom: 2px solid #000; padding-bottom: 6px; }
            .invoice-meta { display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 10px; }
            .parties { display: flex; justify-content: space-between; margin-bottom: 12px; border: 1px solid #ccc; padding: 8px 10px; }
            .party-box { width: 48%; }
            .party-box h4 { font-size: 11px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 5px; }
            .party-box p { font-size: 10px; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
            table th { background: #f0f0f0; font-size: 10px; font-weight: bold; border: 1px solid #999; padding: 4px 5px; text-align: center; }
            table td { border: 1px solid #ccc; padding: 4px 5px; font-size: 10px; text-align: center; }
            table td:first-child { text-align: left; }
            .totals { margin-left: auto; width: 280px; margin-bottom: 10px; }
            .totals table { width: 100%; }
            .totals td { border: none; padding: 2px 5px; font-size: 10px; }
            .totals td:last-child { text-align: right; font-weight: 500; }
            .net-total td { font-weight: bold; font-size: 11px; border-top: 2px solid #000; }
            .amount-words { font-size: 10px; font-style: italic; margin-bottom: 10px; border: 1px solid #ccc; padding: 5px 8px; }
            .part-section { border: 1px solid #ccc; padding: 7px 10px; margin-bottom: 10px; }
            .part-section h4 { font-size: 10px; font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 3px; }
            .part-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; font-size: 10px; }
            .part-grid span { font-weight: bold; }
            .footer-note { font-size: 9px; color: #555; margin-bottom: 10px; line-height: 1.5; }
            .signature { text-align: right; margin-top: 20px; font-size: 10px; }
            .signature p { font-weight: bold; }
            .badge { display: inline-block; background: #000; color: #fff; font-size: 9px; padding: 1px 6px; border-radius: 2px; margin-left: 6px; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  if (loading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <p style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <p style={{ padding: "40px", textAlign: "center", color: "red" }}>Failed to load invoice.</p>
          <button onClick={onClose} style={styles.closeBtnTop}>✕</button>
        </div>
      </div>
    );
  }

  const bike = invoice.bike || {};
  const dealer = invoice.dealer || {};
  const scheme = invoice.scheme || {};

  const basePrice = Number(bike.basePrice || 0);
  const qty = 1;
  const disc = Number(invoice.discount || 0);
  const taxable = Number(invoice.taxableAmount || 0);
  const sgst = Number(invoice.sgst || 0);
  const cgst = Number(invoice.cgst || 0);
  const sgstAmt = parseFloat((taxable * sgst / 100)).toFixed(2);
  const cgstAmt = parseFloat((taxable * cgst / 100)).toFixed(2);
  const subTotal = parseFloat(taxable + Number(sgstAmt) + Number(cgstAmt)).toFixed(2);
  const roundOff = parseFloat(Math.round(Number(subTotal)) - Number(subTotal)).toFixed(2);
  const netTotal = parseFloat(invoice.totalAmount || 0).toFixed(2);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) +
      " " + new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const modelName = bike.modelName?.model || bike.modelName || "";
  const colorName = bike.colorOptions?.color || bike.colorOptions || "";
  const variantName = bike.variant?.varient || bike.variant || "";
  const hsnCode = bike.hsnCode || "";

  const numberToWords = (num) => {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const n = Math.abs(Math.round(num));
    if (n === 0) return "Zero";
    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
      if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + inWords(n % 1000) : "");
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + inWords(n % 100000) : "");
      return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + inWords(n % 10000000) : "");
    };
    return inWords(n) + " Only";
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {/* Action Bar */}
        <div style={styles.actionBar}>
          <span style={styles.actionTitle}>Invoice Preview — #{invoice.invoiceNumber}</span>
          <div style={styles.actionBtns}>
            <button onClick={handlePrint} style={styles.printBtn}>
              🖨️ Print / Save as PDF
            </button>
            <button onClick={onClose} style={styles.closeBtnTop}>✕</button>
          </div>
        </div>

        {/* Printable Content */}
        <div style={styles.scrollArea}>
          <div ref={printRef}>
            <div className="invoice-wrapper" style={printStyles.wrapper}>

              {/* Title */}
              <div style={printStyles.title}>Vehicle Invoice</div>

              {/* Meta Row */}
              <div style={printStyles.metaRow}>
                <span>Invoice No. : <strong>{invoice.invoiceNumber}</strong></span>
                <span>Invoice Date: <strong>{formatDate(invoice.invoiceDate || invoice.createdAt)}</strong></span>
                <span>
                  Status: <strong style={{ background: invoice.status === "FINAL" ? "#16a34a" : "#ca8a04", color: "#fff", padding: "1px 8px", borderRadius: "3px", fontSize: "10px" }}>{invoice.status}</strong>
                </span>
              </div>

              {/* Parties */}
              <div style={printStyles.parties}>
                <div style={printStyles.partyBox}>
                  <h4 style={printStyles.partyTitle}>FROM — DEALER</h4>
                  <p style={printStyles.partyText}>
                    <strong>{dealer.branchName || "N/A"}</strong><br />
                    {dealer.address || ""}<br />
                    {dealer.city || ""}{dealer.state ? ", " + dealer.state : ""}<br />
                    {dealer.pincode || ""}<br />
                    {dealer.phone ? "Ph: " + dealer.phone : ""}<br />
                    {dealer.gstNumber ? "GST: " + dealer.gstNumber : ""}
                  </p>
                </div>
                <div style={{ width: "1px", background: "#ccc", margin: "0 10px" }} />
                <div style={printStyles.partyBox}>
                  <h4 style={printStyles.partyTitle}>TO — CUSTOMER</h4>
                  <p style={printStyles.partyText}>
                    <strong>{invoice.customerName}</strong><br />
                    S/W/D: {invoice.customerFatherName}<br />
                    {invoice.customerAddress}<br />
                    {invoice.customerDistrict}{invoice.customerState ? ", " + invoice.customerState : ""}<br />
                    {invoice.customerPhone ? "Mob: " + invoice.customerPhone : ""}<br />
                    {invoice.customerGstNumber ? "GST: " + invoice.customerGstNumber : ""}
                    <br />Bill Type: <strong>{invoice.billType}</strong>
                    {invoice.isHp && invoice.financeCompany && (
                      <><br />Finance: <strong>{invoice.financeCompany?.companyName || invoice.financeCompany}</strong></>
                    )}
                  </p>
                </div>
              </div>

              {/* Line Items Table */}
              <table style={printStyles.table}>
                <thead>
                  <tr>
                    {["Particulars", "Qty", "Rate", "Disc", "Taxable", "HSN", "SGST%", "Amt", "CGST%", "Amt"].map((h) => (
                      <th key={h} style={printStyles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...printStyles.td, textAlign: "left", fontWeight: 500 }}>
                      {modelName} {variantName}
                      {colorName ? <><br /><span style={{ fontSize: "9px", color: "#666" }}>{colorName}</span></> : null}
                    </td>
                    <td style={printStyles.td}>{qty}</td>
                    <td style={printStyles.td}>{basePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td style={printStyles.td}>{disc.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td style={printStyles.td}>{taxable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td style={printStyles.td}>{hsnCode}</td>
                    <td style={printStyles.td}>{sgst}</td>
                    <td style={printStyles.td}>{Number(sgstAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td style={printStyles.td}>{cgst}</td>
                    <td style={printStyles.td}>{Number(cgstAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  </tr>
                  {/* Totals row */}
                  <tr style={{ background: "#f9f9f9" }}>
                    <td style={{ ...printStyles.td, fontWeight: "bold" }}>Total</td>
                    <td style={printStyles.td}>{qty}</td>
                    <td style={printStyles.td}></td>
                    <td style={printStyles.td}>{disc.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td style={printStyles.td}>{taxable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td style={printStyles.td}></td>
                    <td style={printStyles.td}></td>
                    <td style={printStyles.td}>{Number(sgstAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td style={printStyles.td}></td>
                    <td style={printStyles.td}>{Number(cgstAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>

              {/* Summary */}
              <div style={printStyles.summaryWrap}>
                <div /> {/* spacer */}
                <table style={{ width: "280px", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={printStyles.sumLabel}>Sub Total</td>
                      <td style={printStyles.sumValue}>{Number(subTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    </tr>
                    {scheme && scheme.value > 0 && (
                      <tr>
                        <td style={printStyles.sumLabel}>{scheme.scheme || "Scheme Discount"}</td>
                        <td style={{ ...printStyles.sumValue, color: "green" }}>-{Number(disc).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    )}
                    <tr>
                      <td style={printStyles.sumLabel}>Round Off</td>
                      <td style={printStyles.sumValue}>{roundOff}</td>
                    </tr>
                    <tr style={{ borderTop: "2px solid #000" }}>
                      <td style={{ ...printStyles.sumLabel, fontWeight: "bold", fontSize: "12px", paddingTop: "5px" }}>Net Total</td>
                      <td style={{ ...printStyles.sumValue, fontWeight: "bold", fontSize: "12px", paddingTop: "5px" }}>
                        ₹{Number(netTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Amount in words */}
              <div style={printStyles.amtWords}>
                Rupees {numberToWords(Math.abs(Number(netTotal)))} — Includes HSRP and Fittings & Helmet
              </div>

              {/* Vehicle Details */}
              <div style={printStyles.partSection}>
                <h4 style={printStyles.partTitle}>Vehicle / Part Details</h4>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Part Description", "Frame No (Chassis)", "Engine No", "HSN Code"].map(h => (
                        <th key={h} style={{ ...printStyles.th, background: "#f5f5f5", fontSize: "9px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ ...printStyles.td, textAlign: "left" }}>
                        {modelName} {variantName} {colorName}
                      </td>
                      <td style={printStyles.td}>{invoice.chassisNumber || "—"}</td>
                      <td style={printStyles.td}>{invoice.engineNumber || "—"}</td>
                      <td style={printStyles.td}>{hsnCode || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Ex Showroom */}
              <div style={{ fontSize: "10px", marginBottom: "8px" }}>
                Ex Showroom Price (Excluding All Discount): <strong>₹{(Number(taxable) + Number(sgstAmt) + Number(cgstAmt)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </div>

              {/* Note */}
              <div style={printStyles.note}>
                <strong>Note:</strong> Goods once sold will not be taken back.<br />
                I hereby agree to opt-in to receive promotional / service communication via email, SMS, mailers, calls &amp; social media from the Authorised Dealers / OEM. : (Y / N)
              </div>

              {/* Signature */}
              <div style={printStyles.signature}>
                <p>For {dealer.branchName || "Authorised Dealer"}</p>
                <br /><br />
                <p>____________________________</p>
                <p style={{ fontSize: "10px", marginTop: "2px" }}>Authorised Signatory</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Inline styles (preview only, not print) ── */
const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
    zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
  },
  modal: {
    background: "#fff", borderRadius: "10px", width: "860px", maxWidth: "96vw",
    maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  actionBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 18px", borderBottom: "1px solid #e5e7eb", background: "#f8fafc",
  },
  actionTitle: { fontWeight: 600, fontSize: "14px", color: "#1e293b" },
  actionBtns: { display: "flex", gap: "10px", alignItems: "center" },
  printBtn: {
    background: "#1d4ed8", color: "#fff", border: "none", borderRadius: "6px",
    padding: "7px 16px", fontSize: "13px", cursor: "pointer", fontWeight: 500,
  },
  closeBtnTop: {
    background: "transparent", border: "1px solid #cbd5e1", borderRadius: "6px",
    padding: "6px 11px", fontSize: "14px", cursor: "pointer", color: "#64748b",
  },
  scrollArea: { overflowY: "auto", flex: 1, padding: "20px 24px", background: "#f1f5f9" },
};

/* ── Print/preview content styles ── */
const printStyles = {
  wrapper: {
    width: "100%", background: "#fff", padding: "24px 28px",
    fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#000",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center", fontSize: "15px", fontWeight: "bold", letterSpacing: "1px",
    marginBottom: "8px", borderBottom: "2px solid #000", paddingBottom: "6px",
  },
  metaRow: {
    display: "flex", justifyContent: "space-between", fontSize: "10px",
    marginBottom: "10px", color: "#333",
  },
  parties: {
    display: "flex", border: "1px solid #ccc", padding: "8px 10px", marginBottom: "12px",
  },
  partyBox: { flex: 1 },
  partyTitle: {
    fontSize: "10px", fontWeight: "bold", borderBottom: "1px solid #ddd",
    paddingBottom: "3px", marginBottom: "5px", letterSpacing: "0.5px",
  },
  partyText: { fontSize: "10px", lineHeight: "1.6" },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: "8px" },
  th: {
    background: "#f0f0f0", fontSize: "10px", fontWeight: "bold",
    border: "1px solid #999", padding: "4px 5px", textAlign: "center",
  },
  td: { border: "1px solid #ccc", padding: "5px 6px", fontSize: "10px", textAlign: "center" },
  summaryWrap: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  sumLabel: { fontSize: "10px", padding: "3px 8px", textAlign: "left" },
  sumValue: { fontSize: "10px", padding: "3px 8px", textAlign: "right", fontWeight: 500 },
  amtWords: {
    fontSize: "10px", fontStyle: "italic", border: "1px solid #ccc",
    padding: "6px 10px", marginBottom: "10px", background: "#fafafa",
  },
  partSection: { border: "1px solid #ccc", padding: "7px 10px", marginBottom: "10px" },
  partTitle: {
    fontSize: "10px", fontWeight: "bold", marginBottom: "6px",
    borderBottom: "1px solid #eee", paddingBottom: "3px",
  },
  note: {
    fontSize: "9px", color: "#444", lineHeight: "1.6",
    marginBottom: "16px", borderTop: "1px dashed #ccc", paddingTop: "8px",
  },
  signature: { textAlign: "right", fontSize: "11px" },
};

export default InvoicePrint;

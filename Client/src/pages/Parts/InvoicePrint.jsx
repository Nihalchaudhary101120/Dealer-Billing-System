import React from "react";

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n) => Number(n || 0).toFixed(2);

const fmtDateTime = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  const dd  = String(dt.getDate()).padStart(2,"0");
  const mm  = String(dt.getMonth()+1).padStart(2,"0");
  const yy  = dt.getFullYear();
  const hh  = String(dt.getHours()).padStart(2,"0");
  const min = String(dt.getMinutes()).padStart(2,"0");
  return `${dd}/${mm}/${yy} ${hh}:${min}`;
};

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2,"0");
  const mm = String(dt.getMonth()+1).padStart(2,"0");
  const yy = dt.getFullYear();
  return `${dd}/${mm}/${yy}`;
};

/* number → Indian words */
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
  "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
const tensW = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
function numToWords(n) {
  n = Math.round(n);
  if (n === 0) return "Zero";
  const crore = Math.floor(n/10000000); n %= 10000000;
  const lakh  = Math.floor(n/100000);   n %= 100000;
  const thou  = Math.floor(n/1000);     n %= 1000;
  const hund  = Math.floor(n/100);      n %= 100;
  const ten   = Math.floor(n/10);
  const one   = n % 10;
  const p = [];
  if (crore) p.push(`${numToWords(crore)} Crore`);
  if (lakh)  p.push(`${numToWords(lakh)} Lakh`);
  if (thou)  p.push(`${numToWords(thou)} Thousand`);
  if (hund)  p.push(`${ones[hund]} Hundred`);
  if (ten >= 2) p.push(one ? `${tensW[ten]} ${ones[one]}` : tensW[ten]);
  else if (ten === 1) p.push(ones[10+one]);
  else if (one) p.push(ones[one]);
  return p.join(" ");
}
const amountInWords = (amt) => `( Rupees ${numToWords(Math.round(amt))} Only)`;

/* ─── PRINT CSS — matches MOHD SUHEL bill exactly ─────────────────────────── */
const PRINT_CSS = `
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: Arial, Helvetica, sans-serif; font-size:10.5px; color:#000; background:#fff; }
@page { size: A4 portrait; margin: 10mm 12mm; }
@media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }

.page { width:100%; }

/* ── TOP HEADER ROW ── */
.hdr { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
.hdr-left  { font-size:11px; font-weight:bold; }
.hdr-mid   { font-size:13px; font-weight:bold; text-decoration:underline; text-align:center; }
.hdr-right { font-size:10.5px; text-align:right; font-weight:bold; }

/* ── DEALER + ADDRESSES ── */
.dealer-addr-row { display:flex; align-items:flex-start; margin-bottom:6px; }
.dealer-blk { font-size:10.5px; line-height:1.6; min-width:160px; }
.dealer-name { font-weight:bold; font-size:12px; }
.addr-section { display:flex; flex:1; gap:0; }
.addr-col { flex:1; padding:0 8px; font-size:10.5px; line-height:1.6; }
.addr-lbl { font-weight:bold; text-decoration:underline; font-size:10.5px; margin-bottom:1px; }
.logo-col { min-width:70px; text-align:right; }
.tvs-txt { font-weight:900; font-size:22px; font-style:italic; font-family:Arial,sans-serif; letter-spacing:1px; color:#000; }

/* ── DIVIDERS ── */
hr.thick { border:none; border-top:1.5px solid #000; margin:4px 0; }
hr.thin  { border:none; border-top:1px solid #555; margin:3px 0; }

/* ── JOB DETAILS ── */
.job-section { font-size:10px; margin-bottom:3px; }
.job-row { display:flex; gap:0; margin-bottom:1px; }
.job-cell { min-width:180px; }
.job-cell span.lbl { font-weight:bold; }

/* ── TABLE ── */
table.items { width:100%; border-collapse:collapse; font-size:9.5px; }
table.items th {
  border:1px solid #000;
  padding:3px 4px;
  text-align:center;
  font-weight:bold;
  font-size:9.5px;
  background:#fff;
}
table.items td {
  border:1px solid #000;
  padding:2px 4px;
  font-size:9.5px;
  vertical-align:middle;
}
table.items .tc { text-align:center; }
table.items .tr { text-align:right; }

/* total rows — no inner cell borders, just outer border */
table.items tr.tot-row td {
  border-left:1px solid #000;
  border-right:1px solid #000;
  border-top:1px solid #000;
  border-bottom:1px solid #000;
  font-weight:bold;
  background:#fff;
  padding:2px 4px;
}
table.items tr.sub-row td {
  border:1px solid #000;
  font-weight:bold;
  background:#fff;
  padding:2px 4px;
}

/* ── GRAND TOTAL BLOCK ── */
.grand-wrap { display:flex; justify-content:center; margin-top:6px; }
.grand-tbl { width:60%; border-collapse:collapse; }
.grand-tbl td { border:none; padding:2px 8px; font-size:10.5px; }
.grand-tbl .tr { text-align:right; }
.grand-tbl .net-lbl { font-weight:bold; font-size:11px; }
.grand-tbl .net-val { font-weight:bold; font-size:11px; text-align:right; }
.grand-tbl .dash-row td { border-top:1px dashed #555; padding:1px 0; font-size:8px; color:#555; }
.grand-tbl .solid-row td { border-top:1.5px solid #000; padding:0; }

/* ── WORDS ── */
.words { font-size:10.5px; font-style:italic; margin:5px 0 3px; color:#000; }

/* ── FOOTER ── */
.footer { display:flex; justify-content:space-between; align-items:flex-end; margin-top:28px; font-size:10px; }
.footer-left { line-height:1.6; }
.footer-right { text-align:right; line-height:1.8; }
`;

/* ─── BUILD PRINT HTML ────────────────────────────────────────────────────── */
const buildPrintHTML = (inv, tvsLogoPath) => {
  const {
    invoiceNo, invoiceDate, billType = "Credit", jcNo,
    dealer = {}, customer = {}, billTo = {},
    vehicle = {}, BikeModel = {}, service = {},
    parts = [], labours = [], summary = {},
  } = inv;

  const modelName = BikeModel?.modelName?.model || "";
  const variant   = BikeModel?.variant?.variant  || "";

  /* totals */
  const partsQty  = parts.reduce((s,p)=>s+(p.qty||0),0);
  const partsDisc = parts.reduce((s,p)=>s+(p.discount||0),0);
  const partsTax  = parts.reduce((s,p)=>s+(p.taxable||0),0);
  const partsSgst = parts.reduce((s,p)=>s+(p.sgstAmount||0),0);
  const partsCgst = parts.reduce((s,p)=>s+(p.cgstAmount||0),0);
  const labQty    = labours.reduce((s,l)=>s+(l.qty||0),0);
  const labDisc   = labours.reduce((s,l)=>s+(l.discount||0),0);
  const labTax    = labours.reduce((s,l)=>s+(l.taxable||0),0);
  const labSgst   = labours.reduce((s,l)=>s+(l.sgstAmount||0),0);
  const labCgst   = labours.reduce((s,l)=>s+(l.cgstAmount||0),0);
  const subQty    = partsQty+labQty;
  const subDisc   = partsDisc+labDisc;
  const subTax    = partsTax+labTax;
  const subSgst   = partsSgst+labSgst;
  const subCgst   = partsCgst+labCgst;
  const grandTotal = summary.grandTotal ?? (subTax+subSgst+subCgst);
  const netTotal   = summary.netTotal   ?? Math.round(grandTotal);
  const roundOff   = (netTotal-grandTotal).toFixed(2);

  const partRows = parts.map(p=>`
    <tr>
      <td>${p.part?.itemNo||""}</td>
      <td>${p.part?.particulars||""}</td>
      <td class="tc">${fmt(p.qty)}</td>
      <td class="tr">${fmt(p.rate)}</td>
      <td class="tr">${fmt(p.discount)}</td>
      <td class="tr">${fmt(p.taxable)}</td>
      <td class="tc">${p.hsn?.hsnCode||""}</td>
      <td class="tc">${p.sgstPercent||0}</td>
      <td class="tr">${fmt(p.sgstAmount)}</td>
      <td class="tc">${p.cgstPercent||0}</td>
      <td class="tr">${fmt(p.cgstAmount)}</td>
      <td class="tr">${fmt(p.mrp)}</td>
    </tr>`).join("");

  const labRows = labours.map(l=>`
    <tr>
      <td></td>
      <td>${l.particulars||""}</td>
      <td class="tc">${fmt(l.qty)}</td>
      <td class="tr">${fmt(l.rate)}</td>
      <td class="tr">${fmt(l.discount)}</td>
      <td class="tr">${fmt(l.taxable)}</td>
      <td class="tc">9987</td>
      <td class="tc">${l.sgstPercent||0}</td>
      <td class="tr">${fmt(l.sgstAmount)}</td>
      <td class="tc">${l.cgstPercent||0}</td>
      <td class="tr">${fmt(l.cgstAmount)}</td>
      <td class="tr">${fmt(l.amount)}</td>
    </tr>`).join("");

  const logoHTML = tvsLogoPath
    ? `<img src="${tvsLogoPath}" style="height:28px;object-fit:contain;" alt="TVS"/>`
    : `<span class="tvs-txt">TVS</span>`;

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<title>Invoice #${invoiceNo}</title>
<style>${PRINT_CSS}</style>
</head><body><div class="page">

<!-- TOP HEADER -->
<div class="hdr">
  <div class="hdr-left">Invoice No &nbsp; <strong>${invoiceNo}</strong></div>
  <div class="hdr-mid">Service Labour Invoice</div>
  <div class="hdr-right">Invoice Date:${fmtDateTime(invoiceDate)}</div>
</div>

<!-- DEALER + SHIP TO + BILL TO -->
<div class="dealer-addr-row">
  <div class="dealer-blk">
    <div class="dealer-name">${dealer.name||""}</div>
    ${dealer.address ? dealer.address.split(",").map(a=>`<div>${a.trim()}</div>`).join("") : ""}
    ${dealer.phone   ? `<div>Ph: ${dealer.phone}</div>` : "<div>Ph:</div>"}
    ${dealer.gstNo   ? `<div>GST IN No.:${dealer.gstNo}</div>` : ""}
  </div>
  <div class="addr-section">
    <div class="addr-col">
      <div class="addr-lbl">Ship To</div>
      <div><strong>${customer.name||""}</strong></div>
      ${customer.address||""}
      ${customer.mobile ? `<div>Mob: ${customer.mobile}</div>` : ""}
      ${customer.gst    ? `<div>GST: ${customer.gst}</div>`    : ""}
    </div>
    <div class="addr-col">
      <div class="addr-lbl">Bill To</div>
      ${billTo.name    ? `<div><strong>${billTo.name}</strong></div>`   : ""}
      ${billTo.address ? `<div>${billTo.address}</div>`                 : ""}
      ${billTo.phone   ? `<div>Ph : ${billTo.phone}</div>`             : ""}
      ${billTo.gstNo   ? `<div>GST IN No. : ${billTo.gstNo}</div>`     : ""}
    </div>
  </div>
  <div class="logo-col">${logoHTML}</div>
</div>

<hr class="thick"/>

<!-- JOB DETAILS -->
<div class="job-section">
  <div class="job-row">
    <div class="job-cell"><span class="lbl">BillType :</span>${billType}</div>
    <div class="job-cell"><span class="lbl">JC No. :</span>${jcNo}</div>
    <div class="job-cell"><span class="lbl">JobType :</span>${service.jobType||""}</div>
    <div class="job-cell"><span class="lbl">NxtDue :</span>${service.nxtDue||""}</div>
  </div>
  <div class="job-row">
    <div class="job-cell"><span class="lbl">KMs :</span>${vehicle.kms||""}</div>
    <div class="job-cell"><span class="lbl">FrameNo. :</span>${vehicle.frameNo||""}</div>
    <div class="job-cell"><span class="lbl">Model :</span>${modelName} ${variant}</div>
    <div class="job-cell"><span class="lbl">NxtDueDt :</span>${fmtDate(service.nxtDueDt)}</div>
  </div>
  <div class="job-row">
    <div class="job-cell"><span class="lbl">RegnNo. :</span>${vehicle.regnNo||""}</div>
    <div class="job-cell"><span class="lbl">Mechanic :</span>${service.mechanic||""}</div>
  </div>
</div>

<hr class="thick"/>

<!-- LINE ITEMS TABLE -->
<table class="items">
  <thead>
    <tr>
      <th>Item No</th>
      <th>Particulars</th>
      <th>Qty</th>
      <th>Rate</th>
      <th>Disc</th>
      <th>Taxable</th>
      <th>HSN</th>
      <th>SGST<br/>Rate</th>
      <th>SGST<br/>Amt</th>
      <th>CGST<br/>Rate</th>
      <th>CGST<br/>Amt</th>
      <th>MRP</th>
    </tr>
  </thead>
  <tbody>
    ${partRows}
    ${labRows}
    ${parts.length ? `
    <tr class="tot-row">
      <td colspan="2">Parts Total</td>
      <td class="tc">${fmt(partsQty)}</td>
      <td></td>
      <td class="tr">${fmt(partsDisc)}</td>
      <td class="tr">${fmt(partsTax)}</td>
      <td></td>
      <td></td>
      <td class="tr">${fmt(partsSgst)}</td>
      <td></td>
      <td class="tr">${fmt(partsCgst)}</td>
      <td></td>
    </tr>` : ""}
    ${labours.length ? `
    <tr class="tot-row">
      <td colspan="2">Labour Total</td>
      <td class="tc">${fmt(labQty)}</td>
      <td></td>
      <td class="tr">${fmt(labDisc)}</td>
      <td class="tr">${fmt(labTax)}</td>
      <td></td>
      <td></td>
      <td class="tr">${fmt(labSgst)}</td>
      <td></td>
      <td class="tr">${fmt(labCgst)}</td>
      <td></td>
    </tr>` : ""}
    <tr class="sub-row">
      <td colspan="2">Sub Total</td>
      <td class="tc">${fmt(subQty)}</td>
      <td></td>
      <td class="tr">${fmt(subDisc)}</td>
      <td class="tr">${fmt(subTax)}</td>
      <td></td>
      <td></td>
      <td class="tr">${fmt(subSgst)}</td>
      <td></td>
      <td class="tr">${fmt(subCgst)}</td>
      <td></td>
    </tr>
  </tbody>
</table>

<!-- GRAND TOTAL -->
<div class="grand-wrap">
  <table class="grand-tbl">
    <tr><td>Grand Total</td><td class="tr">${fmt(grandTotal)}</td></tr>
    <tr><td>Round Off</td>  <td class="tr">${roundOff}</td></tr>
    <tr class="dash-row"><td colspan="2" style="text-align:center;">--------------------</td></tr>
    <tr><td class="net-lbl">Net Total</td><td class="net-val">${fmt(netTotal)}</td></tr>
  </table>
</div>

<!-- WORDS -->
<div class="words">${amountInWords(netTotal)}</div>

<hr class="thin"/>

<!-- FOOTER -->
<div class="footer">
  <div class="footer-left">
    Download TVS Connect App to book a service, Check<br/>
    Service History, Get Mileage &amp; riding improvement tips,<br/>
    Contact road side assistance and much more
  </div>
  <div class="footer-right">
    <div>For ${dealer.name||""}</div>
    <br/><br/>
    <div>Authorised Signatory</div>
  </div>
</div>

</div></body></html>`;
};

/* ─── PREVIEW INLINE STYLES ──────────────────────────────────────────────── */
/* matches sample PDF exactly — black/white, same font, same layout */
const P = {
  /* table cells */
  th: {
    border:"1px solid #000", padding:"3px 4px",
    textAlign:"center", fontWeight:"bold",
    fontSize:"9.5px", background:"#fff", verticalAlign:"middle",
  },
  td:  { border:"1px solid #000", padding:"2px 4px", fontSize:"9.5px", verticalAlign:"middle" },
  tdc: { border:"1px solid #000", padding:"2px 4px", fontSize:"9.5px", textAlign:"center", verticalAlign:"middle" },
  tdr: { border:"1px solid #000", padding:"2px 4px", fontSize:"9.5px", textAlign:"right",  verticalAlign:"middle" },
  /* total rows */
  tott:  { border:"1px solid #000", padding:"2px 4px", fontSize:"9.5px", fontWeight:"bold", verticalAlign:"middle" },
  tottr: { border:"1px solid #000", padding:"2px 4px", fontSize:"9.5px", fontWeight:"bold", textAlign:"right", verticalAlign:"middle" },
  tottc: { border:"1px solid #000", padding:"2px 4px", fontSize:"9.5px", fontWeight:"bold", textAlign:"center", verticalAlign:"middle" },
};

/* ─── COMPONENT ──────────────────────────────────────────────────────────── */
const InvoicePrint = ({ invoice, onClose, tvsLogoPath }) => {
  if (!invoice) return null;

  const {
    invoiceNo, invoiceDate, billType = "Credit", jcNo,
    dealer = {}, customer = {}, billTo = {},
    vehicle = {}, BikeModel = {}, service = {},
    parts = [], labours = [], summary = {},
  } = invoice;

  const modelName = BikeModel?.modelName?.model || "";
  const variant   = BikeModel?.variant?.variant  || "";

  /* totals */
  const partsQty  = parts.reduce((s,p)=>s+(p.qty||0),0);
  const partsDisc = parts.reduce((s,p)=>s+(p.discount||0),0);
  const partsTax  = parts.reduce((s,p)=>s+(p.taxable||0),0);
  const partsSgst = parts.reduce((s,p)=>s+(p.sgstAmount||0),0);
  const partsCgst = parts.reduce((s,p)=>s+(p.cgstAmount||0),0);
  const labQty    = labours.reduce((s,l)=>s+(l.qty||0),0);
  const labDisc   = labours.reduce((s,l)=>s+(l.discount||0),0);
  const labTax    = labours.reduce((s,l)=>s+(l.taxable||0),0);
  const labSgst   = labours.reduce((s,l)=>s+(l.sgstAmount||0),0);
  const labCgst   = labours.reduce((s,l)=>s+(l.cgstAmount||0),0);
  const subQty    = partsQty+labQty;
  const subDisc   = partsDisc+labDisc;
  const subTax    = partsTax+labTax;
  const subSgst   = partsSgst+labSgst;
  const subCgst   = partsCgst+labCgst;
  const grandTotal= summary.grandTotal ?? (subTax+subSgst+subCgst);
  const netTotal  = summary.netTotal   ?? Math.round(grandTotal);
  const roundOff  = (netTotal-grandTotal).toFixed(2);

  const handlePrint = () => {
    const html = buildPrintHTML(invoice, tvsLogoPath);
    const w = window.open("","_blank","width=900,height=720");
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  /* shared page style — exactly A4-like white sheet */
  const pageStyle = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "10.5px",
    color: "#000",
    background: "#fff",
    width: "210mm",
    minHeight: "297mm",
    margin: "0 auto",
    padding: "10mm 12mm",
    boxSizing: "border-box",
  };

  const jlbl = { fontWeight:"bold" };

  return (
    /* overlay */
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
      zIndex:9999, display:"flex", flexDirection:"column",
      alignItems:"center", overflowY:"auto", paddingBottom:"32px",
    }}
      onClick={e => e.target===e.currentTarget && onClose()}
    >
      {/* modal */}
      <div style={{
        width:"880px", maxWidth:"98vw", marginTop:"20px",
        background:"#fff", borderRadius:"8px",
        boxShadow:"0 8px 40px rgba(0,0,0,0.35)",
        overflow:"hidden", display:"flex", flexDirection:"column",
      }}>

        {/* ── modal header bar ── */}
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"13px 20px", background:"#fff", borderBottom:"1px solid #e0e0e0",
        }}>
          <span style={{ fontFamily:"Arial,sans-serif", fontSize:"15px", fontWeight:"600", color:"#111" }}>
            Invoice Preview — #{invoiceNo}
          </span>
          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
            <button onClick={handlePrint} style={{
              display:"flex", alignItems:"center", gap:"7px",
              padding:"8px 18px", background:"#1a73e8", color:"#fff",
              border:"none", borderRadius:"6px", fontSize:"13px",
              fontWeight:"600", cursor:"pointer", fontFamily:"Arial,sans-serif",
            }}>
              🖨️ Print / Save as PDF
            </button>
            <button onClick={onClose} style={{
              width:"32px", height:"32px", border:"1px solid #ccc",
              borderRadius:"6px", background:"#f5f5f5", cursor:"pointer",
              fontSize:"16px", display:"flex", alignItems:"center", justifyContent:"center",
            }}>✕</button>
          </div>
        </div>

        {/* ── preview body ── */}
        <div style={{ padding:"24px 28px", background:"#f0f2f5", overflowY:"auto" }}>
          <div style={pageStyle}>

            {/* ── TOP HEADER ── */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"4px" }}>
              <div style={{ fontWeight:"bold", fontSize:"11px" }}>
                Invoice No &nbsp; <strong>{invoiceNo}</strong>
              </div>
              <div style={{ fontSize:"13px", fontWeight:"bold", textDecoration:"underline" }}>
                Service Labour Invoice
              </div>
              <div style={{ fontSize:"10.5px", fontWeight:"bold", textAlign:"right" }}>
                Invoice Date:{fmtDateTime(invoiceDate)}
              </div>
            </div>

            {/* ── DEALER + SHIP TO + BILL TO ── */}
            <div style={{ display:"flex", alignItems:"flex-start", marginBottom:"6px" }}>
              {/* dealer block — left */}
              <div style={{ minWidth:"160px", fontSize:"10.5px", lineHeight:"1.6" }}>
                <div style={{ fontWeight:"bold", fontSize:"12px" }}>{dealer.name||""}</div>
                {(dealer.address||"").split(",").map((a,i) => <div key={i}>{a.trim()}</div>)}
                <div>Ph:{dealer.phone||""}</div>
                {dealer.gstNo && <div>GST IN No.:{dealer.gstNo}</div>}
              </div>

              {/* ship to + bill to — centre */}
              <div style={{ display:"flex", flex:1, gap:"0" }}>
                <div style={{ flex:1, padding:"0 8px", fontSize:"10.5px", lineHeight:"1.6" }}>
                  <div style={{ fontWeight:"bold", textDecoration:"underline", marginBottom:"1px" }}>Ship To</div>
                  <div><strong>{customer.name||""}</strong></div>
                  {customer.address && <div>{customer.address}</div>}
                  {customer.mobile  && <div>Mob: {customer.mobile}</div>}
                  {customer.gst     && <div>GST: {customer.gst}</div>}
                </div>
                <div style={{ flex:1, padding:"0 8px", fontSize:"10.5px", lineHeight:"1.6" }}>
                  <div style={{ fontWeight:"bold", textDecoration:"underline", marginBottom:"1px" }}>Bill To</div>
                  {billTo.name    && <div><strong>{billTo.name}</strong></div>}
                  {billTo.address && <div>{billTo.address}</div>}
                  {billTo.phone   && <div>Ph : {billTo.phone}</div>}
                  {billTo.gstNo   && <div>GST IN No. : {billTo.gstNo}</div>}
                </div>
              </div>

              {/* TVS logo — right */}
              <div style={{ minWidth:"70px", textAlign:"right" }}>
                {tvsLogoPath
                  ? <img src={tvsLogoPath} style={{ height:"28px", objectFit:"contain" }} alt="TVS"/>
                  : <span style={{ fontWeight:900, fontSize:"22px", fontStyle:"italic", letterSpacing:"1px" }}>TVS</span>
                }
              </div>
            </div>

            {/* thick divider */}
            <hr style={{ border:"none", borderTop:"1.5px solid #000", margin:"4px 0" }}/>

            {/* ── JOB DETAILS ── */}
            <div style={{ fontSize:"10px", marginBottom:"3px" }}>
              <div style={{ display:"flex", gap:"0", marginBottom:"1px" }}>
                <div style={{ minWidth:"180px" }}><span style={jlbl}>BillType :</span>{billType}</div>
                <div style={{ minWidth:"180px" }}><span style={jlbl}>JC No. :</span>{jcNo}</div>
                <div style={{ minWidth:"180px" }}><span style={jlbl}>JobType :</span>{service.jobType||""}</div>
                <div style={{ minWidth:"160px" }}><span style={jlbl}>NxtDue :</span>{service.nxtDue||""}</div>
              </div>
              <div style={{ display:"flex", gap:"0", marginBottom:"1px" }}>
                <div style={{ minWidth:"180px" }}><span style={jlbl}>KMs :</span>{vehicle.kms||""}</div>
                <div style={{ minWidth:"180px" }}><span style={jlbl}>FrameNo. :</span>{vehicle.frameNo||""}</div>
                <div style={{ minWidth:"180px" }}><span style={jlbl}>Model :</span>{modelName} {variant}</div>
                <div style={{ minWidth:"160px" }}><span style={jlbl}>NxtDueDt :</span>{fmtDate(service.nxtDueDt)}</div>
              </div>
              <div style={{ display:"flex", gap:"0" }}>
                <div style={{ minWidth:"180px" }}><span style={jlbl}>RegnNo. :</span>{vehicle.regnNo||""}</div>
                <div style={{ minWidth:"180px" }}><span style={jlbl}>Mechanic :</span>{service.mechanic||""}</div>
              </div>
            </div>

            {/* thick divider */}
            <hr style={{ border:"none", borderTop:"1.5px solid #000", margin:"4px 0" }}/>

            {/* ── LINE ITEMS TABLE ── */}
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  <th style={P.th}>Item No</th>
                  <th style={P.th}>Particulars</th>
                  <th style={P.th}>Qty</th>
                  <th style={P.th}>Rate</th>
                  <th style={P.th}>Disc</th>
                  <th style={P.th}>Taxable</th>
                  <th style={P.th}>HSN</th>
                  <th style={P.th}>SGST<br/>Rate</th>
                  <th style={P.th}>SGST<br/>Amt</th>
                  <th style={P.th}>CGST<br/>Rate</th>
                  <th style={P.th}>CGST<br/>Amt</th>
                  <th style={P.th}>MRP</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((p,i) => (
                  <tr key={`p${i}`}>
                    <td style={P.td}>{p.part?.itemNo||""}</td>
                    <td style={P.td}>{p.part?.particulars||""}</td>
                    <td style={P.tdc}>{fmt(p.qty)}</td>
                    <td style={P.tdr}>{fmt(p.rate)}</td>
                    <td style={P.tdr}>{fmt(p.discount)}</td>
                    <td style={P.tdr}>{fmt(p.taxable)}</td>
                    <td style={P.tdc}>{p.hsn?.hsnCode||""}</td>
                    <td style={P.tdc}>{p.sgstPercent||0}</td>
                    <td style={P.tdr}>{fmt(p.sgstAmount)}</td>
                    <td style={P.tdc}>{p.cgstPercent||0}</td>
                    <td style={P.tdr}>{fmt(p.cgstAmount)}</td>
                    <td style={P.tdr}>{fmt(p.mrp)}</td>
                  </tr>
                ))}
                {labours.map((l,i) => (
                  <tr key={`l${i}`}>
                    <td style={P.td}></td>
                    <td style={P.td}>{l.particulars||""}</td>
                    <td style={P.tdc}>{fmt(l.qty)}</td>
                    <td style={P.tdr}>{fmt(l.rate)}</td>
                    <td style={P.tdr}>{fmt(l.discount)}</td>
                    <td style={P.tdr}>{fmt(l.taxable)}</td>
                    <td style={P.tdc}>9987</td>
                    <td style={P.tdc}>{l.sgstPercent||0}</td>
                    <td style={P.tdr}>{fmt(l.sgstAmount)}</td>
                    <td style={P.tdc}>{l.cgstPercent||0}</td>
                    <td style={P.tdr}>{fmt(l.cgstAmount)}</td>
                    <td style={P.tdr}>{fmt(l.amount)}</td>
                  </tr>
                ))}

                {/* Parts Total */}
                {parts.length > 0 && (
                  <tr>
                    <td style={P.tott} colSpan={2}>Parts Total</td>
                    <td style={P.tottc}>{fmt(partsQty)}</td>
                    <td style={P.tott}></td>
                    <td style={P.tottr}>{fmt(partsDisc)}</td>
                    <td style={P.tottr}>{fmt(partsTax)}</td>
                    <td style={P.tott}></td>
                    <td style={P.tott}></td>
                    <td style={P.tottr}>{fmt(partsSgst)}</td>
                    <td style={P.tott}></td>
                    <td style={P.tottr}>{fmt(partsCgst)}</td>
                    <td style={P.tott}></td>
                  </tr>
                )}

                {/* Labour Total */}
                {labours.length > 0 && (
                  <tr>
                    <td style={P.tott} colSpan={2}>Labour Total</td>
                    <td style={P.tottc}>{fmt(labQty)}</td>
                    <td style={P.tott}></td>
                    <td style={P.tottr}>{fmt(labDisc)}</td>
                    <td style={P.tottr}>{fmt(labTax)}</td>
                    <td style={P.tott}></td>
                    <td style={P.tott}></td>
                    <td style={P.tottr}>{fmt(labSgst)}</td>
                    <td style={P.tott}></td>
                    <td style={P.tottr}>{fmt(labCgst)}</td>
                    <td style={P.tott}></td>
                  </tr>
                )}

                {/* Sub Total */}
                <tr>
                  <td style={P.tott} colSpan={2}>Sub Total</td>
                  <td style={P.tottc}>{fmt(subQty)}</td>
                  <td style={P.tott}></td>
                  <td style={P.tottr}>{fmt(subDisc)}</td>
                  <td style={P.tottr}>{fmt(subTax)}</td>
                  <td style={P.tott}></td>
                  <td style={P.tott}></td>
                  <td style={P.tottr}>{fmt(subSgst)}</td>
                  <td style={P.tott}></td>
                  <td style={P.tottr}>{fmt(subCgst)}</td>
                  <td style={P.tott}></td>
                </tr>
              </tbody>
            </table>

            {/* ── GRAND TOTAL BLOCK ── */}
            <div style={{ display:"flex", justifyContent:"center", marginTop:"6px" }}>
              <table style={{ width:"58%", borderCollapse:"collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding:"2px 8px", fontSize:"10.5px" }}>Grand Total</td>
                    <td style={{ padding:"2px 8px", fontSize:"10.5px", textAlign:"right" }}>{fmt(grandTotal)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding:"2px 8px", fontSize:"10.5px" }}>Round Off</td>
                    <td style={{ padding:"2px 8px", fontSize:"10.5px", textAlign:"right" }}>{roundOff}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ textAlign:"center", fontSize:"8px", color:"#555", padding:"1px 0", letterSpacing:"2px" }}>
                      --------------------
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding:"2px 8px", fontSize:"11px", fontWeight:"bold" }}>Net Total</td>
                    <td style={{ padding:"2px 8px", fontSize:"11px", fontWeight:"bold", textAlign:"right" }}>{fmt(netTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── WORDS ── */}
            <div style={{ fontSize:"10.5px", fontStyle:"italic", margin:"5px 0 3px", color:"#000" }}>
              {amountInWords(netTotal)}
            </div>

            <hr style={{ border:"none", borderTop:"1px solid #555", margin:"3px 0" }}/>

            {/* ── FOOTER ── */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop:"28px", fontSize:"10px" }}>
              <div style={{ lineHeight:"1.6" }}>
                Download TVS Connect App to book a service, Check<br/>
                Service History, Get Mileage &amp; riding improvement tips,<br/>
                Contact road side assistance and much more
              </div>
              <div style={{ textAlign:"right", lineHeight:"1.8" }}>
                <div>For {dealer.name||""}</div>
                <div style={{ marginTop:"28px" }}>Authorised Signatory</div>
              </div>
            </div>

          </div>{/* page */}
        </div>{/* preview body */}
      </div>{/* modal */}
    </div>
  );
};

export default InvoicePrint;
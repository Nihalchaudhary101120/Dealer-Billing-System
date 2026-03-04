import React, { useState, useEffect } from 'react';
import api from "../../api/api.js";
import { useToast } from '../../context/ToastContext.jsx';
import { useBike } from '../../context/BikeContext.jsx';
import { useNavigate } from 'react-router-dom';
import InvoicePrint from './InvoicePrint.jsx';
import "./invoice.css";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useBank } from "../../context/BankContext.jsx";

const AllInvoice = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [allInvoice, setAllInvoice] = useState([]);
  const [invoicePrintId, setInvoicePrintId] = useState("");
  const [find, setFind] = useState({
    startDate: "",
    endDate: ""
  });
  const { banks } = useBike();
  const { bikes, models } = useBike();

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


  const FormatDate = (isodate) => {
    if (!isodate) return ""
    const date = new Date(isodate);
    const day = String(date.getDate()).padStart(2, "0");
    const Month = String(date.getMonth() + 1).padStart(2, "0");
    const Year = date.getFullYear();
    return `${day}-${Month}-${Year}`
  };

  const excelExportInvoices = async () => {
    const workbook = new ExcelJS.Workbook();
    const workSheet = workbook.addWorksheet("SALE");

    workSheet.columns = [
      { key: "serial", width: 8 },
      { key: "invoiceNumber", width: 15 },
      { key: "date", width: 15 },
      { key: "customerName", width: 40 },
      { key: "gst", width: 30 },
      { key: "bikeModel", width: 30 },
      { key: "hsn", width: 13 },
      { key: "quan", width: 11 },
      { key: "unit", width: 8 },
      { key: "rate", width: 15 },
      { key: "amt", width: 18 },
      { key: "taxableAmount", width: 17 },
      { key: "cgst", width: 15 },
      { key: "sgst", width: 17 },
      { key: "totalAmount", width: 18 },
      { key: "bill", width: 18 },
      { key: "bank", width: 40 },
    ];

    // ── Reusable style helpers ───────────────────────────────────────────────
    const thinBorder = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // ── Row 1 : Title ────────────────────────────────────────────────────────
    workSheet.mergeCells("A1:Q1");
    const titleCell = workSheet.getCell("A1");
    titleCell.value = "DETAILS OF SALE";
    titleCell.font = { name: "Algerian", size: 36, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFF00" } };
    titleCell.border = thinBorder;
    workSheet.getRow(1).height = 54;

    // ── Rows 2-3 : Spacers (matching sample heights) ─────────────────────────
    workSheet.getRow(2).height = 0.6;
    workSheet.getRow(3).height = 3.75;

    // ── Row 4 : Column Headers ───────────────────────────────────────────────
    const HEADERS = [
      "Sr No.",
      "Invoice No",
      "Invoice Date",
      "Customer Name",
      "Gst No.",
      "Bike Model",
      "Hsn Code",
      "Quantity",
      "Unit",
      "Rate Of Tax",
      "Amount",
      "Taxable Amount",
      "Cgst Output",
      "Sgst Output",
      "Total Amount",
      "Bill-Type",
      "Finance By",
    ];

    const headerRow = workSheet.getRow(4);
    HEADERS.forEach((label, idx) => {
      const cell = headerRow.getCell(idx + 1);
      cell.value = label;
      cell.font = { name: "Arial", size: 10, bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = thinBorder;
    });

    // ── Data Rows ────────────────────────────────────────────────────────────
    let sr = 0;
    allInvoice.forEach((inv) => {
      sr += 1;

      const row = workSheet.addRow({
        serial: sr,
        invoiceNumber: inv.invoiceNumber,
        date: FormatDate(inv.invoiceDate),
        customerName: inv.customerName,
        gst: inv.customerGstNumber || "",
        bikeModel: inv?.bike?.modelName?.model || "",
        hsn: inv?.bike?.hsnCode || "",
        quan: "1",
        unit: "PCS",
        rate: inv.cgst + inv.sgst || "",
        amt: inv?.bike?.basePrice || "",
        taxableAmount: inv?.taxableAmount,
        cgst: inv?.cgst,
        sgst: inv?.sgst,
        totalAmount: inv?.totalAmount,
        bill: inv?.billType,
        bank: inv?.financeCompany?.companyName || "",
      });

      row.height = 15.75;
      row.font = { name: "Arial", size: 11 };

      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = thinBorder;
        cell.alignment = { vertical: "middle" };
      });
    });

    // ── Export ───────────────────────────────────────────────────────────────
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Invoices.xlsx");
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
              <p style={{ "text-align": "left" }}>Start-Date</p>
              <input
                type="date"
                value={find.startDate}
                onChange={(e) => setFind({ ...find, startDate: e.target.value })}
                placeholder='From'
              />
            </div>
            <div className="form-group">
              <p style={{ "text-align": "left" }}>End-Date</p>
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
                onClick={excelExportInvoices}
                className="filter-btn1"
              >
                Excel
              </button>

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
            <div>INVOICE </div>
            <div>CUSTOMER NAME</div>
            <div>CUSTOMER S/W/D</div>
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
                <div>{p?.invoiceNumber}</div>
                <div>{p?.customerName}</div>
                <div>{p?.customerFatherName}</div>
                <div>{p?.bike?.modelName?.model}</div>
                <div>{p?.bike?.variant.varient}</div>
                <div>{p?.bike?.colorOptions?.color}</div>
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

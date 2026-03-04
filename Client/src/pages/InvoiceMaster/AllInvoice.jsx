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
  const { bikes , models} = useBike();

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



  const excelExportInvoices = async () => {
    const workbook = new ExcelJS.Workbook();
    const workSheet = workbook.addWorksheet("Invoices");

    workSheet.columns = [
      { header: "Sr No.", key: "serial", width: 15 },
      { header: "Invoice No", key: "invoiceNumber", width: 15 },
      { header: "Invoice Date", key: "date", width: 20 },
      { header: "Customer Name", key: "customerName", width: 25 },
      { header: "Gst No.", key: "gst", width: 25 },
      { header: "Bike Model", key: "bikeModel", width: 20 },
      { header: "Hsn Code", key: "hsn", width: 15 },
      { header: "Quantity", key: "quan", width: 10 },
      { header: "Unit", key: "unit", width: 10 },
      { header: "Rate Of Tax", key: "rate", width: 15 },
      { header: "Amount", key: "amt", width: 15 },
      { header: "Taxable Amount", key: "taxableAmount", width: 18 },
      { header: "Cgst Output", key: "cgst", width: 15 },
      { header: "Sgst Output", key: "sgst", width: 15 },
      { header: "Total Amount", key: "totalAmount", width: 18 },
      { header: "Bill-Type", key: "bill", width: 18 },
      { header: "Finance By", key: "bank", width: 18 }
    ];

    allInvoice.forEach((inv) => {
      let sr = 0;
      const matchFinance = Array.isArray(banks) ? banks.find((d)=>String(d._id)===String(inv?.financeCompany ?? "")):{};
      const matchBike =Array.isArray(bikes)? bikes.find((d)=> String(d._id)===String(inv?.bike ?? "")):{};
      const matchModel =Array.isA



      workSheet.addRow({
        serial: sr + 1,
        invoiceNumber: inv.invoiceNumber,
        date: inv.invoiceDate,
        customerName: inv.customerName,
        gst: inv.customerGstNumber || "",
        bikeMode: inv,
        hsn: inv,
        quan: "1",
        rate: (inv.cgst + inv.sgst || ""),
        amt: inv,
        taxableAmount: inv.taxableAmount,
        cgst: inv.cgst,
        sgst: inv.sgst,
        totalAmount: inv.totalAmount,
        bill: inv.billType,
        bank: inv
      });
    });


    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Invoices.xlsx");
  }

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

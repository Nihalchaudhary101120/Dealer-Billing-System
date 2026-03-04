import React, { useState, useEffect, useMemo, useRef } from "react";
import { useToast } from "../../context/ToastContext";
import { useBank } from "../../context/BankContext";
import { useBike } from "../../context/BikeContext";
import { useDealer } from "../../context/DealerContext";
import "./invoice.css";
import api from "../../api/api";
import { useParams } from "react-router-dom";

const Invoice = () => {
  const { showToast } = useToast();
  const { dealers } = useDealer();
  const { bikes, schemes, colors, models, varients } = useBike();
  const { banks } = useBank();
  const { id } = useParams();
  const isEditMode = !!id;
  const [quantity, setQuantity] = useState(1);
  const [newBike, setNewBike] = useState({
    model: "",
    color: "",
    variant: ""
  });

  const [loading, setLoading] = useState(false);

  const [newInvoice, setNewInvoice] = useState({
    status: "DRAFT",
    customerName: "",
    customerFatherName: "",
    customerAddress: "",
    customerDistrict: "",
    customerState: "",
    customerPhone: "",
    customerGstNumber: "",
    billType: "Cash",
    isHp: false,
    financeCompany: "",
    bike: "",
    chassisNumber: "",
    engineNumber: "",
    discount: 0,
    scheme: "",
    taxableAmount: "",
    cgst: 9,
    sgst: 9,
    totalAmount: "",
    dealer: "",
  });


  const matchedBike = Array.isArray(bikes) ? bikes.find((b) =>
    String(b.modelName?._id) === String(newBike.model) &&
    String(b.colorOptions?._id) === String(newBike.color) &&
    String(b.variant?._id) === String(newBike.variant)
  ) : null

  const basePrice = Number(matchedBike?.basePrice || "");
  const disc = Number(newInvoice?.discount || "");

  const taxableAmt = useMemo(() => {
    console.log("taxable", (basePrice * quantity - disc * quantity));
    return (basePrice * quantity - disc * quantity);
  }, [basePrice, disc]);

  const sgst = Number(newInvoice?.sgst ?? "");
  const cgst = Number(newInvoice?.cgst ?? "");

  const sgstAmt = useMemo(() => {
    console.log("SGST", parseFloat((taxableAmt * (sgst / 100))).toFixed(2))
    return (taxableAmt * (Number(sgst) / 100));
  }, [sgst, taxableAmt]);

  const cgstAmt = useMemo(() => {
    console.log("CGST", parseFloat((taxableAmt * (cgst / 100))).toFixed(2))
    return (taxableAmt * (Number(cgst) / 100));
  }, [cgst, taxableAmt]);

  const matchScheme = Array.isArray(schemes) ? schemes.find((sm) =>
    String(sm._id || "") === String(newInvoice.scheme)) : {};

  useEffect(() => {
    if (!newInvoice.scheme) {
      setNewInvoice(prev => ({ ...prev, discount: 0 }));
      return;
    }

    if (matchScheme?.value != null) {
      setNewInvoice(prev => ({
        ...prev,
        discount: Number(matchScheme.value)
      }));
    }
  }, [newInvoice.scheme]);

  console.log("matched scheme", matchScheme);

  const finalAmt = useMemo(() => {
    return (taxableAmt + sgstAmt + cgstAmt);
  }, [taxableAmt, sgst, cgst]);

  const today = new Date();
  const applicableSchemes = Array.isArray(schemes)
    ? schemes.filter((s) =>
      String(s.toBike?._id || s.toBike) === String(newBike.model || "") &&
      new Date(s.fromDate) <= today &&
      new Date(s.toDate) >= today
    )
    : [];

  useEffect(() => {
    setNewInvoice((prev) => ({
      ...prev,
      isHp: prev.billType === "Credit",
      totalAmount: finalAmt.toFixed(2),
      taxableAmount: taxableAmt,
      bike: matchedBike?._id,
      discount: matchScheme?.value,
    }));
  }, [newInvoice.billType, taxableAmt, finalAmt, matchedBike]);

  useEffect(() => {
    if (!id) return;
    const fetchDraft = async () => {
      try {
        const res = await api.get(`/invoice/${id}`);
        showToast(res.data.message, "success");

        if (res.data?.success) {
          setNewInvoice(res.data?.draftInvoice);
        console.log("the draft is ",res.data?.draftInvoice);
          setNewBike({
            model: res.data?.draftInvoice?.bike?.modelName?._id || "",
            color: res.data?.draftInvoice?.bike?.colorOptions?._id || "",
            variant: res.data?.draftInvoice?.bike?.variant?._id || ""
          });
        }
      }
      catch (err) {
        showToast(err.response?.data?.message || "Error in fetching draft invoice");
      }
    };

    fetchDraft();
  }, [id,dealers]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payLoad = {
        ...newInvoice,
        status: newInvoice.status,
      };

      let res;

      if (isEditMode) {
        if (!window.confirm('Are you sure you want to update this invoice?')) {
          return;
        }
        res = await api.patch(`/invoice/${id}`, payLoad);
      } else {
        res = await api.post("/invoice/", payLoad);

      }
      console.log("invoice", res.data);
      if (res.data?.success) {
        showToast(res.data.message, "success");

        setNewInvoice({
          status: "DRAFT",
          customerName: "",
          customerFatherName: "",
          customerAddress: "",
          customerDistrict: "",
          customerState: "",
          customerPhone: "",
          customerGstNumber: "",
          billType: "Cash",
          isHp: false,
          financeCompany: "",
          bike: "",
          chassisNumber: "",
          engineNumber: "",
          discount: 0,
          scheme: "",
          taxableAmount: "",
          cgst: 9,
          sgst: 9,
          totalAmount: "",
          dealer: "",
        })
      } else {
        showToast(res.data?.message, "error");
      }

    } catch (err) {
      // log full response body so you can see server message
      console.error("invoice submit failed", err?.response?.data || err?.message || err);
      showToast(err?.response?.data?.message || "Error in invoice", "error");
    } finally {
      setLoading(false);
    }
  };

  const customerNameRef = useRef(null);
  const customerFatherNameRef = useRef(null);
  const customerStateRef = useRef(null);
  const customerAddressRef = useRef(null);
  const customerDistrictRef = useRef(null);
  const customerPhoneRef = useRef(null);
  const customerGstRef = useRef(null);
  const customerCgstRef = useRef(null);
  const customerSgstRef = useRef(null);
  const customerChassisRef = useRef(null);
  const customerEngineRef = useRef(null);
  const submitRef = useRef(null);

  const handleKeyNav = (e, currentField) => {
    if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
      e.preventDefault();
      if (e.key === "Enter" && currentField === "submit") {
        submitRef.current?.click();
        return;
      }

      switch (currentField) {
        case "customerName":
          customerFatherNameRef.current?.focus();
          break;
        case "fathername":
          customerStateRef.current?.focus();
          break;
        case "state":
          customerDistrictRef.current?.focus();
          break;
        case "district":
          customerAddressRef.current?.focus();
          break;
        case "address":
          customerPhoneRef.current?.focus();
          break;
        case "phone":
          customerGstRef.current?.focus();
          break;
        case "customerGst":
          customerChassisRef.current?.focus();
          break;
        case "chassis":
          customerEngineRef.current?.focus();
          break;
        case "engine":
          if (e.key === "Enter") submitRef.current?.click();
          else submitRef.current?.focus();
          break;
        case "submit":
          if (e.key === "Enter") submitRef.current?.click();
          break;
        default:
          break;
      }
    } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      switch (currentField) {
        case "fathername":
          customerNameRef.current?.focus();
          break;
        case "state":
          customerFatherNameRef.current?.focus();
          break;
        case "district":
          customerStateRef.current?.focus();
          break;
        case "address":
          customerDistrictRef.current?.focus();
          break;
        case "phone":
          customerAddressRef.current?.focus();
          break;
        case "customerGst":
          customerPhoneRef.current?.focus();
          break;
        case "chassis":
          customerGstRef.current?.focus();
          break;
        case "engine":
          customerChassisRef.current?.focus();
          break;
        case "submit":
          customerEngineRef.current?.focus();
          break;
        default: break;
      }
    }
  }



  return (
    <div className="trans">
      <div className="trans-container">
        <div className="trans-left">
          <form className="trans-form">

            {/* ===== Dealer & Bike ===== */}
            <div className="salesman-detail">

              <div className="form-group">
                <label>Dealer*</label>
                <select
                  value={newInvoice.dealer}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, dealer: e.target.value })
                  }
                >
                  <option value="">Select Dealer</option>
                  {dealers.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.branchName}
                    </option>
                  ))}
                </select>
              </div>


              <div className="form-group">
                <label>Select Model*</label>
                <select
                  value={newBike.model}
                  onChange={(e) =>
                    setNewBike({ ...newBike, model: e.target.value })
                  }
                >
                  <option value="">Select Model</option>
                  {models.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Variant*</label>
                <select
                  value={newBike.variant}
                  onChange={(e) =>
                    setNewBike({ ...newBike, variant: e.target.value })
                  }
                >
                  <option value="">Select Variant</option>
                  {varients.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.varient}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Color*</label>
                <select
                  value={newBike.color}
                  onChange={(e) =>
                    setNewBike({ ...newBike, color: e.target.value })
                  }
                >
                  <option value="">Select Color</option>
                  {colors.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.color}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Bill Type* </label>
                <select
                  value={newInvoice.billType}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      billType: e.target.value,
                    })
                  }
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status*</label>
                <select
                  value={newInvoice.status}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="FINAL">FINAL</option>
                </select>
              </div>

            </div>
          </form>


          <div className="item-inputs">
            <div className="gap1">
              <div className="flex">
                <div className="form-group">
                  <label>Customer Name*</label>
                  <input
                    ref={customerNameRef}
                    type="text"
                    value={newInvoice.customerName}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        customerName: e.target.value,
                      })
                    }
                    onKeyDown={(e) => handleKeyNav(e, "customerName")}
                  />
                </div>

                <div className="form-group">
                  <label>S/W/D*</label>
                  <input
                    ref={customerFatherNameRef}
                    type="text"
                    value={newInvoice.customerFatherName}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        customerFatherName: e.target.value,
                      })
                    }
                    onKeyDown={(e) => handleKeyNav(e, "fathername")}
                  />
                </div>
                {/* ===== MAIN INPUTS ===== */}
                <div className="form-group">
                  <label>Customer State*</label>
                  <input
                    ref={customerStateRef}
                    type="text"
                    value={newInvoice.customerState}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        customerState: e.target.value,
                      })
                    }
                    onKeyDown={(e) => handleKeyNav(e, "state")}
                  />
                </div>



                <div className="form-group">
                  <label>Customer District*</label>
                  <input
                    ref={customerDistrictRef}
                    type="text"
                    value={newInvoice.customerDistrict}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        customerDistrict: e.target.value,
                      })
                    }
                    onKeyDown={(e) => handleKeyNav(e, "district")}
                  />
                </div>

              </div>

              <div className="flex">
                <div className="form-group form-group2">
                  <label>Customer Address*</label>
                  <input
                    ref={customerAddressRef}
                    type="text"
                    value={newInvoice.customerAddress}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        customerAddress: e.target.value,
                      })
                    }
                    onKeyDown={(e) => handleKeyNav(e, "address")}
                  />
                </div>
              </div>

              <div className="item-inputs">
                <div className="flex">
                  <div className="form-group">
                    <label>Customer Phone*</label>
                    <input
                      ref={customerPhoneRef}
                      type="number"
                      value={newInvoice.customerPhone}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          customerPhone: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyNav(e, "phone")}
                    />
                  </div>



                  <div className="form-group">
                    <label>Customer GST</label>
                    <input
                      ref={customerGstRef}
                      type="text"
                      value={newInvoice.customerGstNumber}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          customerGstNumber: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyNav(e, "customerGst")}
                    />
                  </div>

                  <div className="form-group">
                    <label>Scheme</label>
                    <select
                      value={newInvoice.scheme}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          scheme: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Scheme</option>
                      {applicableSchemes.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.scheme}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="gap2">
              <div className="flex">
                <div className="form-group">
                  <label>SGST %*</label>
                  <input
                    type="number"
                    value={newInvoice.sgst}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        sgst: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>CGST %*</label>
                  <input
                    type="number"
                    value={newInvoice.cgst}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        cgst: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Base Price*</label>
                  <input
                    type="number"
                    readOnly
                    value={matchedBike?.basePrice ?? ""}
                  />
                </div>

                <div className="form-group">
                  <label>Discount</label>
                  <input
                    readOnly
                    type="number"
                    value={newInvoice?.discount ?? ""}

                  />
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="form-group">
                <label>Chassis Number*</label>
                <input
                  ref={customerChassisRef}
                  type="String"
                  value={newInvoice.chassisNumber}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      chassisNumber: e.target.value,
                    })
                  }
                  onKeyDown={(e) => handleKeyNav(e, "chassis")}
                />
              </div>

              <div className="form-group">
                <label>Engine Number*</label>
                <input
                  ref={customerEngineRef}
                  type="String"
                  value={newInvoice.engineNumber}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      engineNumber: e.target.value,
                    })
                  }
                  onKeyDown={(e) => handleKeyNav(e, "engine")}
                />
              </div>



              <div className="form-group">
                <label>Finance Company</label>
                <select
                  value={newInvoice.financeCompany}
                  disabled={newInvoice.billType === "Cash"}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      financeCompany: e.target.value,
                    })
                  }
                >
                  <option value="">Select Bank</option>
                  {banks.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.companyName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex">
              <div className="form-group">
                <label>QTY</label>
                <input
                  readOnly
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <button type="submit"
                  ref={submitRef}
                  onKeyDown={(e) => handleKeyNav(e, "submit")}

                  onClick={handleSubmit} style={{ backgroundColor: "red", margin: "3vh 0 0 0" }}>{isEditMode ? "Final" : "Submit"}</button>
              </div>

              <div className="form-group">
                <label>HSN*</label>
                <input
                  type="text"
                  value={matchedBike?.hsnCode || ""}
                  readOnly
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div >
  );
};

export default Invoice;
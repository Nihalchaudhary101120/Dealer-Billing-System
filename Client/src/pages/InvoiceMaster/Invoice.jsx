import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../../context/ToastContext";
import { useBank } from "../../context/BankContext";
import { useBike } from "../../context/BikeContext";
import { useDealer } from "../../context/DealerContext";
import "./invoice.css";

const Invoice = () => {
  const { showToast } = useToast();
  const { dealers } = useDealer();
  const { bikes, schemes, colors, models, varients } = useBike();
  const { banks } = useBank();

  const [quantity, setQuantity] = useState(1);
  const [newBike, setNewBike] = useState({
    model: "",
    color: "",
    variant: ""
  })

  const [newInvoice, setNewInvoice] = useState({
    status: "DRAFT",
    customerName: "",
    customerFatherName: "",
    customerAddress: "",
    customerDistrict: "",
    customerState: "",
    customerPhone: "",
    customerGstNumber: "",
    billType: "CASH",
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
    return (basePrice * quantity - disc);
  }, [basePrice, disc]);


  const today = new Date();
  // build list of applicable schemes (filter returns an array; default to
  // empty array if `schemes` isn't ready)
  const applicableSchemes = Array.isArray(schemes)
    ? schemes.filter((s) =>
      String(s.toBike?._id || s.toBike) === String(newBike.model || "") &&
      new Date(s.fromDate) <= today &&
      new Date(s.toDate) >= today
    )
    : [];

  // keep isHp in sync with billType without updating state during rendering
  useEffect(() => {
    setNewInvoice((prev) => ({
      ...prev,
      isHp: prev.billType === "Credit",
    }));
  }, [newInvoice.billType]);

  const matchScheme = Array.isArray(schemes) ? schemes.find((sm) =>
    String(sm._id || "") === String(newInvoice.scheme)) : {};



  const matchingBike = Array.isArray(bikes)
    ? bikes.find((b) => String(b._id) === String(newInvoice.bike))
    : null;

  return (
    <div className="trans">
      <div className="trans-container">
        <div className="trans-left">
          <form className="trans-form">

            {/* ===== Dealer & Bike ===== */}
            <div className="salesman-detail">

              <div className="form-group">
                <label>Dealer</label>
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
                <label>Select Model</label>
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
                <label>Select Variant</label>
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
                <label>Select Color</label>
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
                <label>Status</label>
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
                    type="text"
                    value={newInvoice.customerName}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        customerName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>S/W/D</label>
                  <input
                    type="text"
                    value={newInvoice.customerFatherName}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        customerFatherName: e.target.value,
                      })
                    }
                  />
                </div>
                {/* ===== MAIN INPUTS ===== */}
                <div className="item-inputs">
                  <div className="flex">
                    <div className="form-group">
                      <label>Customer State</label>
                      <input
                        type="text"
                        value={newInvoice.customerState}
                        onChange={(e) =>
                          setNewInvoice({
                            ...newInvoice,
                            customerState: e.target.value,
                          })
                        }
                      />
                    </div>



                    <div className="form-group">
                      <label>Customer District</label>
                      <input
                        type="text"
                        value={newInvoice.customerDistrict}
                        onChange={(e) =>
                          setNewInvoice({
                            ...newInvoice,
                            customerDistrict: e.target.value,
                          })
                        }
                      />
                    </div>

                  </div>
                </div>
              </div>

              <div className="item-inputs">
                <div className="flex">
                  <div className="form-group">
                    <label>Customer Phone</label>
                    <input
                      type="number"
                      value={newInvoice.customerPhone}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          customerPhone: e.target.value,
                        })
                      }
                    />
                  </div>



                  <div className="form-group">
                    <label>Customer GST</label>
                    <input
                      type="text"
                      value={newInvoice.customerGstNumber}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          customerGstNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Scheme</label>
                    <select
                      value={newInvoice.scheme}
                      // disabled={newInvoice.billType === "CASH"}
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
                  <label>SGST %</label>
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
                  <label>CGST %</label>
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
                  <label>Base Price</label>
                  <input
                    type="number"
                    readOnly
                    value={matchedBike?.basePrice ?? ""}
                  />
                </div>

                <div className="form-group">
                  <label>Discount</label>
                  <input
                    type="number"
                    value={matchScheme?.value ?? 0}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        discount: matchScheme.value || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="form-group">
                <label>Chassis Number</label>
                <input
                  type="String"
                  value={newInvoice.chassisNumber}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      chassisNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Engine Number</label>
                <input
                  type="String"
                  value={newInvoice.engineNumber}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      engineNumber: e.target.value,
                    })
                  }
                />
              </div>



              <div className="form-group">
                <label>Finance Company</label>
                <select
                  value={newInvoice.financeCompany}
                  disabled={newInvoice.billType === "CASH"}
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
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>HSN</label>
                <input
                  type="text"
                  value={matchedBike?.hsnCode || ""}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Bill Type</label>
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


            </div>

            <div className="flex">
              <div className="form-group">
                <label>Customer Address</label>
                <input
                  type="text"
                  value={newInvoice.customerAddress}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      customerAddress: e.target.value,
                    })
                  }
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
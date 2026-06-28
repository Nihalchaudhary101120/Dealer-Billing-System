import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";

const BillToContext = createContext();

export function BillToProvider({ children }) {
    const { showToast } = useToast();
    const { isAuthenticated } = useAuth();

    const [billTos, setBillTos] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getAllBillTo() {
        try {
            setLoading(true);

            const res = await api.get("/billTo/");

            if (res.data.success) {
                setBillTos(res.data.billTos);
            } else {
                showToast(
                    res?.data?.message || "Error fetching Bill To",
                    "error"
                );
            }

            return res.data;
        } catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function addBillTo(payload) {
        try {
            setLoading(true);

            const res = await api.post("/billTo/", payload);

            if (res.data.success) {
                showToast(
                    res.data.message || "Added Successfully",
                    "success"
                );

                setBillTos((prev) => [
                    ...prev,
                    res.data.created
                ]);
            } else {
                showToast(res.data.message, "error");
            }

            return res.data;
        } catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function updateBillTo(id, payload) {
        try {
            setLoading(true);

            const res = await api.patch(
                `/billTo/${id}`,
                payload
            );

            if (res.data.success) {
                showToast(
                    res.data.message || "Updated Successfully",
                    "success"
                );

                setBillTos((prev) =>
                    prev.map((b) =>
                        b._id === id
                            ? res.data.updated
                            : b
                    )
                );
            } else {
                showToast(res.data.message, "error");
            }

            return res.data;
        } catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function deleteBillTo(id) {
        try {
            setLoading(true);

            const res = await api.delete(
                `/billTo/${id}`
            );

            if (res.data.success) {
                showToast(
                    res.data.message || "Deleted Successfully",
                    "success"
                );

                setBillTos((prev) =>
                    prev.filter((b) => b._id !== id)
                );
            } else {
                showToast(res.data.message, "error");
            }

            return res.data;
        } catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isAuthenticated) return;

        getAllBillTo();
    }, [isAuthenticated]);

    return (
        <BillToContext.Provider
            value={{
                billTos,
                loading,
                getAllBillTo,
                addBillTo,
                updateBillTo,
                deleteBillTo,
            }}
        >
            {children}
        </BillToContext.Provider>
    );
}

export function useBillTo() {
    return useContext(BillToContext);
}
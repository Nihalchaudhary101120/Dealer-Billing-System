import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import useToast from './ToastContext';
import { useAuth } from './AuthContext';

const BankContext = createContext();

export function BankProvider({ children }) {
    const { showToast } = useToast();
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    async function getAllBanks() {
        try {
            setLoading(true);

            const res = await api.get("/bank/");
            if (res.data.success) {
                showToast(res.data.message || "Banks fetched successfully", "success");
                setBanks(res.data?.data);
            }
            else {
                showToast(res?.data?.message || "Error fetching bikes", "error");
            }
            return res.data;
        } catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    async function addBank(payload) {
        try {
            setLoading(true);

            const res = await api.post("/bank/", payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Added sucessfully", "success");
                setBanks(prev => [...prev, res?.data?.created]);
            } else {
                showToast(res.data?.message, "error");
            }
            return res;
        } catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    async function updateBank(id, payload) {
        try {
            setLoading(true);

            const res = await api.patch(`/bank/${id}`, payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Updated sucessfully", "success");
                setBanks((prev) =>
                    prev.map((d) => (d._id === id ? res.data.updated : d))
                );
            } else {
                showToast(res.data?.message, "error");
            }
        } catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    async function deleteBank(id) {
        try {
            setLoading(true);

            const res = await api.delete(`/bank/${id}`);
            if (res?.data?.success) {
                showToast(res.data?.message || "Deleted sucessfully", "success");
                setBanks(prev => prev.filter(c => c._id !== id));
            } else {
                showToast(res.data?.message, "error");
            }
        } catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isAuthenticated) return;
        getAllBanks();
    }, [isAuthenticated]);



    return <BankContext.Provider value={{ banks, loading, deleteBank, addBank, getAllBanks, updateBank }}>{children}</BankContext.Provider>

}

export function useBank() {
    return useContext(BankContext);
}

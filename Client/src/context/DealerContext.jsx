import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';


const DealerContext = createContext();

export function DealerProvider({ children }) {
    const { showToast } = useToast();
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    async function getAllDealers() {
        try {
            setLoading(true);

            const res = await api.get("/dealer/");
            if (res.data.success) {
                showToast(res.data.message || "Dealer fetched successfully", "success");
                setDealers(res.data.dealers);
            }
            else {
                showToast(res?.data?.message || "Error fetching dealers", "error");
            }
            return res.data;
        } catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    async function addDealer(payload) {
        try {
            setLoading(true);

            const res = await api.post("/dealer/", payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Added sucessfully", "success");
                setDealers(prev => [...prev, res?.data?.created]);
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

    async function updateDealer(id, payload) {
        try {
            setLoading(true);

            const res = await api.patch(`/dealer/${id}`, payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Updated sucessfully", "success");
                setDealers((prev) =>
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

    async function deleteDealer(id) {
        try {
            setLoading(true);

            const res = await api.delete(`/dealer/${id}`);
            if (res?.data?.success) {
                showToast(res.data?.message || "Deleted sucessfully", "success");
                setDealers(prev => prev.filter(c => c._id !== id));
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
        getAllDealers();
    }, [isAuthenticated]);



    return <DealerContext.Provider value={{ dealers, loading, deleteDealer, addDealer, getAllDealers, updateDealer }}>{children}</DealerContext.Provider>

}

export function useDealer() {
    return useContext(DealerContext);
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "../api/api";
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const HsnContext = createContext();

export function HsnProvider({ children }) {
    const { showToast } = useToast();
    const [hsns, setHsns] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    async function getAllHsns() {
        try {
            setLoading(true);

            const res = await api.get("/hsn/");
            if (res.data.success) {
                setHsns(res.data.hsns);
            } else {
                showToast(res?.data?.message || "Error fetching Hsns", "error");
            }
            return res.data;
        } catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    async function addHsn(payload) {
        try {
            setLoading(true);
            const res = await api.post("/hsn/", payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Adding successfully", "success");
                setHsns(prev => [...prev, res?.data?.created]);
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

    async function updateHsn(id, payload) {
        try {
            setLoading(true);

            const res = await api.patch(`/hsn/${id}`, payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Updated successfully", "success");
                setHsns((prev) =>
                    prev.map((d) => (d._id === id ? res.data.updated : d)));

            } else {
                showToast(res.data?.message, "error");
            }
        }
        catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }

    };

    async function deleteHsn(id) {
        try {
            setLoading(true);
            const res = await api.delete(`/hsn/${id}`);
            if (res?.data?.success) {
                showToast(res.data?.message || "Deleted successfully", "success");
                setHsns((prev) => prev.filter(c => c._id !== id));
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

    useEffect(() => {
        if (!isAuthenticated) {
            setHsns([]);
            return
        };
        getAllHsns();
    }, [isAuthenticated]);

    return <HsnContext.Provider value={{ hsns, loading, deleteHsn, addHsn, getAllHsns, updateHsn }}>{children}</HsnContext.Provider>


}
export function useHsn() {
    return useContext(HsnContext);
}
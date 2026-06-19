import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "../api/api";
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const PartContext = createContext();

export function PartProvider({ children }) {
    const { showToast } = useToast();
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    async function getAllParts() {
        try {
            setLoading(true);

            const res = await api.get("/part/");
            if (res.data.success) {
                setParts(res.data.parts);
            }
            else {
                showToast(res?.data?.message || "Error fetching parts", "error");
            }
            return res.data;
        } catch (err) {
            console.error(err?.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    async function addPart(payload) {
        try {
            setLoading(true);
            const res = await api.post("/part/", payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Added successfully", "success");
                setParts(prev => [...prev, res?.data?.created]);
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

    async function updatePart(id, payload) {
        try {
            setLoading(true);

            const res = await api.patch(`/part/${id}`, payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Updated successfully", "success");
                setParts((prev) =>
                    prev.map((d) => (d.id === id ? res.data.updated : d))
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

    async function deletePart(id) {
        try {
            setLoading(true);
            const res = await api.delete(`/part/${id}`);
            if (res?.data?.success) {
                showToast(res.data?.message || "Deleted successfully", "success");
                setParts((prev) => prev.filter(c => c.id !== id));
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

    useEffect(()=>{
        if(!isAuthenticated) return;
        getAllParts();
    },[isAuthenticated]);

    return <PartContext.Provider value={{parts , loading ,deletePart ,addPart,getAllParts,updatePart}}>{children}</PartContext.Provider>

}

export function usePart(){
    return useContext(PartContext);
}
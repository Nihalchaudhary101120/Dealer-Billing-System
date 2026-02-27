import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import useToast from './ToastContext';
import { useAuth } from './AuthContext';


const BikeContext = createContext();

export function BikeProvider({ children }) {
    const { showToast } = useToast();
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    async function getAllBikes() {
        try {
            setLoading(true);

            const res = await api.get("/bike/");
            if (res.data.success) {
                showToast(res.data.message || "Bikes fetched successfully", "success");
                setBikes(res.data.bikes);
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

    async function addBike(payload) {
        try {
            setLoading(true);

            const res = await api.post("/bike/", payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Added sucessfully", "success");
                setBikes(prev => [...prev, res?.data?.created]);
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

    async function updateBike(id, payload) {
        try {
            setLoading(true);

            const res = await api.patch(`/bike/${id}`, payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Updated sucessfully", "success");
                setBikes((prev) =>
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

    async function deleteBike(id) {
        try {
            setLoading(true);

            const res = await api.delete(`/bike/${id}`);
            if (res?.data?.success) {
                showToast(res.data?.message || "Deleted sucessfully", "success");
                setBikes(prev => prev.filter(c => c._id !== id));
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
        getAllBikes();
    }, [isAuthenticated]);



    return <BikeContext.Provider value={{ bikes, loading, deleteBike, addBike, getAllBikes, updateBike }}>{children}</BikeContext.Provider>

}

export function useBike() {
    return useContext(BikeContext);
}

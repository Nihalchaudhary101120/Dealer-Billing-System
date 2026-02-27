import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';


const BikeContext = createContext();

export function BikeProvider({ children }) {
    const { showToast } = useToast();
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const [models, setModels] = useState([]);
    const [varients, setVarients] = useState([]);
    const [colors, setColors] = useState([]);

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

    async function getAllModels() {
        try {
            setLoading(true);

            const res = await api.get("/model/");
            if (res.data.success) {
                showToast(res.data.message || "Models fetched successfully", "success");
                setModels(res.data.models);
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

    async function addModel(payload) {
        try {
            setLoading(true);

            const res = await api.post("/model/", payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Added sucessfully", "success");
                setModels(prev => [...prev, res?.data?.created]);
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

    async function updateModel(id, payload) {
        try {
            setLoading(true);

            const res = await api.patch(`/model/${id}`, payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Updated sucessfully", "success");
                setModels((prev) =>
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

    async function deleteModel(id) {
        try {
            setLoading(true);

            const res = await api.delete(`/model/${id}`);
            if (res?.data?.success) {
                showToast(res.data?.message || "Deleted sucessfully", "success");
                setModels(prev => prev.filter(c => c._id !== id));
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

    async function getAllVarients() {
        try {
            setLoading(true);

            const res = await api.get("/varient/");
            if (res.data.success) {
                showToast(res.data.message || "Varients fetched successfully", "success");
                setVarients(res.data.varients);
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

    async function addVarient(payload) {
        try {
            setLoading(true);

            const res = await api.post("/varient/", payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Added sucessfully", "success");
                setVarients(prev => [...prev, res?.data?.created]);
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

    async function updateVarient(id, payload) {
        try {
            setLoading(true);

            const res = await api.patch(`/varient/${id}`, payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Updated sucessfully", "success");
                setVarients((prev) =>
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

    async function deleteVarient(id) {
        try {
            setLoading(true);

            const res = await api.delete(`/varient/${id}`);
            if (res?.data?.success) {
                showToast(res.data?.message || "Deleted sucessfully", "success");
                setVarients(prev => prev.filter(c => c._id !== id));
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

    async function getAllColors() {
        try {
            setLoading(true);

            const res = await api.get("/color/");
            if (res.data.success) {
                showToast(res.data.message || "colors fetched successfully", "success");
                setColors(res.data.colors);
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

    async function addColor(payload) {
        try {
            setLoading(true);

            const res = await api.post("/color/", payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Added sucessfully", "success");
                setColors(prev => [...prev, res?.data?.created]);
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

    async function updateColor(id, payload) {
        try {
            setLoading(true);

            const res = await api.patch(`/color/${id}`, payload);
            if (res?.data?.success) {
                showToast(res.data?.message || "Updated sucessfully", "success");
                setColors((prev) =>
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

    async function deleteColor(id) {
        try {
            setLoading(true);

            const res = await api.delete(`/color/${id}`);
            if (res?.data?.success) {
                showToast(res.data?.message || "Deleted sucessfully", "success");
                setColors(prev => prev.filter(c => c._id !== id));
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
        if (!isAuthenticated) return;
        getAllBikes();
        getAllModels();
        getAllVarients();
        getAllColors();
    }, [isAuthenticated]);

    return <BikeContext.Provider value={{ bikes, loading, deleteBike, addBike, getAllBikes, updateBike, models, getAllModels, addModel, updateModel, deleteModel, varients, getAllVarients, addVarient, updateVarient, deleteVarient, colors, getAllColors, addColor, updateColor, deleteColor }}>{children}</BikeContext.Provider>

}

export function useBike() {
    return useContext(BikeContext);
}

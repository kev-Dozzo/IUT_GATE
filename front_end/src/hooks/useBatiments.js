import { useState, useEffect } from "react";
import { getBatiments, getBatimentById, createBatiment, updateBatiment, deleteBatiment } from "../services/batimentService";

export function useBatiments() {
  const [batiments, setBatiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBatiments = async () => {
    try {
      setLoading(true);
      const data = await getBatiments();
      setBatiments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatiments();
  }, []);

  const addBatiment = async (data) => {
    const newBatiment = await createBatiment(data);
    setBatiments((prev) => [...prev, newBatiment]);
    return newBatiment;
  };

  const editBatiment = async (id, data) => {
    const updated = await updateBatiment(id, data);
    setBatiments((prev) => prev.map((b) => (b.id_batiment === id ? updated : b)));
    return updated;
  };

  const removeBatiment = async (id) => {
    await deleteBatiment(id);
    setBatiments((prev) => prev.filter((b) => b.id_batiment !== id));
  };

  return {
    batiments,
    loading,
    error,
    refresh: fetchBatiments,
    addBatiment,
    editBatiment,
    removeBatiment,
  };
}

export function useBatiment(id) {
  const [batiment, setBatiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getBatimentById(id);
        setBatiment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { batiment, loading, error };
}
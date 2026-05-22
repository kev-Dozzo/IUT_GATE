import { useState, useEffect } from "react";
import { getFilieres, getFiliereById, createFiliere, updateFiliere, deleteFiliere } from "../services/filiereService";

export function useFilieres() {
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFilieres = async () => {
    try {
      setLoading(true);
      const data = await getFilieres();
      setFilieres(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilieres();
  }, []);

  const addFiliere = async (data) => {
    const newFiliere = await createFiliere(data);
    setFilieres((prev) => [...prev, newFiliere]);
    return newFiliere;
  };

  const editFiliere = async (id, data) => {
    const updated = await updateFiliere(id, data);
    setFilieres((prev) => prev.map((f) => (f.id_filiere === id ? updated : f)));
    return updated;
  };

  const removeFiliere = async (id) => {
    await deleteFiliere(id);
    setFilieres((prev) => prev.filter((f) => f.id_filiere !== id));
  };

  return {
    filieres,
    loading,
    error,
    refresh: fetchFilieres,
    addFiliere,
    editFiliere,
    removeFiliere,
  };
}

export function useFiliere(id) {
  const [filiere, setFiliere] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getFiliereById(id);
        setFiliere(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { filiere, loading, error };
}
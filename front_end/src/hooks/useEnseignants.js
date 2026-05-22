import { useState, useEffect } from "react";
import { getEnseignants, getEnseignantById, createEnseignant, updateEnseignant, deleteEnseignant } from "../services/enseignantService";

export function useEnseignants() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnseignants = async () => {
    try {
      setLoading(true);
      const data = await getEnseignants();
      setEnseignants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnseignants();
  }, []);

  const addEnseignant = async (data, photo) => {
    const newEnseignant = await createEnseignant(data, photo);
    setEnseignants((prev) => [...prev, newEnseignant]);
    return newEnseignant;
  };

  const editEnseignant = async (id, data, photo) => {
    const updated = await updateEnseignant(id, data, photo);
    setEnseignants((prev) => prev.map((e) => (e.id_enseignant === id ? updated : e)));
    return updated;
  };

  const removeEnseignant = async (id) => {
    await deleteEnseignant(id);
    setEnseignants((prev) => prev.filter((e) => e.id_enseignant !== id));
  };

  return {
    enseignants,
    loading,
    error,
    refresh: fetchEnseignants,
    addEnseignant,
    editEnseignant,
    removeEnseignant,
  };
}

export function useEnseignant(id) {
  const [enseignant, setEnseignant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getEnseignantById(id);
        setEnseignant(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { enseignant, loading, error };
}
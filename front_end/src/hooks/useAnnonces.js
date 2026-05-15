import { useState, useEffect } from "react";
import { getAnnonces, getAnnonceById, createAnnonce, updateAnnonce, deleteAnnonce } from "../services/annonceService";

export function useAnnonces() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const data = await getAnnonces();
      setAnnonces(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const addAnnonce = async (data) => {
    const newAnnonce = await createAnnonce(data);
    setAnnonces((prev) => [newAnnonce, ...prev]);
    return newAnnonce;
  };

  const editAnnonce = async (id, data) => {
    const updated = await updateAnnonce(id, data);
    setAnnonces((prev) => prev.map((a) => (a.id_annonce === id ? updated : a)));
    return updated;
  };

  const removeAnnonce = async (id) => {
    await deleteAnnonce(id);
    setAnnonces((prev) => prev.filter((a) => a.id_annonce !== id));
  };

  return {
    annonces,
    loading,
    error,
    refresh: fetchAnnonces,
    addAnnonce,
    editAnnonce,
    removeAnnonce,
  };
}

export function useAnnonce(id) {
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getAnnonceById(id);
        setAnnonce(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { annonce, loading, error };
}
import { Routes, Route, Navigate } from "react-router-dom";

// Public
import HomePage from "../pages/Public/Home";
import ActualitesPage from "../pages/Public/ActualitesPage";
import ActualiteDetailPage from "../pages/Public/ActualiteDetailPage";
import FilieresPage from "../pages/Public/FilieresPage";
import FiliereDetailPage from "../pages/Public/FiliereDetailPage";
import EnseignantsPage from "../pages/Public/EnseignantsPage";
import EnseignantDetailPage from "../pages/Public/EnseignantDetailPage";
import DepartementsPage from "../pages/Public/DepartementsPage";
import DepartementDetailPage from "../pages/Public/DepartementDetailPage";
import ServicesPage from "../pages/Public/ServicesPage";
import ServiceDetailPage from "../pages/Public/ServiceDetailPage";
import CartePage from "../pages/Public/CartePage";
import NotFoundPage from "../pages/Public/NotFoundPage";
import AproposPage from "../pages/Public/about";
import AidePage from "../pages/Public/AidePage";

// Admin
import LoginPage from "../pages/admin/LoginPage";
import ForgotPasswordPage from "../pages/admin/ForgetPassWord";
import ResetPasswordPage from "../pages/admin/ResetPassWord";
import DashboardPage from "../pages/admin/Dashboard";
import ActualitesAdmin from "../pages/admin/ActualitesAdmin";
import EnseignantsAdmin from "../pages/admin/EnseignantsAdmin";
import FilieresAdmin from "../pages/admin/FilieresAdmin";
import DepartementsAdmin from "../pages/admin/DepartementsAdmin";
import BatimentsAdmin from "../pages/admin/BatimentsAdmin";
import SallesAdmin from "../pages/admin/SallesAdmin";
import ServicesAdmin from "../pages/admin/ServicesAdmin";
import ProfilAdmin from "../pages/admin/ProfilAdmin";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── PUBLIC ── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/actualites" element={<ActualitesPage />} />
      <Route path="/actualites/:id" element={<ActualiteDetailPage />} />
      <Route path="/filieres" element={<FilieresPage />} />
      <Route path="/filieres/:id" element={<FiliereDetailPage />} />
      <Route path="/enseignants" element={<EnseignantsPage />} />
      <Route path="/enseignants/:id" element={<EnseignantDetailPage />} />
      <Route path="/departements" element={<DepartementsPage />} />
      <Route path="/departements/:id" element={<DepartementDetailPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/carte" element={<CartePage />} />
      <Route path="/apropos" element={<AproposPage />} />
      <Route path="/aide" element={<AidePage />} />

      {/* ── ADMIN AUTH ── */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin/reset-password" element={<ResetPasswordPage />} />

      {/* ── ADMIN PROTÉGÉ ── */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/actualites"
        element={
          <PrivateRoute>
            <ActualitesAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/enseignants"
        element={
          <PrivateRoute>
            <EnseignantsAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/filieres"
        element={
          <PrivateRoute>
            <FilieresAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/departements"
        element={
          <PrivateRoute>
            <DepartementsAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/batiments"
        element={
          <PrivateRoute>
            <BatimentsAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/salles"
        element={
          <PrivateRoute>
            <SallesAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <PrivateRoute>
            <ServicesAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/profil"
        element={
          <PrivateRoute>
            <ProfilAdmin />
          </PrivateRoute>
        }
      />

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

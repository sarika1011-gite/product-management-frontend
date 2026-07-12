import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProductsPage from "../pages/ProductsPage";
import ProductFormPage from "../pages/ProductFormPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";

// 🔒 प्रोटेक्टेड रूट गार्ड
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // जर टोकन नसेल किंवा तो रिकामा असेल, तर थेट लॉगिनवर हाकलणे
  if (!token || token === "undefined" || token === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* लॉगिन पेज */}
      <Route path="/login" element={<LoginPage />} />

      {/* सर्व प्रोटेक्टेड डॅशबोर्ड रूट्स */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
      </Route>

      {/* चुकीचा कोणताही URL टाकला तर होमवर रिडायरेक्ट करणे */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

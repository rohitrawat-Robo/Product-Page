import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ArrowRight, Check, X } from "lucide-react";

import images from "../../public/images";

const API_URL = "http://localhost:5000/api";

// Maps backend logo keys to imported image assets.
// Falls back to a text-only badge if the key is unknown.
const LOGO_MAP = {
  sim: images?.sim,
  isim: images?.isim,
  myconnect: images?.myconnect,
};

export default function ProductPortal() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const userId = location.state?.userId || null;

  // Product state
  const [products, setProducts] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Version selector — default set after products load
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Selected product IDs
  const [selectedProducts, setSelectedProducts] = useState([]);

  // ---------------------------------------------------------
  // Load products from backend
  // ---------------------------------------------------------
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load products.");
        }

        const list = Array.isArray(data.data) ? data.data : [];
        setProducts(list);

        // Pick the highest available version as the default
        const allVersions = list
          .flatMap((p) => p.versions || [])
          .filter((v) => v.isActive && !v.isDeleted)
          .map((v) => v.version);

        if (allVersions.length > 0) {
          setSelectedVersion(Math.max(...allVersions));
        }
      } catch (err) {
        console.error("PRODUCT LOAD ERROR:", err);
        setError(err.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ---------------------------------------------------------
  // Derive the list of versions actually available in the API
  // ---------------------------------------------------------
  const availableVersions = useMemo(() => {
    const set = new Set();
    products.forEach((product) => {
      (product.versions || []).forEach((version) => {
        if (version.isActive && !version.isDeleted) {
          set.add(version.version);
        }
      });
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [products]);

  // ---------------------------------------------------------
  // Products that support the currently selected version
  // ---------------------------------------------------------
  const currentProducts = useMemo(() => {
    if (!selectedVersion) return [];
    return products.filter((product) =>
      product.versions?.some(
        (version) =>
          version.version === selectedVersion &&
          version.isActive &&
          !version.isDeleted
      )
    );
  }, [products, selectedVersion]);

  // ---------------------------------------------------------
  // Toggle product selection
  // ---------------------------------------------------------
  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
    setError("");
    setSuccess("");
  };

  // ---------------------------------------------------------
  // Change software version
  // ---------------------------------------------------------
  const handleVersionChange = (version) => {
    setSelectedVersion(version);
    setOpenDropdown(false);
    setSelectedProducts([]);
    setError("");
    setSuccess("");
  };

  // ---------------------------------------------------------
  // Continue / Save selected products
  // ---------------------------------------------------------
  const handleContinue = async () => {
    try {
      setError("");
      setSuccess("");

      if (!userId) {
        setError(
          "User information is missing. Please complete the verification process again."
        );
        return;
      }

      if (selectedProducts.length === 0) {
        setError("Please select at least one product.");
        return;
      }

      setSaving(true);

      // Build { productId, versionId } selections
      const selections = selectedProducts.map((productId) => {
        const product = products.find((item) => item.id === productId);
        const version = product?.versions?.find(
          (item) =>
            item.version === selectedVersion &&
            item.isActive &&
            !item.isDeleted
        );

        return {
          productId,
          versionId: version?.id,
        };
      });

      const invalidSelection = selections.some((s) => !s.versionId);
      if (invalidSelection) {
        setError(
          "One or more selected products do not have the selected version."
        );
        return;
      }

      const response = await fetch(`${API_URL}/products/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, selections }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save product selection.");
      }

      setSuccess("Your product selection has been saved successfully.");
      setShowModal(true);
    } catch (err) {
      console.error("SAVE PRODUCT ERROR:", err);
      setError(err.message || "Unable to save your product selection.");
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------
  // Modal actions
  // ---------------------------------------------------------
  const handleGoHome = () => {
    setShowModal(false);
    navigate("/", { replace: true });
  };

  // ---------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#757575]">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex h-20 items-center justify-between bg-black px-6 sm:px-10 lg:px-16">
        <div className="hidden text-right sm:block">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/50">
            Welcome
          </p>
          <p className="text-sm font-bold text-white">{email || "Guest"}</p>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Error */}
        {error && (
          <div className="mx-auto mb-6 max-w-2xl rounded-xs border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mx-auto mb-6 max-w-2xl rounded-xs border border-[#76b900] bg-[#f4faed] px-4 py-3 text-sm font-medium text-[#4d7a00]">
            {success}
          </div>
        )}

        {/* Heading */}
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#76b900]">
            Product Portal
          </p>
          <h1 className="mt-3 text-[36px] font-bold leading-tight tracking-tight text-black sm:text-[48px]">
            Choose your software
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-[1.67] text-[#757575]">
            Select a product version to explore the software modules available
            for your organization.
          </p>
        </div>

        {/* Version selector */}
        <div className="mx-auto mt-10 w-full max-w-xs">
          <label className="mb-2 block text-sm font-bold text-black">
            Software Version
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={openDropdown}
              className="flex h-14 w-full cursor-pointer items-center justify-between rounded-xs border border-[#cccccc] bg-white px-4 text-left transition hover:border-black focus:border-2 focus:border-[#76b900] focus:outline-none"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#757575]">
                  Selected Version
                </span>
                <p className="text-base font-bold text-black">
                  {selectedVersion
                    ? `Version ${selectedVersion}`
                    : "No version available"}
                </p>
              </div>

              <ChevronDown
                size={18}
                className={`text-black transition-transform ${
                  openDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown && availableVersions.length > 0 && (
              <div
                role="listbox"
                className="absolute left-0 right-0 z-20 mt-2 rounded-xs border border-[#cccccc] bg-white p-1"
              >
                {availableVersions.map((version) => (
                  <button
                    key={version}
                    type="button"
                    role="option"
                    aria-selected={selectedVersion === version}
                    onClick={() => handleVersionChange(version)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xs px-4 py-3 text-sm font-bold transition ${
                      selectedVersion === version
                        ? "bg-[#76b900] text-black"
                        : "text-[#1a1a1a] hover:bg-[#f7f7f7]"
                    }`}
                  >
                    <span>Version {version}</span>
                    {selectedVersion === version && (
                      <span className="text-xs font-bold uppercase tracking-[0.15em]">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-[24px] font-bold leading-tight text-black">
                Available Products
              </h2>
              <p className="mt-1 text-sm text-[#757575]">
                Products available in Version {selectedVersion}
              </p>
            </div>

            <span className="rounded-xs border border-[#cccccc] bg-[#f7f7f7] px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[#1a1a1a]">
              v{selectedVersion}
            </span>
          </div>

          {/* Product cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {currentProducts.map((product) => {
              const isSelected = selectedProducts.includes(product.id);
              const logoSrc = LOGO_MAP[product.logo];

              return (
                <div
                  key={product.id}
                  onClick={() => toggleProductSelection(product.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      toggleProductSelection(product.id);
                    }
                  }}
                  className={`relative flex cursor-pointer flex-col rounded-xs border bg-white p-6 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#76b900] ${
                    isSelected
                      ? "border-[#76b900] ring-1 ring-[#76b900]"
                      : "border-[#cccccc] hover:border-black"
                  }`}
                >
                  {/* Decorative corner */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-3 h-2 w-2 bg-[#76b900]"
                  />

                  {/* Checkbox */}
                  <div className="absolute left-3 top-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-xs border transition ${
                        isSelected
                          ? "border-[#76b900] bg-[#76b900]"
                          : "border-[#cccccc] bg-white"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-black"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                  </div>

                  {/* Product logo */}
                  <div className="flex h-20 w-full items-center justify-center rounded-xs border border-[#cccccc] bg-[#f7f7f7] px-4">
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={`${product.label || product.name} logo`}
                        className="max-h-12 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-sm font-bold uppercase tracking-[0.15em] text-[#757575]">
                        {product.label || product.name}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mt-6 flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[17px] font-bold leading-[1.47] text-black">
                        {product.name}
                      </h3>
                      <span className="shrink-0 text-xs font-bold uppercase tracking-[0.15em] text-[#757575]">
                        v{selectedVersion}
                      </span>
                    </div>

                    {product.label && (
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-[#1a1a1a]">
                        {product.label}
                      </p>
                    )}

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-[#76b900]">
                      {product.tagline}
                    </p>

                    <p className="mt-3 flex-1 text-sm leading-[1.67] text-[#757575]">
                      {product.description}
                    </p>

                    {/* Explore */}
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-6 inline-flex cursor-pointer items-center gap-2 self-start text-sm font-bold text-[#76b900] transition hover:text-[#5a8d00]"
                    >
                      Explore Product
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No products */}
          {currentProducts.length === 0 && (
            <div className="mt-8 rounded-xs border border-[#cccccc] p-8 text-center">
              <p className="text-sm text-[#757575]">
                No products are available for Version {selectedVersion}.
              </p>
            </div>
          )}
        </section>

        {/* Continue button */}
        <div className="mt-12 flex flex-col items-center">
          <p className="mb-4 text-sm text-[#757575]">
            {selectedProducts.length} product
            {selectedProducts.length !== 1 ? "s" : ""} selected
          </p>

          <button
            type="button"
            onClick={handleContinue}
            disabled={saving || selectedProducts.length === 0}
            className="inline-flex min-w-55 items-center justify-center gap-3 rounded-xs bg-black px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#76b900] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Saving..." : "Continue"}
            {!saving && <ArrowRight size={17} />}
          </button>
        </div>
      </main>

      {/* Success modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
        >
          <div className="relative w-full max-w-md rounded-xs border border-[#cccccc] bg-white p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-3 -top-3 hidden h-3 w-3 bg-[#76b900] sm:block"
            />

            <button
              type="button"
              onClick={handleGoHome}
              aria-label="Close"
              className="absolute right-3 top-3 text-[#757575] transition hover:text-black"
            >
              <X size={18} />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xs bg-[#76b900]">
              <Check size={24} className="text-black" strokeWidth={3} />
            </div>

            <h2
              id="success-modal-title"
              className="mt-5 text-center text-[22px] font-bold leading-tight text-black"
            >
              Selection saved
            </h2>

            <p className="mt-2 text-center text-sm leading-[1.67] text-[#757575]">
              Your product selection has been saved successfully. You're all
              set to explore your software.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-11 flex-1 rounded-xs border border-[#cccccc] bg-white text-sm font-bold text-black transition hover:border-black"
              >
                Stay here
              </button>

              <button
                type="button"
                onClick={handleGoHome}
                className="h-11 flex-1 rounded-xs bg-[#76b900] text-sm font-bold text-black transition hover:bg-[#5a8d00]"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
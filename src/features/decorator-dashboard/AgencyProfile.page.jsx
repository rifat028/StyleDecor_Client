import React, { useContext, useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Spinner from "../home/components/Spinner";
import Swal from "sweetalert2";
import { Building, Plus } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import EmptyState from "../../components/ui/EmptyState";
import AgencyProfileHero from "../../components/pages/Decorator/AgencyProfile/AgencyProfileHero";
import AgencyProfileEditModal from "../../components/pages/Decorator/AgencyProfile/AgencyProfileEditModal";

// Build the edit-form data shape from an agency record, shared by both the initial load and "open edit" actions
const buildFormDataFromAgency = (dec, userEmail) => ({
  businessName: dec.businessName || "",
  tagline: dec.tagline || "",
  about: dec.about || "",
  logo: dec.logo || "",
  coverImage: dec.coverImage || "",
  phone: dec.contactInfo?.phone || "",
  email: dec.contactInfo?.email || userEmail || "",
  website: dec.contactInfo?.website || "",
  address: dec.contactInfo?.address || "",
  city: dec.contactInfo?.city || "Dhaka",
  tradeLicenseNo: dec.verification?.tradeLicenseNo || "",
  facebook: dec.socialLinks?.facebook || "",
  instagram: dec.socialLinks?.instagram || "",
  serviceAreas: Array.isArray(dec.serviceAreas) ? dec.serviceAreas : ["Dhaka"],
  categories: Array.isArray(dec.categories)
    ? dec.categories.map((c) => (typeof c === "string" ? c : c.name || ""))
    : [],
  status: dec.status || "active",
});

const AgencyProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "", tagline: "", about: "", logo: "", coverImage: "",
    phone: "", email: "", website: "", address: "", city: "Dhaka",
    tradeLicenseNo: "", facebook: "", instagram: "",
    serviceAreas: ["Dhaka"], categories: [], status: "active",
  });

  const [newZoneInput, setNewZoneInput] = useState("");

  // 1. Fetch Current Logged-in Decorator Profile (GET /decorators/me)
  const loadAgencyProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/decorators/me");
      const dec = res.data?.data || res.data;
      if (dec) {
        setAgency(dec);
        setFormData(buildFormDataFromAgency(dec, user?.email));
      } else {
        setAgency(null);
      }
    } catch (err) {
      console.warn("Decorator profile not found or error:", err.message);
      setAgency(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, user?.email]);

  useEffect(() => {
    loadAgencyProfile();
  }, [loadAgencyProfile]);

  const handleOpenEdit = () => {
    if (agency) {
      setFormData(buildFormDataFromAgency(agency, user?.email));
    }
    setIsEditModalOpen(true);
  };

  // Submit Update (PATCH /decorators/:id or POST /decorators if new)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.businessName.trim()) {
      Swal.fire("Error", "Business name is required.", "error");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        businessName: formData.businessName.trim(),
        tagline: formData.tagline.trim(),
        about: formData.about.trim(),
        logo: formData.logo.trim() || undefined,
        coverImage: formData.coverImage.trim() || undefined,
        contactInfo: {
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          website: formData.website.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
        },
        serviceAreas: formData.serviceAreas,
        categories: formData.categories.map((c) => (typeof c === "string" ? { name: c } : c)),
        tradeLicenseNo: formData.tradeLicenseNo.trim(),
        socialLinks: {
          facebook: formData.facebook.trim(),
          instagram: formData.instagram.trim(),
        },
        status: formData.status,
      };

      let res;
      if (agency?._id) {
        res = await axiosSecure.patch(`/decorators/${agency._id}`, payload);
      } else {
        res = await axiosSecure.post("/decorators", payload);
      }

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Agency Profile Saved 🎉",
          text: "Your agency identity, contact, and branding have been updated.",
          timer: 1800,
          showConfirmButton: false,
        });

        setIsEditModalOpen(false);
        loadAgencyProfile();
      }
    } catch (err) {
      console.error("Failed to save agency profile:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to update agency profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Operational Duty Status Toggle
  const handleStatusChange = async (newStatus) => {
    if (!agency?._id) return;
    try {
      const res = await axiosSecure.patch(`/decorators/${agency._id}`, { status: newStatus });
      if (res.data?.success) {
        setAgency((prev) => ({ ...prev, status: newStatus }));
        Swal.fire({
          icon: "success",
          title: `Status: ${newStatus.toUpperCase()}`,
          text: "Agency operational status updated.",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  const handleAddZone = () => {
    const zone = newZoneInput.trim();
    if (!zone) return;
    if (!formData.serviceAreas.includes(zone)) {
      setFormData((prev) => ({ ...prev, serviceAreas: [...prev.serviceAreas, zone] }));
    }
    setNewZoneInput("");
  };

  const handleRemoveZone = (zoneToRemove) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((z) => z !== zoneToRemove),
    }));
  };

  if (loading && !agency) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <EmptyState
          icon={Building}
          title="Set Up Your Agency Profile"
          message="Create your official event decorator agency storefront to showcase signature packages, manage field specialists, and receive client bookings."
          action={{ label: "Create Agency Profile Now", onClick: () => setIsEditModalOpen(true) }}
          className="max-w-md"
        />
        <AgencyProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          isNew
          formData={formData}
          setFormData={setFormData}
          isSaving={isSaving}
          onSubmit={handleSaveProfile}
          newZoneInput={newZoneInput}
          onZoneInputChange={setNewZoneInput}
          onAddZone={handleAddZone}
          onRemoveZone={handleRemoveZone}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <DashboardPageHeader
        icon={Building}
        title="Agency Profile"
        subtitle="Manage your public storefront identity, contact details, service coverage, and specializations."
        onRefresh={() => {
          setRefreshing(true);
          loadAgencyProfile();
        }}
        refreshing={refreshing}
        refreshDisabled={refreshing}
        actions={
          <button
            type="button"
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-md shadow-purple-600/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        }
      />

      <AgencyProfileHero
        agency={agency}
        user={user}
        onOpenEdit={handleOpenEdit}
        onStatusChange={handleStatusChange}
      />

      <AgencyProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        isNew={!agency?._id}
        formData={formData}
        setFormData={setFormData}
        isSaving={isSaving}
        onSubmit={handleSaveProfile}
        newZoneInput={newZoneInput}
        onZoneInputChange={setNewZoneInput}
        onAddZone={handleAddZone}
        onRemoveZone={handleRemoveZone}
      />
    </div>
  );
};

export default AgencyProfile;

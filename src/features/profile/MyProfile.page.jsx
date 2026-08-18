import React, { useContext, useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react";
import MyProfileHeader from "../../components/pages/Customer/MyProfile/MyProfileHeader";
import MyProfileAccountDetails from "../../components/pages/Customer/MyProfile/MyProfileAccountDetails";
import MyProfileAddressSection from "../../components/pages/Customer/MyProfile/MyProfileAddressSection";
import MyProfileDecoratorAgencySection from "../../components/pages/Customer/MyProfile/MyProfileDecoratorAgencySection";

// User & Agency Profile Management Page
const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [userData, setUserData] = useState(null);
  const [decoratorData, setDecoratorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDecorator, setIsEditingDecorator] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingDecorator, setSavingDecorator] = useState(false);

  // User Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    photoUrl: "",
    street: "",
    area: "",
    city: "Dhaka",
    postalCode: "",
  });

  // Decorator Agency Form State
  const [decoratorForm, setDecoratorForm] = useState({
    businessName: "",
    tagline: "",
    about: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "Dhaka",
    serviceAreas: ["Dhaka"],
  });

  // Load User Profile & Linked Decorator Agency Profile
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/users/me");
      const u = res.data?.data || res.data;
      setUserData(u);
      if (u) {
        setFormData({
          name: u.name || "",
          phone: u.phone || "",
          photoUrl: u.photoUrl || "",
          street: u.address?.street || "",
          area: u.address?.area || "",
          city: u.address?.city || "Dhaka",
          postalCode: u.address?.postalCode || "",
        });

        // If user is a decorator, load agency profile
        if (u.role === "decorator") {
          try {
            const decRes = await axiosSecure.get("/decorators/me");
            const dec = decRes.data?.data || decRes.data;
            setDecoratorData(dec);
            if (dec) {
              setDecoratorForm({
                businessName: dec.businessName || "",
                tagline: dec.tagline || "",
                about: dec.about || "",
                phone: dec.contactInfo?.phone || "",
                email: dec.contactInfo?.email || u.email || "",
                website: dec.contactInfo?.website || "",
                address: dec.contactInfo?.address || "",
                city: dec.contactInfo?.city || "Dhaka",
                serviceAreas: Array.isArray(dec.serviceAreas)
                  ? dec.serviceAreas
                  : ["Dhaka"],
              });
            }
          } catch (decErr) {
            console.warn("No linked decorator profile found:", decErr.message);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load user profile", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    if (user) {
      loadUser();
    }
  }, [loadUser, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDecoratorInputChange = (e) => {
    const { name, value } = e.target;
    setDecoratorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleServiceArea = (city) => {
    setDecoratorForm((prev) => {
      const exists = prev.serviceAreas.includes(city);
      if (exists) {
        if (prev.serviceAreas.length === 1) return prev;
        return {
          ...prev,
          serviceAreas: prev.serviceAreas.filter((c) => c !== city),
        };
      } else {
        return { ...prev, serviceAreas: [...prev.serviceAreas, city] };
      }
    });
  };

  // Update Personal Profile (PATCH /users/profile)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        photoUrl: formData.photoUrl.trim(),
        address: {
          street: formData.street.trim(),
          area: formData.area.trim(),
          city: formData.city,
          postalCode: formData.postalCode.trim(),
        },
      };

      const res = await axiosSecure.patch("/users/profile", payload);
      if (res.data?.user || res.data?.data) {
        setUserData(res.data.user || res.data.data);
      }
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Update Decorator Agency Profile (PATCH /decorators/:id)
  const handleUpdateDecoratorProfile = async (e) => {
    e.preventDefault();
    if (!decoratorData?._id) return;
    setSavingDecorator(true);

    try {
      const payload = {
        businessName: decoratorForm.businessName.trim(),
        tagline: decoratorForm.tagline.trim(),
        about: decoratorForm.about.trim(),
        contactInfo: {
          phone: decoratorForm.phone.trim(),
          email: decoratorForm.email.trim(),
          website: decoratorForm.website.trim(),
          address: decoratorForm.address.trim(),
          city: decoratorForm.city,
        },
        serviceAreas: decoratorForm.serviceAreas,
      };

      const res = await axiosSecure.patch(
        `/decorators/${decoratorData._id}`,
        payload
      );
      const updated = res.data?.data || res.data;
      if (updated) {
        setDecoratorData(updated);
      }
      toast.success("Agency profile updated successfully!");
      setIsEditingDecorator(false);
    } catch (error) {
      console.error("Failed to update decorator profile", error);
      toast.error(
        error.response?.data?.message || "Failed to update agency profile"
      );
    } finally {
      setSavingDecorator(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          Loading profile data...
        </p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
        <XCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          User Profile Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We couldn't retrieve your profile data. Please try signing in again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* 1. Top Banner Header (With Avatar, Edit button & Account Status block placed right below it) */}
      <MyProfileHeader
        userData={userData}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
      />

      {/* 2. Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Account Credentials */}
        <div className="space-y-6">
          <MyProfileAccountDetails userData={userData} />
        </div>

        {/* Right Column: Address Details & Profile Editor */}
        <div className="lg:col-span-2 space-y-6">
          <MyProfileAddressSection
            address={userData.address}
            isEditing={isEditing}
            onCancelEdit={() => setIsEditing(false)}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmitProfile={handleUpdateProfile}
            saving={saving}
          />

          {/* Decorator Agency Profile & Inline Editor (if role is decorator) */}
          {userData.role === "decorator" && decoratorData && (
            <MyProfileDecoratorAgencySection
              decoratorData={decoratorData}
              isEditingDecorator={isEditingDecorator}
              onToggleEditingDecorator={() =>
                setIsEditingDecorator(!isEditingDecorator)
              }
              decoratorForm={decoratorForm}
              onDecoratorInputChange={handleDecoratorInputChange}
              onToggleServiceArea={handleToggleServiceArea}
              onSubmitDecoratorProfile={handleUpdateDecoratorProfile}
              savingDecorator={savingDecorator}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

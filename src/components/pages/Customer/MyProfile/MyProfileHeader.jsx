import React from "react";
import {
  Mail,
  Calendar,
  Edit3,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

// Categorical role badge styles adhering to design tokens
const ROLE_BADGE_STYLES = {
  admin:
    "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
  decorator:
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60",
  agent:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
  customer:
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60",
};

// Top banner header with profile avatar, metadata, edit toggle, and account status block
const MyProfileHeader = ({ userData, isEditing, onToggleEdit }) => {
  if (!userData) return null;

  const { name, email, photoUrl, role, createdAt } = userData;

  return (
    <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-6 sm:p-10 shadow-xl">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left Side: Avatar & Metadata */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group">
            <img
              src={
                photoUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
              }
              alt={name || "User"}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/20 shadow-2xl shadow-black/40"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full ring-2 ring-purple-950 shadow">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {name || "User Profile"}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  ROLE_BADGE_STYLES[role] || ROLE_BADGE_STYLES.customer
                }`}
              >
                {role || "Customer"}
              </span>
            </div>
            <p className="text-purple-200/90 text-sm flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {email}
            </p>
            <p className="text-purple-300/70 text-xs flex items-center justify-center sm:justify-start gap-1.5 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              Member since{" "}
              {new Date(createdAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Right Side: Edit Action Button & Account Status Block positioned directly below it */}
        <div className="flex flex-col items-stretch sm:items-end gap-3 self-stretch sm:self-auto w-full sm:w-auto">
          {/* Edit Profile Action Button */}
          <button
            type="button"
            onClick={onToggleEdit}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-sm font-semibold transition-all duration-200 shadow-lg cursor-pointer text-white"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? "Cancel Editing" : "Edit Personal Info"}</span>
          </button>

          {/* Account Status Block (Moved directly below the Edit button) */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-xs">
            <div className="p-1 bg-emerald-500 text-white rounded-lg shadow-xs shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-xs text-white leading-tight">
                Account Status
              </h4>
              <p className="text-[11px] text-emerald-300 font-medium leading-tight">
                Verified & Active Member
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileHeader;

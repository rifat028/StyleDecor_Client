import React from "react";
import { User, Mail, Phone, Shield } from "lucide-react";

// Left-column account summary card displaying read-only user credentials
const MyProfileAccountDetails = ({ userData }) => {
  if (!userData) return null;

  const { name, email, phone, role } = userData;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <span>Account Credentials</span>
      </h3>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Full Name
          </p>
          <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
            {name || "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Email Address
          </p>
          <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{email}</span>
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Phone Number
          </p>
          <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{phone || "Not provided"}</span>
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Account Role
          </p>
          <p className="font-medium capitalize text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span>{role || "Customer"} Account</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyProfileAccountDetails;

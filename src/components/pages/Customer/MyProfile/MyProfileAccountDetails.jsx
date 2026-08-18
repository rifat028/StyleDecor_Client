import React from "react";
import { User, Mail, Phone, Shield } from "lucide-react";

// Left-column account summary card displaying data in read-only form format
const MyProfileAccountDetails = ({ userData }) => {
  if (!userData) return null;

  const { name, email, phone, role } = userData;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20 hover:border-purple-300/60 dark:hover:border-purple-800/60">
      <div className="space-y-5">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Account Credentials</span>
        </h3>

        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={name || "Not specified"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={email || "Not specified"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden truncate"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={phone || "Not provided"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden"
              />
            </div>
          </div>

          {/* Account Role */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Account Role
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={`${(role || "Customer").toUpperCase()} ACCOUNT`}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileAccountDetails;

import React from "react";
import { UserPlus, Edit, Award } from "lucide-react";
import Modal from "../../../ui/Modal";

export const AddAgentModal = ({ isOpen, onClose, agentForm, setAgentForm, onSubmit }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Hire / Register Field Specialist" icon={UserPlus} dark maxWidth="max-w-lg">
    <form onSubmit={onSubmit} className="space-y-4 text-xs text-slate-700 dark:text-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-100">Full Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Tariqul Islam"
            value={agentForm.name}
            onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-100">Email Address *</label>
          <input
            type="email"
            required
            placeholder="agent@styledecor.com"
            value={agentForm.email}
            onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-100">Phone Number *</label>
          <input
            type="text"
            required
            placeholder="+8801700000000"
            value={agentForm.phone}
            onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-100">Designation</label>
          <input
            type="text"
            placeholder="Lead Stage Architect"
            value={agentForm.designation}
            onChange={(e) => setAgentForm({ ...agentForm, designation: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-bold text-slate-800 dark:text-slate-100">Specialization</label>
        <input
          type="text"
          placeholder="e.g. Stage Architecture & Floral Setup"
          value={agentForm.specialization}
          onChange={(e) => setAgentForm({ ...agentForm, specialization: e.target.value })}
          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-100">Operating City</label>
          <input
            type="text"
            placeholder="Dhaka"
            value={agentForm.city}
            onChange={(e) => setAgentForm({ ...agentForm, city: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-100">Coverage Zones</label>
          <input
            type="text"
            placeholder="Dhanmondi, Gulshan"
            value={agentForm.zones}
            onChange={(e) => setAgentForm({ ...agentForm, zones: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer">
          Cancel
        </button>
        <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer">
          Register Specialist
        </button>
      </div>
    </form>
  </Modal>
);

export const EditAgentModal = ({ isOpen, onClose, selectedAgent, agentForm, setAgentForm, onSubmit }) => (
  <Modal
    isOpen={isOpen && !!selectedAgent}
    onClose={onClose}
    title={selectedAgent ? `Edit Specialist: ${selectedAgent.name}` : "Edit Specialist"}
    icon={Edit}
    dark
    maxWidth="max-w-lg"
  >
    <form onSubmit={onSubmit} className="space-y-4 text-xs text-slate-700 dark:text-slate-200">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-100">Full Name *</label>
          <input
            type="text"
            required
            value={agentForm.name}
            onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-100">Phone Number *</label>
          <input
            type="text"
            required
            value={agentForm.phone}
            onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-100">Designation</label>
          <input
            type="text"
            value={agentForm.designation}
            onChange={(e) => setAgentForm({ ...agentForm, designation: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-100">Status</label>
          <select
            value={agentForm.status}
            onChange={(e) => setAgentForm({ ...agentForm, status: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="available">Available</option>
            <option value="on_assignment">On Assignment</option>
            <option value="off_duty">Off Duty</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-bold text-slate-800 dark:text-slate-100">Specialization</label>
        <input
          type="text"
          value={agentForm.specialization}
          onChange={(e) => setAgentForm({ ...agentForm, specialization: e.target.value })}
          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
        />
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer">
          Cancel
        </button>
        <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer">
          Save Changes
        </button>
      </div>
    </form>
  </Modal>
);

export const AppraiseAgentModal = ({ isOpen, onClose, selectedAgent, appraisalForm, setAppraisalForm, onSubmit }) => (
  <Modal
    isOpen={isOpen && !!selectedAgent}
    onClose={onClose}
    title={selectedAgent ? `Appraise Specialist: ${selectedAgent.name}` : "Appraise Specialist"}
    icon={Award}
    dark
    maxWidth="max-w-md"
  >
    <form onSubmit={onSubmit} className="space-y-4 text-xs text-slate-700 dark:text-slate-200">
      <div className="space-y-1">
        <label className="font-bold text-slate-800 dark:text-slate-100">Quality Rating Score (1 to 5 Stars)</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setAppraisalForm({ ...appraisalForm, rating: star })}
              className={`p-2 rounded-xl border text-base font-black cursor-pointer transition-all ${
                appraisalForm.rating >= star
                  ? "border-amber-500 bg-amber-500 text-white shadow-xs"
                  : "border-slate-200 dark:border-slate-700 text-slate-400"
              }`}
            >
              ★ {star}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-bold text-slate-800 dark:text-slate-100">Event Execution Outcome</label>
        <select
          value={appraisalForm.eventOutcome}
          onChange={(e) => setAppraisalForm({ ...appraisalForm, eventOutcome: e.target.value })}
          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer capitalize"
        >
          <option value="outstanding">Outstanding Execution</option>
          <option value="excellent">Excellent - On Time</option>
          <option value="good">Good - Minor Adjustments</option>
          <option value="needs_improvement">Needs Improvement</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="font-bold text-slate-800 dark:text-slate-100">Appraisal Review Comment</label>
        <textarea
          rows={3}
          required
          placeholder="e.g. Maintained flawless stage symmetry and completed floral setup ahead of schedule..."
          value={appraisalForm.comment}
          onChange={(e) => setAppraisalForm({ ...appraisalForm, comment: e.target.value })}
          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={appraisalForm.recommendedForBigEvents}
          onChange={(e) => setAppraisalForm({ ...appraisalForm, recommendedForBigEvents: e.target.checked })}
          className="checkbox checkbox-primary checkbox-xs"
        />
        <span className="font-medium text-slate-700 dark:text-slate-300">Recommend for VIP & Grand Gala Events</span>
      </label>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer">
          Cancel
        </button>
        <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer">
          Submit Appraisal
        </button>
      </div>
    </form>
  </Modal>
);

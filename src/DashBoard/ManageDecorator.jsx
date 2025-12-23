import React, { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTrashAlt, FaUserMinus } from "react-icons/fa";
import Spinner from "../Components/Spinner";

/**
 * ✅ ManageDecorator.jsx
 * - Default: Pending decorators
 * - Radio filter: Pending / Accepted
 * - Pending actions: Accept, Delete
 * - Accepted actions: Remove
 *
 * ✅ Expected server endpoints (recommended):
 * 1) GET    /decorators?status=pending|accepted
 * 2) PATCH  /decorators/:id        (accept => set status + taskCompleted/taskPending)
 * 3) DELETE /decorators/:id
 * 4) PATCH  /users/role           (body: { email, role })
 *
 * If your server uses different routes, just change the axios URLs.
 */

const ManageDecorator = () => {
  const axiosSecure = useAxiosSecure();

  const [statusFilter, setStatusFilter] = useState("pending"); // default
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- Load decorators based on selected filter ----------
  useEffect(() => {
    const loadDecorators = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/decorators?status=${statusFilter}`);
        setDecorators(res.data || []);
      } catch (error) {
        console.error("Failed to load decorators:", error);
        setDecorators([]);
      } finally {
        setLoading(false);
      }
    };

    loadDecorators();
  }, [axiosSecure, statusFilter]);

  // ---------- Accept (pending -> accepted) ----------
  const handleAccept = async (decorator) => {
    const confirm = await Swal.fire({
      title: "Accept this decorator?",
      text: "This will approve the decorator and change user role to decorator.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
      // 1) update decorator status + tasks
      await axiosSecure.patch(`/decorators/${decorator._id}`, {
        status: "accepted",
        taskCompleted: 0,
        taskPending: 0,
      });

      // 2) update user role -> decorator
      await axiosSecure.patch(`/users/role`, {
        email: decorator.email,
        role: "decorator",
      });

      // remove from UI (since pending list)
      setDecorators((prev) => prev.filter((d) => d._id !== decorator._id));

      Swal.fire("Accepted!", "Decorator approved successfully.", "success");
    } catch (error) {
      console.error("Accept failed:", error);
      Swal.fire("Error", "Failed to accept decorator.", "error");
    }
  };

  // ---------- Delete (pending only) ----------
  const handleDelete = async (decoratorId) => {
    const confirm = await Swal.fire({
      title: "Delete request?",
      text: "This will remove the decorator request permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/decorators/${decoratorId}`);
      setDecorators((prev) => prev.filter((d) => d._id !== decoratorId));
      Swal.fire("Deleted!", "Decorator request deleted.", "success");
    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire("Error", "Failed to delete decorator request.", "error");
    }
  };

  // ---------- Remove (accepted only) ----------
  const handleRemove = async (decorator) => {
    const confirm = await Swal.fire({
      title: "Remove this decorator?",
      text: "This will delete from decorators and set user role back to client.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
      // 1) remove from decorators collection
      await axiosSecure.delete(`/decorators/${decorator._id}`);

      // 2) update user role back to client
      await axiosSecure.patch(`/users/role`, {
        email: decorator.email,
        role: "client",
      });

      // remove from UI (accepted list)
      setDecorators((prev) => prev.filter((d) => d._id !== decorator._id));

      Swal.fire("Removed!", "Decorator removed successfully.", "success");
    } catch (error) {
      console.error("Remove failed:", error);
      Swal.fire("Error", "Failed to remove decorator.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      {/* Top Section */}
      <div className="bg-base-200 dark:bg-slate-900 mb-6">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white">
            Manage <span className="text-purple-500">Decorators</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-base-content/70 dark:text-slate-300">
            Approve pending decorators or manage accepted decorators.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-10">
        {/* Filter radio buttons */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="decoratorStatus"
                className="radio radio-primary"
                checked={statusFilter === "pending"}
                onChange={() => setStatusFilter("pending")}
              />
              <span className="text-base-content dark:text-white">Pending</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="decoratorStatus"
                className="radio radio-primary"
                checked={statusFilter === "accepted"}
                onChange={() => setStatusFilter("accepted")}
              />
              <span className="text-base-content dark:text-white">
                Accepted
              </span>
            </label>
          </div>

          <p className="text-sm text-base-content/70 dark:text-gray-300">
            Showing:{" "}
            <span className="font-semibold capitalize">{statusFilter}</span>
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <Spinner></Spinner>
        ) : decorators.length === 0 ? (
          <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-200 dark:bg-gray-800 p-8 text-center">
            <p className="text-base-content dark:text-white font-medium">
              No {statusFilter} decorators found.
            </p>
            <p className="mt-2 text-sm text-base-content/70 dark:text-gray-300">
              Try switching the filter.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200 dark:bg-gray-700">
                  <tr className="text-base-content dark:text-white">
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Expertise</th>
                    <th>Location</th>
                    <th>Experience</th>

                    {statusFilter === "accepted" && (
                      <>
                        <th>Completed</th>
                        <th>Pending</th>
                      </>
                    )}

                    <th className="text-center">
                      {statusFilter === "pending" ? "Actions" : "Remove"}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {decorators.map((d, index) => (
                    <tr
                      key={d._id}
                      className="text-base-content dark:text-gray-100"
                    >
                      <td>{index + 1}</td>
                      <td className="font-semibold min-w-35">{d.name}</td>
                      <td className="min-w-55">{d.email}</td>
                      <td className="capitalize min-w-27">
                        {d.decorationExpertise}
                      </td>
                      <td className="min-w-30">{d.location}</td>
                      <td className="min-w-30">{d.experience} yr</td>

                      {statusFilter === "accepted" && (
                        <>
                          <td className="min-w-27">{d.taskCompleted ?? 0}</td>
                          <td className="min-w-27">{d.taskPending ?? 0}</td>
                        </>
                      )}

                      <td className="min-w-40">
                        <div className="flex justify-center gap-2">
                          {statusFilter === "pending" ? (
                            <>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => handleAccept(d)}
                                title="Accept"
                              >
                                <FaCheckCircle />
                              </button>

                              <button
                                className="btn btn-sm btn-outline text-red-500"
                                onClick={() => handleDelete(d._id)}
                                title="Delete"
                              >
                                <FaTrashAlt />
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline text-red-500"
                              onClick={() => handleRemove(d)}
                              title="Remove"
                            >
                              <FaUserMinus />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 bg-base-200 dark:bg-gray-700 flex items-center justify-between">
              <p className="text-sm text-base-content/70 dark:text-gray-200">
                Total:{" "}
                <span className="font-semibold">{decorators.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDecorator;

import React, { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Spinner from "../Components/Spinner";

const ManageService = () => {
  const axiosSecure = useAxiosSecure();

  //========== searching essencials ==========
  // filter values (ONLY capturing – no logic)
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("all");
  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");

  const [query, setQuery] = useState("");

  const queryFilter = `?category=${category}${
    minCost && `&min_cost=${minCost}`
  }${maxCost && `&max_cost=${maxCost}`}${
    searchText && `&search_text=${searchText}`
  }`;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    serviceName: "",
    serviceCategory: "home",
    description: "",
    cost: "",
    unit: "",
    rating: "",
    totalReviews: "",
  });

  // ---------- Load Services ----------
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/services${query}`);
        setServices(res.data || []);
      } catch (err) {
        console.error(err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, [axiosSecure, query]);

  // ---------- Helpers ----------
  const todayDate = new Date().toISOString().split("T")[0];

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      serviceName: "",
      serviceCategory: "home",
      description: "",
      cost: "",
      unit: "",
      rating: "",
      totalReviews: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      serviceName: service.serviceName,
      serviceCategory: service.serviceCategory,
      description: service.description,
      cost: service.cost,
      unit: service.unit,
      rating: service.rating,
      totalReviews: service.totalReviews,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      cost: Number(formData.cost),
      rating: Number(formData.rating),
      totalReviews: Number(formData.totalReviews),
      createdByEmail: "admin@styledecor.com",
      createdDate: todayDate,
    };

    try {
      if (editingService) {
        await axiosSecure.patch(`/services/${editingService._id}`, payload);
        setServices((prev) =>
          prev.map((s) =>
            s._id === editingService._id ? { ...s, ...payload } : s
          )
        );
        Swal.fire("Updated!", "Service updated successfully.", "success");
      } else {
        const res = await axiosSecure.post("/services", payload);
        const refreshed = await axiosSecure.get("/services");
        setServices(refreshed.data || []);
        Swal.fire("Added!", "New service added successfully.", "success");
      }
      closeModal();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Operation failed.", "error");
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete service?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
      Swal.fire("Deleted!", "Service removed.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Delete failed.", "error");
    }
  };

  if (loading) {
    return <Spinner></Spinner>;
  }

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900 px-4 py-6">
      {/* ===== Top Section ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold dark:text-white">
          Manage <span className="text-purple-500">Services</span>
        </h1>

        <button onClick={openAddModal} className="btn btn-primary gap-2">
          <FaPlus /> Add Service
        </button>
      </div>

      {/* ============= search and filter section =============== */}
      <div className=" bg-gray-50 p-10 rounded-2xl dark:bg-gray-900 md:grid md:grid-cols-3 md:gap-3">
        {/* SEARCH SECTION */}
        <div className="bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-2xl p-4 shadow-sm  mb-3 md:mb-0 ">
          {/* Search */}
          <div className="md:col-span-3">
            <label className="label">
              <span className="label-text dark:text-slate-200">Search</span>
            </label>
            <div className="flex">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search service..."
                className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white rounded-r-none"
              />
              <button
                className="btn btn-primary rounded-l-none w-[30%]"
                onClick={() => setQuery(queryFilter)}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/*FILTER SECTION */}
        <div className="bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-2xl p-4 shadow-sm md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-9 gap-4">
            {/* Category */}
            <div className="md:col-span-3">
              <label className="label">
                <span className="label-text dark:text-slate-200">Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select select-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="home">Home</option>
                <option value="wedding">Wedding</option>
                <option value="office">Office</option>
                <option value="seminar">Seminar</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>

            {/* Min */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text dark:text-slate-200">
                  Min (BDT)
                </span>
              </label>
              <input
                type="number"
                value={minCost}
                onChange={(e) => setMinCost(e.target.value)}
                className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>

            {/* Max */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text dark:text-slate-200">
                  Max (BDT)
                </span>
              </label>
              <input
                type="number"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-2 flex items-center flex-col">
              <label className="label">
                <span className="label-text dark:text-slate-200">
                  Apply Filters
                </span>
              </label>
              <button
                className="btn btn-primary"
                onClick={() => setQuery(queryFilter)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="overflow-x-auto bg-base-100 dark:bg-gray-800 border rounded-xl mt-8">
        <table className="table w-full">
          <thead className="bg-base-200 dark:bg-gray-700">
            <tr className="dark:text-white">
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Cost</th>
              <th>Unit</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service, index) => (
              <tr key={service._id}>
                <td>{index + 1}</td>
                <td className="font-semibold">{service.serviceName}</td>
                <td className="capitalize">{service.serviceCategory}</td>
                <td>৳{service.cost}</td>
                <td>{service.unit}</td>
                <td>{service.rating}</td>
                <td>{service.totalReviews}</td>
                <td>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="btn btn-sm btn-outline"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="btn btn-sm btn-outline text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Modal ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-base-100 dark:bg-gray-800 w-full max-w-xl p-6 rounded-xl">
            <h3 className="text-xl font-bold dark:text-white mb-4">
              {editingService ? "Edit Service" : "Add New Service"}
            </h3>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                required
                placeholder="Service Name"
                className="input input-bordered w-full"
                value={formData.serviceName}
                onChange={(e) =>
                  setFormData({ ...formData, serviceName: e.target.value })
                }
              />

              <select
                className="select select-bordered w-full"
                value={formData.serviceCategory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceCategory: e.target.value,
                  })
                }
              >
                <option value="home">Home</option>
                <option value="wedding">Wedding</option>
                <option value="office">Office</option>
                <option value="seminar">Seminar</option>
                <option value="meeting">Meeting</option>
              </select>

              <textarea
                required
                placeholder="Description"
                className="textarea textarea-bordered"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <input
                type="number"
                min="5000"
                max="500000"
                required
                placeholder="Cost"
                className="input input-bordered"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
              />

              <input
                required
                placeholder="Unit"
                className="input input-bordered"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              />

              <input
                required
                placeholder="Rating"
                className="input input-bordered"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
              />

              <input
                required
                placeholder="Total Reviews"
                className="input input-bordered"
                value={formData.totalReviews}
                onChange={(e) =>
                  setFormData({ ...formData, totalReviews: e.target.value })
                }
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageService;

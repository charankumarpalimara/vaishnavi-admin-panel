"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Plus, Search, Clock, Edit2, Trash2, Sparkle } from "lucide-react";
import { useAdmin } from "../AdminContext";
import { DataTable, ColumnDef } from "@/components/ui";
import { ServiceModal } from "@/components/admin";
import { ServiceItem } from "@/types";

export default function ServicesManagementPage() {
  const { services, categories, updateService, addService, deleteService } =
    useAdmin();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Add & Edit
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceModalMode, setServiceModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null
  );
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(
    null
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Check URL query for initial category filter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam) {
        setSelectedCategory(catParam);
      }
    }
  }, []);

  const categoryFilterList = useMemo(() => {
    return [{ id: "all", name: "All Services" }, ...categories];
  }, [categories]);

  const handleOpenCreateModal = () => {
    setServiceModalMode("create");
    setSelectedService(null);
    setIsServiceModalOpen(true);
  };

  const handleOpenEditModal = (svc: ServiceItem) => {
    setServiceModalMode("edit");
    setSelectedService(svc);
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (
    serviceData: Omit<ServiceItem, "id">,
    id?: string
  ) => {
    if (serviceModalMode === "create") {
      addService(serviceData);
    } else if (serviceModalMode === "edit" && id) {
      updateService(id, serviceData);
    }
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id);
      setServiceToDelete(null);
    }
  };

  const filteredServices = services.filter((svc) => {
    const matchesCat =
      selectedCategory === "all" || svc.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const columns: ColumnDef<ServiceItem>[] = [
    {
      key: "title",
      header: "Service",
      sortable: true,
      sortValue: (svc) => svc.title,
      render: (svc) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
            <Image
              src={svc.image}
              alt={svc.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-medium text-stone-900 block text-xs sm:text-sm">
                {svc.title}
              </span>
              {svc.tag && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-0.5">
                  <Sparkle className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                  <span>{svc.tag}</span>
                </span>
              )}
            </div>
            <span className="text-stone-500 text-xs line-clamp-1 mt-0.5 font-normal">
              {svc.description}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "categoryName",
      header: "Category",
      sortable: true,
      render: (svc) => (
        <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md text-xs font-normal">
          {svc.categoryName}
        </span>
      ),
    },
    {
      key: "durationMinutes",
      header: "Duration",
      sortable: true,
      sortValue: (svc) => svc.durationMinutes,
      render: (svc) => (
        <span className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 font-normal">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          {svc.durationMinutes} mins
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      sortValue: (svc) => svc.price,
      render: (svc) => (
        <div>
          <span className="font-medium text-[#581c3c] text-xs sm:text-sm font-serif">
            ₹{svc.price}
          </span>
          {svc.originalPrice && svc.originalPrice > svc.price && (
            <span className="text-stone-400 line-through text-xs ml-1.5 font-normal">
              ₹{svc.originalPrice}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      sortValue: (svc) => svc.rating,
      render: (svc) => (
        <span className="text-stone-600 text-xs sm:text-sm font-normal">
          ★ {svc.rating}{" "}
          <span className="text-stone-400 text-xs">({svc.reviewsCount})</span>
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (svc) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenEditModal(svc)}
            className="px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
            title="Edit service details & pricing"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setServiceToDelete(svc)}
            className="px-2.5 py-1.5 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
            title="Delete service"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium font-serif text-stone-900">
            Services & Pricing Catalog
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
            Manage your service list, update prices, or add new beauty packages for Bahadurpally clients.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Search & Category Filter Toolbar (Clean, unboxed) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search services by title, category, or description..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-stone-200 rounded-md px-3 py-2 text-xs sm:text-sm text-stone-700 focus:outline-none focus:border-[#581c3c] cursor-pointer"
          >
            {categoryFilterList.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <span className="text-xs sm:text-sm text-stone-500 font-normal">
            Total {filteredServices.length} active services
          </span>
        </div>
      </div>

      {/* Global DataTable with Integrated Pagination & Sorting */}
      <DataTable
        data={filteredServices}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyTitle="No services found"
        emptyDescription="Try selecting a different category or clearing your search term."
        pagination={{
          currentPage,
          pageSize,
          totalItems: filteredServices.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 15, 20],
        }}
      />

      {/* Global Service Modal (Used for both Add & Edit) */}
      <ServiceModal
        isOpen={isServiceModalOpen}
        mode={serviceModalMode}
        service={selectedService}
        categories={categories}
        onClose={() => {
          setIsServiceModalOpen(false);
          setSelectedService(null);
        }}
        onSave={handleSaveService}
      />

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-stone-200/80 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-medium font-serif text-stone-900">
                Delete Service
              </h3>
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-normal">
              Are you sure you want to delete{" "}
              <span className="font-medium text-stone-900">
                &quot;{serviceToDelete.title}&quot;
              </span>
              ? This service will be removed from your catalog.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                className="px-3.5 py-1.5 rounded-md border border-stone-200 text-stone-700 text-xs font-normal hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

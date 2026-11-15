"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowRight,
  Award,
  CheckCircle2,
  X,
  AlertCircle,
  Sparkle,
  Palette,
  Scissors,
  Gift,
  Smile,
  Feather,
  Heart,
  Crown,
  Flower2,
  Gem,
  Upload,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "../AdminContext";
import { ServiceCategory } from "@/types";
import { DataTable, ColumnDef } from "@/components/ui";

// Icon selector options
const AVAILABLE_ICONS = [
  { name: "Sparkles", icon: Sparkles, label: "Sparkles" },
  { name: "Sparkle", icon: Sparkle, label: "Star" },
  { name: "Palette", icon: Palette, label: "Palette" },
  { name: "Scissors", icon: Scissors, label: "Scissors" },
  { name: "Gift", icon: Gift, label: "Gift Pack" },
  { name: "Smile", icon: Smile, label: "Facial" },
  { name: "Feather", icon: Feather, label: "Feather" },
  { name: "Heart", icon: Heart, label: "Heart" },
  { name: "Crown", icon: Crown, label: "Crown" },
  { name: "Flower2", icon: Flower2, label: "Floral" },
  { name: "Gem", icon: Gem, label: "Gem" },
  { name: "Layers", icon: Layers, label: "Layers" },
];

const getCategoryIconComponent = (iconName?: string) => {
  const match = AVAILABLE_ICONS.find(
    (i) => i.name.toLowerCase() === (iconName || "Sparkles").toLowerCase()
  );
  return match ? match.icon : Layers;
};

export default function CategoriesManagementPage() {
  const { categories, services, addCategory, updateCategory, deleteCategory } =
    useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image size should be less than 5MB");
      return;
    }

    setImageFileName(file.name);
    setFormError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormImage("");
    setImageFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Delete Confirmation State
  const [categoryToDelete, setCategoryToDelete] = useState<ServiceCategory | null>(
    null
  );

  // Derive stats per category
  const categoriesWithStats = useMemo(() => {
    return categories.map((cat) => {
      const catServices = services.filter((s) => s.categoryId === cat.id);
      const count = catServices.length;
      const prices = catServices.map((s) => s.price);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      const priceRange =
        prices.length === 0
          ? "—"
          : minPrice === maxPrice
            ? `₹${minPrice}`
            : `₹${minPrice} - ₹${maxPrice}`;

      return {
        ...cat,
        servicesCount: count,
        priceRange,
        sampleServices: catServices.slice(0, 3).map((s) => s.title),
      };
    });
  }, [categories, services]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categoriesWithStats.filter((cat) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.badge && cat.badge.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBadge =
        badgeFilter === "all" ||
        (badgeFilter === "with-badge" && Boolean(cat.badge)) ||
        (badgeFilter === "no-badge" && !cat.badge);

      return matchesSearch && matchesBadge;
    });
  }, [categoriesWithStats, searchQuery, badgeFilter]);

  // Paginated categories for card view
  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  // Overall KPI stats
  const totalCategoriesCount = categories.length;
  const totalServicesCount = services.length;
  const badgedCount = categories.filter((c) => Boolean(c.badge)).length;
  const topCategory = useMemo(() => {
    if (categoriesWithStats.length === 0) return null;
    return [...categoriesWithStats].sort(
      (a, b) => b.servicesCount - a.servicesCount
    )[0];
  }, [categoriesWithStats]);

  // Modal Handlers
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setFormName("");
    setFormBadge("");
    setFormDescription("");
    setFormImage("");
    setImageFileName("");
    setFormError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: ServiceCategory) => {
    setModalMode("edit");
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormBadge(cat.badge || "");
    setFormDescription(cat.description || "");
    setFormImage(cat.image || "");
    setImageFileName(cat.image ? "Current category image" : "");
    setFormError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Please enter a category name");
      return;
    }

    if (modalMode === "create") {
      addCategory({
        name: formName.trim(),
        badge: formBadge.trim() || undefined,
        description:
          formDescription.trim() ||
          `Specialized salon & bridal services by Anusha in Bahadurpally.`,
        image: formImage || undefined,
        iconName: "Sparkles",
      });
    } else if (modalMode === "edit" && editingId) {
      updateCategory(editingId, {
        name: formName.trim(),
        badge: formBadge.trim() || undefined,
        description: formDescription.trim(),
        image: formImage || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  // DataTable Column Definitions
  const columns: ColumnDef<typeof categoriesWithStats[number]>[] = [
    {
      key: "name",
      header: "Category",
      sortable: true,
      render: (cat) => {
        const IconComponent = getCategoryIconComponent(cat.iconName);
        return (
          <div className="flex items-center gap-3">
            {cat.image ? (
              <div className="w-10 h-10 rounded-md overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-md bg-[#581c3c]/10 text-[#581c3c] flex items-center justify-center shrink-0 border border-[#581c3c]/15">
                <IconComponent className="w-4 h-4" />
              </div>
            )}
            <div>
              <div className="font-medium text-stone-900 text-xs sm:text-sm">
                {cat.name}
              </div>
              <div className="text-[11px] text-stone-400 font-mono font-normal">
                id: {cat.id}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      render: (cat) => (
        <span className="text-xs text-stone-600 line-clamp-2 max-w-sm font-normal">
          {cat.description}
        </span>
      ),
    },
    {
      key: "badge",
      header: "Spotlight Badge",
      sortable: true,
      render: (cat) =>
        cat.badge ? (
          <span className="text-xs px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200">
            <Sparkle className="w-3 h-3 text-amber-600 fill-amber-500" />
            <span>{cat.badge}</span>
          </span>
        ) : (
          <span className="text-xs text-stone-400 font-normal">Standard</span>
        ),
    },
    // {
    //   key: "servicesCount",
    //   header: "Services",
    //   sortable: true,
    //   sortValue: (cat) => cat.servicesCount,
    //   render: (cat) => (
    //     <Link
    //       href={`/admin/services?category=${cat.id}`}
    //       className="inline-flex items-center gap-1.5 text-xs font-medium text-[#581c3c] hover:underline"
    //     >
    //       <span>{cat.servicesCount} offerings</span>
    //       <ArrowRight className="w-3 h-3" />
    //     </Link>
    //   ),
    // },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (cat) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenEditModal(cat)}
            className="px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
            title="Edit category"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setCategoryToDelete(cat)}
            className="px-2.5 py-1.5 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
            title="Delete category"
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
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium font-serif text-stone-900">
            Service Categories
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
            Organize bridal, salon, and beauty offerings into catalog categories, assign icons, and configure highlight badges.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium rounded-md shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs sm:text-sm font-normal">
            <span>Total Categories</span>
            <Layers className="w-4 h-4 text-[#581c3c]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-medium text-stone-900 font-serif">
            {totalCategoriesCount}
          </div>
          <div className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
            Catalog sections
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs sm:text-sm font-normal">
            <span>Catalog Offerings</span>
            <Sparkles className="w-4 h-4 text-[#581c3c]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-medium text-stone-900 font-serif">
            {totalServicesCount}
          </div>
          <div className="text-xs sm:text-sm text-emerald-700 mt-1 font-normal">
            Active beauty services
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs sm:text-sm font-normal">
            <span>Spotlight & Badged</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-medium text-amber-700 font-serif">
            {badgedCount}
          </div>
          <div className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
            Highlighted for clients
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs sm:text-sm font-normal">
            <span>Top Category</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-base sm:text-lg font-medium text-[#581c3c] font-serif truncate">
            {topCategory ? topCategory.name : "—"}
          </div>
          <div className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
            {topCategory ? `${topCategory.servicesCount} active services` : "No data"}
          </div>
        </div>
      </div>

      {/* Search & Badge Filter Toolbar (Clean, unboxed) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories by name, badge, description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal transition-colors"
          />
        </div>

        {/* Badge Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={badgeFilter}
            onChange={(e) => {
              setBadgeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs sm:text-sm py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-700 focus:outline-none focus:border-[#581c3c] cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="with-badge">Featured Badges Only</option>
            <option value="no-badge">Standard Categories</option>
          </select>
        </div>
      </div>

      {/* Categories Table with Reusable Pagination */}
      <DataTable
        data={filteredCategories}
        columns={columns}
        keyExtractor={(cat) => cat.id}
        emptyTitle="No categories found"
        emptyDescription="Try clearing your search query or changing the badge filter."
        pagination={{
          currentPage,
          pageSize,
          totalItems: filteredCategories.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 8, 12, 24],
        }}
      />

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-md border border-stone-200/80 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:px-6 sm:py-4 border-b border-stone-100 shrink-0">
              <h2 className="text-lg font-medium font-serif text-stone-900">
                {modalMode === "create" ? "Add New Category" : "Edit Category"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {formError && (
                  <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Category Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mehendi & Henna Art"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Highlight Badge (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Specialist, Trending, Save 30%, Popular"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c]"
                  />
                  <p className="text-[11px] text-stone-400 font-normal mt-1">
                    Shown as a gold highlight tag on customer cards.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Category Image
                  </label>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="category-image-file-input"
                  />

                  {formImage ? (
                    <div className="relative rounded-md border border-stone-200 overflow-hidden bg-stone-50 p-2.5 flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formImage}
                          alt="Category preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-stone-900 truncate">
                          {imageFileName || "Category image uploaded"}
                        </p>
                        <p className="text-[11px] text-stone-400 font-normal mt-0.5">
                          Image ready to save with category
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[11px] font-medium text-[#581c3c] hover:underline cursor-pointer"
                          >
                            Change Image
                          </button>
                          <span className="text-stone-300">•</span>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="text-[11px] font-medium text-rose-600 hover:underline cursor-pointer"
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-4 border-2 border-dashed border-stone-200 hover:border-[#581c3c] rounded-md bg-stone-50/50 hover:bg-stone-50 transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer group text-center"
                    >
                      <div className="w-9 h-9 rounded-full bg-stone-100 group-hover:bg-[#581c3c]/10 text-stone-500 group-hover:text-[#581c3c] flex items-center justify-center transition-colors">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-stone-800 group-hover:text-[#581c3c] transition-colors">
                          Click to upload category image
                        </span>
                        <span className="block text-[11px] text-stone-400 font-normal mt-0.5">
                          PNG, JPG, WEBP, or SVG (max. 5MB)
                        </span>
                      </div>
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the services and styling covered under this category..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 p-3 sm:px-6 sm:py-3.5 border-t border-stone-100 bg-stone-50/60 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-stone-200 text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  {modalMode === "create" ? "Create Category" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-stone-200/80 shadow-xl max-w-md w-full p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-medium font-serif text-stone-900">
                  Delete Category &quot;{categoryToDelete.name}&quot;?
                </h3>
                <p className="text-xs text-stone-500 font-normal mt-0.5">
                  This action removes the category from your catalog navigation.
                </p>
              </div>
            </div>

            {services.filter((s) => s.categoryId === categoryToDelete.id).length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs font-normal">
                Notice: There are{" "}
                <span className="font-medium">
                  {
                    services.filter(
                      (s) => s.categoryId === categoryToDelete.id
                    ).length
                  }
                </span>{" "}
                services assigned to this category. Deleting it will keep the services in your catalog, but their category tag may need updating.
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 rounded-md border border-stone-200 text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

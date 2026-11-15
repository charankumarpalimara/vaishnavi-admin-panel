"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Upload, AlertCircle, Sparkles } from "lucide-react";
import { ServiceItem, ServiceCategory } from "@/types";

export interface ServiceModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  service?: ServiceItem | null;
  categories: ServiceCategory[];
  onClose: () => void;
  onSave: (serviceData: Omit<ServiceItem, "id">, id?: string) => void;
}

const DEFAULT_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80";

export function ServiceModal({
  isOpen,
  mode,
  service,
  categories,
  onClose,
  onSave,
}: ServiceModalProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [description, setDescription] = useState("");
  const [inclusionsText, setInclusionsText] = useState("");
  const [tag, setTag] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [image, setImage] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [formError, setFormError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or service changes
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && service) {
      setTitle(service.title || "");
      setCategoryId(service.categoryId || (categories[0]?.id || ""));
      setPrice(service.price ? service.price.toString() : "");
      setOriginalPrice(
        service.originalPrice ? service.originalPrice.toString() : ""
      );
      setDurationMinutes(
        service.durationMinutes ? service.durationMinutes.toString() : "30"
      );
      setDescription(service.description || "");
      setInclusionsText(
        service.inclusions && service.inclusions.length > 0
          ? service.inclusions.join("\n")
          : ""
      );
      setTag(service.tag || "");
      setIsPopular(Boolean(service.isPopular));
      setImage(service.image || DEFAULT_SERVICE_IMAGE);
      setImageFileName(service.image ? "Current image loaded" : "");
      setFormError("");
    } else {
      // Create mode
      setTitle("");
      setCategoryId(categories[0]?.id || "");
      setPrice("");
      setOriginalPrice("");
      setDurationMinutes("30");
      setDescription("");
      setInclusionsText(
        "Professional tools & sanitized equipment\nHygiene disposable kit included\nComplimentary touch-up"
      );
      setTag("");
      setIsPopular(false);
      setImage(DEFAULT_SERVICE_IMAGE);
      setImageFileName("");
      setFormError("");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [isOpen, mode, service, categories]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image size must be less than 5MB");
      return;
    }

    setImageFileName(file.name);
    setFormError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(DEFAULT_SERVICE_IMAGE);
    setImageFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError("Please enter a service title");
      return;
    }

    const parsedPrice = parseInt(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("Please enter a valid positive price in ₹");
      return;
    }

    const parsedDuration = parseInt(durationMinutes);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      setFormError("Please enter a valid duration in minutes");
      return;
    }

    const parsedOriginalPrice = originalPrice.trim()
      ? parseInt(originalPrice)
      : undefined;

    const matchedCategory = categories.find((c) => c.id === categoryId);
    const categoryName = matchedCategory ? matchedCategory.name : "Custom";

    // Split inclusions line by line
    const inclusions = inclusionsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const serviceData: Omit<ServiceItem, "id"> = {
      title: title.trim(),
      categoryId: categoryId || (categories[0]?.id || "bridal"),
      categoryName,
      price: parsedPrice,
      originalPrice:
        parsedOriginalPrice && parsedOriginalPrice > parsedPrice
          ? parsedOriginalPrice
          : undefined,
      durationMinutes: parsedDuration,
      rating: service?.rating || 5.0,
      reviewsCount: service?.reviewsCount || 1,
      description:
        description.trim() ||
        `Professional ${title.trim()} service by Anusha in Bahadurpally.`,
      inclusions:
        inclusions.length > 0
          ? inclusions
          : ["Professional tools & disposable kit", "Complete hygiene check"],
      image: image || DEFAULT_SERVICE_IMAGE,
      tag: tag.trim() || undefined,
      isPopular: isPopular || Boolean(tag.trim()),
    };

    onSave(serviceData, service?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-md border border-stone-200/80 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header (Fixed at top) */}
        <div className="flex items-center justify-between p-4 sm:px-6 sm:py-4 border-b border-stone-100 shrink-0">
          <div>
            <h2 className="text-lg font-medium font-serif text-stone-900">
              {mode === "create" ? "Add New Beauty Service" : "Edit Beauty Service"}
            </h2>
            <p className="text-xs text-stone-500 font-normal mt-0.5">
              {mode === "create"
                ? "Create a new offering for your salon catalog in Bahadurpally."
                : `Update pricing, duration, and details for "${service?.title}".`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Error notification */}
            {formError && (
              <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Service Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Signature HD Muhurtham Bridal Makeup"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c]"
            />
          </div>

          {/* Category & Tag Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Most Popular, Save 20%, Trending"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c]"
              />
            </div>
          </div>

          {/* Price, Original Price, and Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="499"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                min={0}
                placeholder="699"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c]"
              />
              <span className="text-[10px] text-stone-400 font-normal">
                Strike-through tag
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Duration (Mins) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={5}
                step={5}
                placeholder="30"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c]"
              />
            </div>
          </div>

          {/* Image Upload Input */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Service Cover Image
            </label>
            <div className="flex items-center gap-3">
              {/* Preview Thumbnail */}
              <div className="relative w-14 h-14 rounded-md overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                <Image
                  src={image}
                  alt="Service preview"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Upload & controls */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="service-image-upload"
                  />
                  <label
                    htmlFor="service-image-upload"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-200 text-stone-700 bg-stone-50 hover:bg-stone-100 text-xs font-normal cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-stone-500" />
                    <span>Upload Image</span>
                  </label>

                  {imageFileName && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-2 py-1 text-xs text-rose-600 hover:text-rose-800 cursor-pointer font-normal"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-stone-400 font-normal truncate">
                  {imageFileName || "JPG, PNG, or WEBP up to 5MB."}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Detailed description of what the service includes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c]"
            />
          </div>

          {/* Inclusions (One per line) */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Key Inclusions (One item per line)
            </label>
            <textarea
              rows={3}
              placeholder="e.g.&#10;Hygiene disposable kit included&#10;Pre-pleating & pinning included&#10;Waterproof long-lasting finish"
              value={inclusionsText}
              onChange={(e) => setInclusionsText(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c]"
            />
            <p className="text-[11px] text-stone-400 font-normal mt-1">
              Each line is displayed as a checklist item on customer cards.
            </p>
          </div>

          {/* Highlight Popular Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is-popular-service"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="w-4 h-4 text-[#581c3c] rounded border-stone-300 focus:ring-[#581c3c] cursor-pointer"
            />
            <label
              htmlFor="is-popular-service"
              className="text-xs font-normal text-stone-700 cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Mark as featured / popular service on customer homepage</span>
            </label>
          </div>

          </div>

          {/* Action Buttons (Fixed at bottom) */}
          <div className="flex items-center justify-end gap-2 p-3 sm:px-6 sm:py-3.5 border-t border-stone-100 bg-stone-50/60 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-stone-200 text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
            >
              {mode === "create" ? "Publish Service" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Eye, X, CheckCircle2 } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  tag: string;
  image: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Kanchipuram Silk Saree Box Pleats",
    category: "Saree Draping",
    tag: "12-Hr Hold",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    description: "Flawless waist pleats and symmetrical shoulder pallu for heavy bridal pure silk saree. Stayed comfortable throughout 8 hours of wedding ceremony.",
  },
  {
    id: "gal-2",
    title: "HD Muhurtham Bridal Look",
    category: "Bridal Makeup",
    tag: "Waterproof HD",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    description: "Sweat-proof, tear-proof bridal glam with radiant skin finish, paired with traditional temple jewelry and matching lip contouring.",
  },
  {
    id: "gal-3",
    title: "Traditional South Indian Poola Jada",
    category: "Hairstyling",
    tag: "Fresh Flowers",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    description: "Authentic floral braid adorned with gold billalu accessories and fresh white jasmine gajra for a Telugu wedding bride.",
  },
  {
    id: "gal-4",
    title: "Reception Glam & Hollywood Waves",
    category: "Hair & Makeup",
    tag: "Evening Glow",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    description: "Glossy sculpted waves paired with soft rose gold smokey eyes and dewy highlighters for an evening wedding reception.",
  },
  {
    id: "gal-5",
    title: "Haldi Radiant Yellow Glow Makeup",
    category: "Event Makeup",
    tag: "Dewy & Fresh",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    description: "Lightweight, natural skin finish with waterproof mascara and coral blush designed for outdoor daytime Haldi festivities.",
  },
  {
    id: "gal-6",
    title: "Textured Floral Low Bun",
    category: "Hairstyling",
    tag: "Baby's Breath",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80",
    description: "Modern messy textured updo with imported baby's breath flowers and secure invisible padding that lasts all night.",
  },
];

export const GallerySection: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = ["all", "Saree Draping", "Bridal Makeup", "Hairstyling"];

  const filteredItems = GALLERY_ITEMS.filter((item) =>
    filterCategory === "all" ? true : item.category.includes(filterCategory)
  );

  return (
    <section className="py-16 bg-white border-t border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-[#581c3c] bg-rose-100/60 px-3 py-1 rounded-full border border-rose-200/50">
              Work & Transformations
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-normal text-stone-900 font-serif">
              Our Bridal & Styling Portfolio
            </h2>
            <p className="mt-2 text-sm text-stone-600 max-w-xl font-normal">
              Take a closer look at the intricate saree pleats, radiant bridal makeup, and traditional poola jada styles crafted by Anusha for our clients in Hyderabad.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer shrink-0 ${
                  filterCategory === cat
                    ? "bg-[#581c3c] text-white shadow-xs"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                {cat === "all" ? "All Work" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-[#581c3c]/90 text-white text-[10px] font-medium tracking-wider px-2.5 py-0.8 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    {item.tag}
                  </span>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="p-2 rounded-full bg-white/80 text-stone-900 backdrop-blur-xs flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Bottom caption */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-medium text-amber-300 uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h3 className="text-base font-normal font-serif leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Zoomed View */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-xs">
            <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200">
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                aria-label="Close photo"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-16/10 w-full bg-stone-100">
                <Image
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#581c3c]">
                    {activePhoto.category}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {activePhoto.tag}
                  </span>
                </div>
                <h3 className="text-xl font-normal font-serif text-stone-900">
                  {activePhoto.title}
                </h3>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed font-normal">
                  {activePhoto.description}
                </p>
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-normal">
                    Styled by certified artist <span className="font-medium text-stone-800">Anusha</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePhoto(null)}
                    className="px-4 py-2 bg-[#581c3c] text-white text-xs font-medium rounded-xl cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

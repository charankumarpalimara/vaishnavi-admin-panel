"use client";

import React, { useState } from "react";
import { Star, CheckCircle, ChevronDown, Quote } from "lucide-react";
import { REVIEWS, FAQS } from "@/data/servicesData";

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-medium uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Customer Feedback
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-normal text-stone-900 font-serif">
            Loved by Brides & Families Across Hyderabad
          </h2>
          <p className="mt-2 text-sm text-stone-600 font-normal">
            Read verified reviews from clients who enjoyed our home salon and bridal services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#fdfbf9] border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-400 font-normal">{review.date}</span>
                </div>

                <Quote className="w-5 h-5 text-[#581c3c]/20 mb-2" />
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic font-normal">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between">
                <div>
                  <div className="font-medium text-xs sm:text-sm text-stone-900 flex items-center gap-1">
                    {review.name}
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-stone-500 font-normal">{review.location}</div>
                </div>
                <span className="text-[10px] font-medium text-[#581c3c] bg-rose-50 px-2 py-0.5 rounded-md">
                  {review.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-[#faf6f0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-medium uppercase tracking-wider text-[#581c3c] bg-rose-100/60 px-3 py-1 rounded-full border border-rose-200/50">
            Got Questions?
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-normal text-stone-900 font-serif">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-stone-600 font-normal">
            Everything you need to know about our home salon & bridal bookings.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left font-medium text-stone-900 text-xs sm:text-sm flex items-center justify-between gap-4 cursor-pointer hover:text-[#581c3c]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#581c3c]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 mt-1 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

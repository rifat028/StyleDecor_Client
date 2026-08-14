import React from "react";
import { useNavigate } from "react-router";
import { Star, ArrowRight, CheckCircle2, Tag, Sparkles } from "lucide-react";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const title = service.title || service.serviceName || "Signature Decor Package";
  const catName = typeof service.category === "string" ? service.category : (service.category?.name || service.serviceCategory || "Decoration");
  const price = service.pricing?.discountedPrice || service.pricing?.basePrice || service.cost || 20000;
  const originalPrice = service.pricing?.basePrice && service.pricing?.discountedPrice && service.pricing.basePrice > service.pricing.discountedPrice ? service.pricing.basePrice : null;
  const unit = service.pricing?.unit ? service.pricing.unit.replace("_", " ") : (service.unit || "per event");
  const vendorName = service.decorator?.businessName || service.vendor || "StyleDecor Verified Partner";
  const rating = service.metrics?.rating || service.rating || 4.9;
  const reviewsCount = service.metrics?.reviewCount || service.totalReviews || 24;
  const coverImage = service.coverImage || service.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?w=600";
  const desc = service.shortDescription || service.description || "Bespoke decoration setup crafted with high-grade florals, custom backdrops, and atmospheric illumination.";

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 cursor-pointer">
      {/* Cover Image & Category Badge */}
      <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-purple-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-md flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {catName}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 text-amber-500 text-xs font-black px-2.5 py-1 rounded-full backdrop-blur-md shadow-md flex items-center gap-1 border border-amber-200 dark:border-amber-900/50">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {Number(rating).toFixed(1)}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
            {title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Vendor & Rating summary */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 truncate max-w-[170px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            {vendorName}
          </span>

          <span className="text-[11px] text-slate-400">
            {reviewsCount} reviews
          </span>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Starts At ({unit})
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                ৳{Number(price).toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ৳{Number(originalPrice).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate(`/services/${service._id}`)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

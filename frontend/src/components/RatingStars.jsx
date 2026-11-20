import { Star } from "lucide-react";

export default function RatingStars({ value = 0, onChange, readOnly = false, size = 20 }) {
  const rating = Number(value) || 0;

  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            className={`rounded p-0.5 ${readOnly ? "cursor-default" : "hover:scale-110"}`}
            aria-label={`Rate ${star}`}
          >
            <Star
              size={size}
              className={active ? "fill-amber-400 text-amber-400" : "text-slate-300"}
            />
          </button>
        );
      })}
    </div>
  );
}

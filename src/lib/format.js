// Format numeric currency amounts in Bangladeshi Taka (৳).
export const formatCurrency = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-US")}`;

// Format date into standard human-readable format.
export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });


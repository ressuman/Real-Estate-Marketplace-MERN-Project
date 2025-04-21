export const buildSearchParams = (params, options = {}) => {
  const urlParams = new URLSearchParams();

  if (params.searchTerm) urlParams.set("searchTerm", params.searchTerm);
  if (params.propertyType && params.propertyType !== "all")
    urlParams.set("propertyType", params.propertyType);
  if (params.transactionType && params.transactionType !== "all")
    urlParams.set("transactionType", params.transactionType);
  if (params.parking) urlParams.set("parking", "true");
  if (params.furnished) urlParams.set("furnished", "true");
  if (params.offer) urlParams.set("offer", "true");

  urlParams.set("sort", params.sort || "createdAt");
  urlParams.set("order", params.order || "desc");

  // Add optional pagination params
  if (options.startIndex) urlParams.set("startIndex", options.startIndex);
  if (options.limit) urlParams.set("limit", options.limit);

  return urlParams.toString();
};

export const getUnitText = (transactionType) => {
  switch (transactionType) {
    case "rent":
      return "($ / month)";
    case "lease":
      return "($ / 6 months)";
    case "short-term":
      return "($ / week)";
    case "long-term":
      return "($ / year)";
    case "sale":
      return "($)";
    default:
      return "($)";
  }
};

export function titleCase(input) {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

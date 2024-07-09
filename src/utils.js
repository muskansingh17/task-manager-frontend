export const capitalize = (s) => {
  const parts = s.split("_");
  return parts
    .map((part) => {
      return part[0].toUpperCase() + part.substring(1);
    })
    .join(" ");
};

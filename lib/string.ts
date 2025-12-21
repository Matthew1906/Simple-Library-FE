import { format } from "date-fns";

export const capitalizeString = (str: string, sep = " ") => {
  return str
    .split(sep)
    .map(
      (val) =>
        val.substring(0, 1).toUpperCase() + val.substring(1).toLowerCase()
    )
    .join(" ");
};

export const dateString = (date?: Date|string|null) => {
  return date ?  format(new Date(date), "PPP") : "None";
};

export function isUUID(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}
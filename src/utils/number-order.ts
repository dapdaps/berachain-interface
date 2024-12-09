export default function numberOrder(order: number) {
  if (order % 10 === 1) return order + "st";
  if (order % 10 === 2) return order + "nd";
  if (order % 10 === 3) return order + "rd";
  return order + "th";
}

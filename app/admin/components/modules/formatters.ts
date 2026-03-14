export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("pt-BR");
}

export function calculateConversionRate(totalLeads: number, totalConversions: number) {
  if (!totalLeads) return 0;
  return (totalConversions / totalLeads) * 100;
}

export function exportCSV(
  csvTitles: string[],
  csvData: unknown[][],
  fileName: string
) {
  const joinedTitles = csvTitles.join(",");
  const joinedData = csvData.map((row) => row.join(","));

  const content = [joinedTitles, ...joinedData].join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { JobEstimate } from "../types";
import { calculateTotals } from "../store/useCalculatorStore";
import { formatCurrency } from "./utils";

// Normalizira tekst kako bi se izbjegli problemi s hrvatskim znakovima u zadanom jsPDF fontu
const normalize = (text: string) => {
  if (!text) return "";
  return text
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/ž/g, "z")
    .replace(/š/g, "s")
    .replace(/đ/g, "d")
    .replace(/Č/g, "C")
    .replace(/Ć/g, "C")
    .replace(/Ž/g, "Z")
    .replace(/Š/g, "S")
    .replace(/Đ/g, "D");
};

export function generateEstimatePDF(estimate: JobEstimate) {
  const totals = calculateTotals(estimate);
  const doc = new jsPDF();

  const primaryColor: [number, number, number] = [234, 179, 8]; // Yellow-500
  const textColor: [number, number, number] = [30, 30, 30];
  const grayColor: [number, number, number] = [100, 100, 100];

  // Header Background
  doc.setFillColor(25, 25, 25);
  doc.rect(0, 0, 210, 40, "F");

  // Logo / Title
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("AJMO", 14, 25);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Fizicki poslovi i usluge", 45, 25);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.text("PONUDA / PROCJENA", 196, 25, { align: "right" });

  // Document Info Section
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  let currentY = 50;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PODACI O KLIJENTU", 14, currentY);
  doc.text("DETALJI POSLA", 110, currentY);

  doc.setFont("helvetica", "normal");
  currentY += 6;
  doc.text(normalize(estimate.clientName || "Nije navedeno"), 14, currentY);
  doc.text(`Lokacija: ${normalize(estimate.location.address || "Nije navedeno")}`, 110, currentY);

  currentY += 5;
  doc.text(normalize(estimate.clientPhone || ""), 14, currentY);
  doc.text(`Datum: ${normalize(estimate.date || "Nije naveden")}`, 110, currentY);

  currentY += 5;
  doc.text(`Broj ponude: ${estimate.id}`, 110, currentY);

  currentY += 15;

  // Table Data Preparation
  const tableData: any[][] = [];

  totals.calculatedPhases.forEach((phase, index) => {
    tableData.push([
      normalize(`${index + 1}. ${phase.serviceName}`),
      `${phase.estimatedHours} h`,
      formatCurrency(phase.totalPhasePrice),
    ]);

    // Sub-items
    phase.breakdown.forEach((b) => {
      tableData.push([
        normalize(`   - ${b.name} ${b.detail ? `(${b.detail})` : ""}`),
        "",
        formatCurrency(b.amount),
      ]);
    });
  });

  // Extra costs
  if (totals.travelTotal > 0) {
    tableData.push([
      normalize(`Putni trosak (${estimate.location.distanceKm || 0} km)`),
      "",
      formatCurrency(totals.travelTotal),
    ]);
  }

  estimate.additionalExpenses.forEach((exp) => {
    tableData.push([
      normalize(`Dodatno: ${exp.name}`),
      "",
      formatCurrency(exp.amount),
    ]);
  });

  if (totals.discountAmount > 0) {
    tableData.push([
      "Popust",
      "",
      `-${formatCurrency(totals.discountAmount)}`,
    ]);
  }

  // Generate Table
  autoTable(doc, {
    startY: currentY,
    head: [["Opis usluge", "Procjena sati", "Iznos"]],
    body: tableData,
    theme: "plain",
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 40, halign: "right" },
    },
    didParseCell: function (data) {
      if (data.section === "body" && typeof data.row.raw[0] === 'string') {
        const text = data.row.raw[0];
        if (text.startsWith("   -")) {
          data.cell.styles.textColor = [120, 120, 120];
          data.cell.styles.fontStyle = "italic";
        } else if (/^\d+\./.test(text) || text === "Popust" || text.startsWith("Putni trosak")) {
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Totals Box
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(230, 230, 230);
  doc.roundedRect(120, currentY, 76, 25, 3, 3, "FD");

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Ukupno:", 125, currentY + 10);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(totals.total), 190, currentY + 10, {
    align: "right",
  });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`Procjena radnika: ${totals.maxWorkers}`, 125, currentY + 18);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Ova ponuda je informativnog karaktera i izracunata na temelju unesenih procjena.",
    105,
    280,
    { align: "center" }
  );
  doc.text("Zahvaljujemo na povjerenju!", 105, 285, { align: "center" });

  // Save the PDF
  doc.save(`Ponuda_${estimate.clientName ? normalize(estimate.clientName).replace(/\s+/g, "_") : estimate.id}.pdf`);
}

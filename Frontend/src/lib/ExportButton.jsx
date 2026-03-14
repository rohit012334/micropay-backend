// src/components/ExportButton.jsx
// Drop-in export component — CSV, Excel, PDF
// Install: npm install xlsx jspdf jspdf-autotable

import { useState, useRef, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, File, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * ExportButton
 * @param {Array}  data       - Array of objects to export
 * @param {string} filename   - Base filename (without extension)
 * @param {Array}  columns    - [{ header: "Name", key: "name" }, ...]
 * @param {string} title      - Title shown in PDF header
 */
export default function ExportButton({ data = [], filename = "export", columns = [], title = "Report" }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null); // 'csv' | 'excel' | 'pdf'
  const dropdownRef = useRef();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getRows = () =>
    data.map((item) => {
      const row = {};
      columns.forEach(({ key, header }) => {
        row[header] = item[key] ?? "";
      });
      return row;
    });

  const triggerDownload = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Export Handlers ───────────────────────────────────────────────────────────

  const exportCSV = async () => {
    setLoading("csv");
    await new Promise((r) => setTimeout(r, 300)); // small delay for UX
    try {
      const rows = getRows();
      const headers = columns.map((c) => c.header);
      const csvRows = [
        headers.join(","),
        ...rows.map((row) =>
          headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(",")
        ),
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      triggerDownload(blob, `${filename}.csv`);
    } finally {
      setLoading(null);
      setOpen(false);
    }
  };

  const exportExcel = async () => {
    setLoading("excel");
    await new Promise((r) => setTimeout(r, 300));
    try {
      const rows = getRows();
      const ws = XLSX.utils.json_to_sheet(rows);

      // Column widths
      ws["!cols"] = columns.map(() => ({ wch: 20 }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } finally {
      setLoading(null);
      setOpen(false);
    }
  };

  const exportPDF = async () => {
    setLoading("pdf");
    await new Promise((r) => setTimeout(r, 300));
    try {
      const doc = new jsPDF({ orientation: "landscape" });

      // Title
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text(title, 14, 18);

      // Date
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 25);

      autoTable(doc, {
        startY: 30,
        head: [columns.map((c) => c.header)],
        body: data.map((item) => columns.map(({ key }) => item[key] ?? "")),
        headStyles: {
          fillColor: [109, 40, 217], // violet-700
          textColor: 255,
          fontStyle: "bold",
          fontSize: 9,
        },
        bodyStyles: { fontSize: 9, textColor: 40 },
        alternateRowStyles: { fillColor: [248, 248, 255] },
        margin: { left: 14, right: 14 },
      });

      doc.save(`${filename}.pdf`);
    } finally {
      setLoading(null);
      setOpen(false);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────────

  const options = [
    {
      id: "csv",
      label: "Export CSV",
      sub: "Comma separated values",
      icon: FileText,
      color: "text-emerald-400",
      handler: exportCSV,
    },
    {
      id: "excel",
      label: "Export Excel",
      sub: "Microsoft Excel (.xlsx)",
      icon: FileSpreadsheet,
      color: "text-blue-400",
      handler: exportExcel,
    },
    {
      id: "pdf",
      label: "Export PDF",
      sub: "Portable document format",
      icon: File,
      color: "text-red-400",
      handler: exportPDF,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border text-sm font-medium text-foreground hover:bg-secondary/80 hover:border-primary/40 transition-all"
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin text-primary" />
        ) : (
          <Download size={15} className="text-primary" />
        )}
        Export
        <span className="text-muted-foreground text-xs">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-56 glass-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 pt-3 pb-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Download as
            </p>
          </div>

          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={opt.handler}
              disabled={loading !== null}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/60 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className={`p-1.5 rounded-lg bg-secondary ${opt.color}`}>
                {loading === opt.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <opt.icon size={14} />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {opt.label}
                </p>
                <p className="text-[11px] text-muted-foreground">{opt.sub}</p>
              </div>
            </button>
          ))}

          <div className="px-3 pb-3 pt-1">
            <p className="text-[10px] text-muted-foreground">
              {data.length} records will be exported
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

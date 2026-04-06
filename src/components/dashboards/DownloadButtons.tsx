import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DownloadSection {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

interface DownloadData {
  title: string;
  campus: string;
  sections: DownloadSection[];
}

function generateCSV(data: DownloadData): string {
  let csv = `${data.title}\nCampus: ${data.campus}\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
  data.sections.forEach(section => {
    csv += `${section.title}\n`;
    csv += section.headers.join(',') + '\n';
    section.rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    csv += '\n';
  });
  return csv;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateHTMLReport(data: DownloadData): string {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${data.title}</title>
<style>
body{font-family:Arial,sans-serif;margin:40px;color:#333}
h1{color:#04aebe;border-bottom:3px solid #04aebe;padding-bottom:10px}
h2{color:#0d131c;margin-top:30px;border-bottom:1px solid #ddd;padding-bottom:5px}
.meta{color:#666;margin-bottom:20px;font-size:14px}
table{width:100%;border-collapse:collapse;margin:15px 0;font-size:13px}
th{background:#04aebe;color:white;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}
td{padding:8px 12px;border-bottom:1px solid #e5e7eb}
tr:nth-child(even){background:#f9fafb}
tr:hover{background:#f0f8fa}
.total-row{font-weight:bold;border-top:3px solid #04aebe;background:#f0f8fa!important}
.positive{color:#059669}
.negative{color:#dc2626}
@media print{body{margin:20px}h1{font-size:20px}}
</style></head><body>
<h1>${data.title}</h1>
<div class="meta">Campus: <strong>${data.campus}</strong> | Generated: ${new Date().toLocaleDateString()} | Period: Current Academic Year</div>
${data.sections.map(s => `
<h2>${s.title}</h2>
<table><thead><tr>${s.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
<tbody>${s.rows.map(r => `<tr>${r.map(c => {
  const val = String(c);
  const cls = val.startsWith('+') ? 'positive' : val.startsWith('-') ? 'negative' : '';
  return `<td class="${cls}">${c}</td>`;
}).join('')}</tr>`).join('')}</tbody></table>`).join('')}
<div style="margin-top:40px;padding-top:15px;border-top:1px solid #ddd;color:#999;font-size:11px">
This report was generated from the Pak Turk Maarif Schools Reporting Hub. For queries, contact the Finance Department.
</div></body></html>`;
  return html;
}

export function DownloadButtons({ data }: { data: DownloadData }) {
  const { toast } = useToast();
  const safeName = data.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

  const handleCSV = () => {
    const csv = generateCSV(data);
    downloadFile(csv, `${safeName}_${data.campus}.csv`, 'text/csv');
    toast({ title: 'Downloaded', description: `${data.title} exported as CSV` });
  };

  const handleHTML = () => {
    const html = generateHTMLReport(data);
    downloadFile(html, `${safeName}_${data.campus}.html`, 'text/html');
    toast({ title: 'Downloaded', description: `${data.title} exported as printable report (open in browser and print to PDF)` });
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleCSV} className="gap-1.5 text-xs">
        <FileSpreadsheet size={14} />
        CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleHTML} className="gap-1.5 text-xs">
        <Download size={14} />
        Report
      </Button>
    </div>
  );
}

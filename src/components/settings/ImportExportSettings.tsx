import { useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Dashboard } from '@/data/dashboards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, Upload, Link2, RotateCcw, CheckCircle, AlertCircle, Loader2, Info, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ImportExportSettings() {
  const { dashboards, configSourceUrl, setConfigSourceUrl, setBaseDashboards, resetDashboards, importDashboards } = useApp();
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importJson, setImportJson] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleTestConfig = async () => {
    if (!configSourceUrl) return;
    setTestStatus('loading');
    try {
      const res = await fetch(configSourceUrl);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBaseDashboards(data);
        setTestStatus('success');
        toast({ title: 'Config loaded', description: `Loaded ${data.length} dashboards from remote source.` });
      } else {
        throw new Error('Invalid format');
      }
    } catch {
      setTestStatus('error');
      toast({ title: 'Config failed', description: 'Could not load dashboards from the provided URL.', variant: 'destructive' });
    }
  };

  const handleExport = () => {
    const json = JSON.stringify(dashboards, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboards.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: 'Dashboards JSON downloaded.' });
  };

  const handleImportJson = () => {
    try {
      const data = JSON.parse(importJson);
      if (!Array.isArray(data)) throw new Error('Expected array');
      importDashboards(data as Dashboard[]);
      setImportJson('');
      toast({ title: 'Imported', description: `${data.length} dashboards imported successfully.` });
    } catch {
      toast({ title: 'Import failed', description: 'Invalid JSON format. Expected an array of dashboard objects.', variant: 'destructive' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!Array.isArray(data)) throw new Error('Expected array');
        importDashboards(data as Dashboard[]);
        toast({ title: 'Imported', description: `${data.length} dashboards imported from file.` });
      } catch {
        toast({ title: 'Import failed', description: 'Invalid JSON file format.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    resetDashboards();
    toast({ title: 'Reset', description: 'Dashboards restored to defaults.' });
  };

  return (
    <div className="space-y-6">
      {/* Permanent settings tip */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex gap-3">
        <Info size={18} className="text-primary mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Make settings permanent (no database needed)</p>
          <p className="text-sm text-muted-foreground">
            Settings are saved in your browser. If they ever reset, you can permanently bake your defaults
            into the source code by editing these files:
          </p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1 font-mono">
            <li className="flex items-center gap-2"><Code2 size={11} /> <span className="text-primary">src/config/appDefaults.ts</span> — org name, logo, dark mode</li>
            <li className="flex items-center gap-2"><Code2 size={11} /> <span className="text-primary">src/data/coverConfig.ts</span> — cover page content & KPIs</li>
            <li className="flex items-center gap-2"><Code2 size={11} /> <span className="text-primary">src/data/dashboards.ts</span> — dashboard list & embed URLs</li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Config Source</h2>
          <p className="text-sm text-muted-foreground mt-1">Optionally load dashboards from a remote JSON endpoint</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="config-url">Config Source URL</Label>
          <div className="flex gap-2 max-w-xl">
            <Input id="config-url" value={configSourceUrl} onChange={(e) => setConfigSourceUrl(e.target.value)} placeholder="https://example.com/dashboards.json" className="flex-1" />
            <Button variant="outline" size="sm" onClick={handleTestConfig} disabled={!configSourceUrl || testStatus === 'loading'}>
              {testStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
              Test
            </Button>
          </div>
          {testStatus === 'success' && <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle size={12} /> Config loaded successfully</p>}
          {testStatus === 'error' && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={12} /> Failed to load config</p>}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Export Dashboards</h2>
          <p className="text-sm text-muted-foreground mt-1">Download current dashboard configuration as JSON</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download size={14} />
          Export JSON ({dashboards.length} dashboards)
        </Button>
      </div>

      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Import Dashboards</h2>
          <p className="text-sm text-muted-foreground mt-1">Import dashboards from JSON (replaces local overrides)</p>
        </div>
        <div className="space-y-2">
          <Label>Paste JSON</Label>
          <Textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder='[{"id": "...", "title": "...", ...}]' rows={4} className="font-mono text-xs" />
          <Button variant="outline" size="sm" onClick={handleImportJson} disabled={!importJson.trim()}>
            <Upload size={14} />
            Import from JSON
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Or upload file</Label>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload size={14} />
            Upload JSON File
          </Button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
        </div>
      </div>

      <div className="rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Reset to Defaults</h2>
          <p className="text-sm text-muted-foreground mt-1">Clear all local overrides and restore bundled default dashboards</p>
        </div>
        <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5" onClick={handleReset}>
          <RotateCcw size={14} />
          Reset Dashboards
        </Button>
      </div>
    </div>
  );
}

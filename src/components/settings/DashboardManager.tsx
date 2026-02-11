import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Dashboard, CATEGORIES } from '@/data/dashboards';
import { DynamicIcon } from '@/components/DynamicIcon';
import { IconPicker } from '@/components/IconPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Search, Clock, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const EMPTY_DASHBOARD: Dashboard = {
  id: '', title: '', description: '', category: 'Executive',
  tags: [], status: 'Preview', featured: false, iconName: '', embedUrl: '',
};

export function DashboardManager() {
  const { dashboards, addDashboard, updateDashboard, deleteDashboard, clearRecentlyOpened } = useApp();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Dashboard>(EMPTY_DASHBOARD);
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    if (!search) return dashboards;
    const q = search.toLowerCase();
    return dashboards.filter(d =>
      d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
    );
  }, [dashboards, search]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_DASHBOARD);
    setTagsInput('');
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (d: Dashboard) => {
    setEditingId(d.id);
    setForm({ ...d });
    setTagsInput(d.tags.join(', '));
    setErrors({});
    setDialogOpen(true);
  };

  const openDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.embedUrl.trim()) errs.embedUrl = 'Embed URL is required';
    if (!editingId) {
      const id = form.id || slugify(form.title);
      if (dashboards.some(d => d.id === id)) errs.id = 'A dashboard with this ID already exists';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const id = form.id || slugify(form.title);
    const dashboard: Dashboard = { ...form, id, tags };
    if (editingId) {
      updateDashboard(editingId, dashboard);
    } else {
      addDashboard(dashboard);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteDashboard(deletingId);
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Manage Dashboards</h2>
          <p className="text-sm text-muted-foreground mt-1">{dashboards.length} dashboards configured</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearRecentlyOpened}>
            <Clock size={14} />
            Clear Recent
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus size={14} />
            Add Dashboard
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search dashboards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <div className="space-y-2">
        {filtered.map(d => (
          <div
            key={d.id}
            className="flex items-center justify-between p-3 sm:p-4 rounded-xl border bg-background hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
                <DynamicIcon name={d.iconName || 'LayoutDashboard'} size={16} />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{d.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{d.category}</span>
                  <span className={cn(
                    'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium',
                    d.status === 'Live Data'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  )}>
                    {d.status}
                  </span>
                  {d.featured && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Featured</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(d)}>
                <Pencil size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => openDelete(d.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No dashboards found</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Dashboard' : 'Add Dashboard'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="d-title">Title *</Label>
                <Input id="d-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Dashboard title" />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="d-id">ID (auto-generated)</Label>
                <Input id="d-id" value={form.id || (form.title ? slugify(form.title) : '')} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="auto-generated-from-title" disabled={!!editingId} />
                {errors.id && <p className="text-xs text-destructive">{errors.id}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="d-desc">Description</Label>
              <Textarea id="d-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" rows={2} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Dashboard['status'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Live Data">Live Data</SelectItem>
                    <SelectItem value="Preview">Preview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="d-tags">Tags (comma-separated)</Label>
              <Input id="d-tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. budget, forecast, monthly" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="d-embed">Embed URL *</Label>
              <Input id="d-embed" value={form.embedUrl} onChange={(e) => setForm({ ...form, embedUrl: e.target.value })} placeholder="https://..." />
              {errors.embedUrl && <p className="text-xs text-destructive">{errors.embedUrl}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="d-featured" checked={form.featured} onCheckedChange={(checked) => setForm({ ...form, featured: !!checked })} />
              <Label htmlFor="d-featured" className="cursor-pointer">Featured on home page</Label>
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <IconPicker value={form.iconName} onChange={(name) => setForm({ ...form, iconName: name })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Save Changes' : 'Add Dashboard'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dashboard</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

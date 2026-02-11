import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { CoverKPI, CoverInfoCard, CoverQuickLink } from '@/data/coverConfig';
import { DynamicIcon } from '@/components/DynamicIcon';
import { IconPicker } from '@/components/IconPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, Pencil, Trash2, RotateCcw, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CoverPageSettings() {
  const { coverConfig, setCoverConfig, resetCoverConfig } = useApp();
  const { toast } = useToast();

  // KPI editing
  const [kpiDialogOpen, setKpiDialogOpen] = useState(false);
  const [editingKpiIndex, setEditingKpiIndex] = useState<number | null>(null);
  const [kpiForm, setKpiForm] = useState<CoverKPI>({ id: '', label: '', value: '', icon: '' });

  // Info card editing
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [cardForm, setCardForm] = useState<CoverInfoCard>({ id: '', title: '', icon: '', items: [] });
  const [cardItemsInput, setCardItemsInput] = useState('');

  // Quick link editing
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [linkForm, setLinkForm] = useState<CoverQuickLink>({ id: '', label: '', route: '' });

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; index: number } | null>(null);

  // Hero text
  const updateHero = (field: string, value: string) => {
    setCoverConfig({ ...coverConfig, [field]: value });
  };

  // KPI handlers
  const openAddKpi = () => {
    setEditingKpiIndex(null);
    setKpiForm({ id: `kpi-${Date.now()}`, label: '', value: '', icon: 'BarChart' });
    setKpiDialogOpen(true);
  };
  const openEditKpi = (index: number) => {
    setEditingKpiIndex(index);
    setKpiForm({ ...coverConfig.kpis[index] });
    setKpiDialogOpen(true);
  };
  const saveKpi = () => {
    if (!kpiForm.label || !kpiForm.value) return;
    const kpis = [...coverConfig.kpis];
    if (editingKpiIndex !== null) {
      kpis[editingKpiIndex] = kpiForm;
    } else {
      kpis.push(kpiForm);
    }
    setCoverConfig({ ...coverConfig, kpis });
    setKpiDialogOpen(false);
  };

  // Card handlers
  const openAddCard = () => {
    setEditingCardIndex(null);
    setCardForm({ id: `card-${Date.now()}`, title: '', icon: 'Building2', items: [] });
    setCardItemsInput('');
    setCardDialogOpen(true);
  };
  const openEditCard = (index: number) => {
    setEditingCardIndex(index);
    setCardForm({ ...coverConfig.infoCards[index] });
    setCardItemsInput(coverConfig.infoCards[index].items.join('\n'));
    setCardDialogOpen(true);
  };
  const saveCard = () => {
    if (!cardForm.title) return;
    const items = cardItemsInput.split('\n').map(s => s.trim()).filter(Boolean);
    const card = { ...cardForm, items };
    const infoCards = [...coverConfig.infoCards];
    if (editingCardIndex !== null) {
      infoCards[editingCardIndex] = card;
    } else {
      infoCards.push(card);
    }
    setCoverConfig({ ...coverConfig, infoCards });
    setCardDialogOpen(false);
  };

  // Link handlers
  const openAddLink = () => {
    setEditingLinkIndex(null);
    setLinkForm({ id: `ql-${Date.now()}`, label: '', route: '' });
    setLinkDialogOpen(true);
  };
  const openEditLink = (index: number) => {
    setEditingLinkIndex(index);
    setLinkForm({ ...coverConfig.quickLinks[index] });
    setLinkDialogOpen(true);
  };
  const saveLink = () => {
    if (!linkForm.label || !linkForm.route) return;
    const quickLinks = [...coverConfig.quickLinks];
    if (editingLinkIndex !== null) {
      quickLinks[editingLinkIndex] = linkForm;
    } else {
      quickLinks.push(linkForm);
    }
    setCoverConfig({ ...coverConfig, quickLinks });
    setLinkDialogOpen(false);
  };

  // Delete handler
  const confirmDelete = () => {
    if (!deleteTarget) return;
    const { type, index } = deleteTarget;
    if (type === 'kpi') {
      setCoverConfig({ ...coverConfig, kpis: coverConfig.kpis.filter((_, i) => i !== index) });
    } else if (type === 'card') {
      setCoverConfig({ ...coverConfig, infoCards: coverConfig.infoCards.filter((_, i) => i !== index) });
    } else if (type === 'link') {
      setCoverConfig({ ...coverConfig, quickLinks: coverConfig.quickLinks.filter((_, i) => i !== index) });
    }
    setDeleteTarget(null);
  };

  // Export / Import
  const handleExport = () => {
    const json = JSON.stringify(coverConfig, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-config.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: 'Cover page config downloaded.' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        setCoverConfig(data);
        toast({ title: 'Imported', description: 'Cover page config loaded.' });
      } catch {
        toast({ title: 'Failed', description: 'Invalid JSON file.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Hero Text */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Hero Section</h2>
          <p className="text-sm text-muted-foreground mt-1">Edit the main headline, subtitle, and portal preview title</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input value={coverConfig.headline} onChange={(e) => updateHero('headline', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Highlighted Text</Label>
            <Input value={coverConfig.headlineHighlight} onChange={(e) => updateHero('headlineHighlight', e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Textarea value={coverConfig.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Portal Preview Title</Label>
          <Input value={coverConfig.portalPreviewTitle} onChange={(e) => updateHero('portalPreviewTitle', e.target.value)} />
        </div>
      </div>

      {/* KPIs */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">KPI Tiles</h2>
            <p className="text-sm text-muted-foreground mt-1">{coverConfig.kpis.length} KPIs shown on the cover page</p>
          </div>
          <Button size="sm" onClick={openAddKpi}><Plus size={14} /> Add KPI</Button>
        </div>
        <div className="space-y-2">
          {coverConfig.kpis.map((kpi, i) => (
            <div key={kpi.id} className="flex items-center justify-between p-3 rounded-xl border bg-background">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  <DynamicIcon name={kpi.icon} size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{kpi.label}</p>
                  <p className="text-xs text-muted-foreground">{kpi.value}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditKpi(i)}><Pencil size={14} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget({ type: 'kpi', index: i })}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Info Cards</h2>
            <p className="text-sm text-muted-foreground mt-1">Campus listings and contact information</p>
          </div>
          <Button size="sm" onClick={openAddCard}><Plus size={14} /> Add Card</Button>
        </div>
        <div className="space-y-2">
          {coverConfig.infoCards.map((card, i) => (
            <div key={card.id} className="flex items-center justify-between p-3 rounded-xl border bg-background">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  <DynamicIcon name={card.icon} size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{card.title}</p>
                  <p className="text-xs text-muted-foreground">{card.items.length} items</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditCard(i)}><Pencil size={14} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget({ type: 'card', index: i })}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Quick Links</h2>
            <p className="text-sm text-muted-foreground mt-1">Action buttons shown in the hero section</p>
          </div>
          <Button size="sm" onClick={openAddLink}><Plus size={14} /> Add Link</Button>
        </div>
        <div className="space-y-2">
          {coverConfig.quickLinks.map((link, i) => (
            <div key={link.id} className="flex items-center justify-between p-3 rounded-xl border bg-background">
              <div>
                <p className="text-sm font-medium text-foreground">{link.label}</p>
                <p className="text-xs text-muted-foreground font-mono">{link.route}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditLink(i)}><Pencil size={14} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget({ type: 'link', index: i })}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export / Import / Reset */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Export / Import Cover Config</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}><Download size={14} /> Export JSON</Button>
          <label>
            <Button variant="outline" size="sm" asChild><span><Upload size={14} /> Import JSON</span></Button>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <Button variant="outline" size="sm" className="text-destructive border-destructive/30" onClick={() => { resetCoverConfig(); toast({ title: 'Reset', description: 'Cover page restored to defaults.' }); }}>
            <RotateCcw size={14} /> Reset to Default
          </Button>
        </div>
      </div>

      {/* KPI Dialog */}
      <Dialog open={kpiDialogOpen} onOpenChange={setKpiDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingKpiIndex !== null ? 'Edit KPI' : 'Add KPI'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Label</Label><Input value={kpiForm.label} onChange={(e) => setKpiForm({ ...kpiForm, label: e.target.value })} placeholder="e.g. Total Students" /></div>
              <div className="space-y-2"><Label>Value</Label><Input value={kpiForm.value} onChange={(e) => setKpiForm({ ...kpiForm, value: e.target.value })} placeholder="e.g. 28,450" /></div>
            </div>
            <div className="space-y-2"><Label>Icon</Label><IconPicker value={kpiForm.icon} onChange={(name) => setKpiForm({ ...kpiForm, icon: name })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKpiDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveKpi}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card Dialog */}
      <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingCardIndex !== null ? 'Edit Info Card' : 'Add Info Card'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Title</Label><Input value={cardForm.title} onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })} placeholder="e.g. Punjab Campuses" /></div>
            <div className="space-y-2"><Label>Items (one per line)</Label><Textarea value={cardItemsInput} onChange={(e) => setCardItemsInput(e.target.value)} rows={5} placeholder={"Lahore Campus — 0300-1234567\nIslamabad Campus — 0300-2345678"} /></div>
            <div className="space-y-2"><Label>Icon</Label><IconPicker value={cardForm.icon} onChange={(name) => setCardForm({ ...cardForm, icon: name })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCardDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveCard}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingLinkIndex !== null ? 'Edit Quick Link' : 'Add Quick Link'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Label</Label><Input value={linkForm.label} onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })} placeholder="e.g. Student Enrollment" /></div>
            <div className="space-y-2"><Label>Route</Label><Input value={linkForm.route} onChange={(e) => setLinkForm({ ...linkForm, route: e.target.value })} placeholder="/dashboard/executive-overview" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveLink}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete item</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to remove this item?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

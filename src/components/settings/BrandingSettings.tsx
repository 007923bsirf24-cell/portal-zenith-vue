import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Upload, RotateCcw, Trash2 } from 'lucide-react';
import { useRef } from 'react';

export function BrandingSettings() {
  const { orgName, setOrgName, logoUrl, setLogoUrl, resetBranding } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-card-foreground">Branding</h2>
        <p className="text-sm text-muted-foreground mt-1">Customize your organization name and logo</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="org-name">Organization Name</Label>
          <Input
            id="org-name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Your organization name"
            className="max-w-sm"
          />
          <p className="text-xs text-muted-foreground">Displayed in the navbar and cover page hero</p>
        </div>

        <div className="space-y-2">
          <Label>Logo</Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl border-2 border-dashed bg-muted/50">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full rounded-xl object-cover" />
              ) : (
                <LayoutDashboard size={24} className="text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload size={14} />
                  Upload Logo
                </Button>
                {logoUrl && (
                  <Button variant="outline" size="sm" onClick={() => setLogoUrl('')}>
                    <Trash2 size={14} />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">PNG, JPG, or SVG. Max 2MB. Stored locally.</p>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button variant="outline" size="sm" onClick={resetBranding}>
          <RotateCcw size={14} />
          Reset Branding to Default
        </Button>
      </div>
    </div>
  );
}

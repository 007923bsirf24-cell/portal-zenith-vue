import { useApp } from '@/contexts/AppContext';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { THEME_PRESETS, hslToHex, hexToHSL, ThemeConfig } from '@/lib/theme';
import { cn } from '@/lib/utils';

const COLOR_FIELDS: { key: keyof ThemeConfig; label: string; description: string }[] = [
  { key: 'primary', label: 'Primary Color', description: 'Main brand color for buttons, links, and accents' },
  { key: 'accent', label: 'Accent Color', description: 'Secondary accent color for highlights' },
  { key: 'background', label: 'Background Color', description: 'Page background color' },
  { key: 'surface', label: 'Surface / Card Color', description: 'Card and surface background color' },
];

export function ThemeSettings() {
  const { theme, setTheme, resetTheme } = useApp();

  const handleColorChange = (key: keyof ThemeConfig, hex: string) => {
    const hsl = hexToHSL(hex);
    setTheme({ ...theme, [key]: hsl });
  };

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-card-foreground">Theme & Colors</h2>
        <p className="text-sm text-muted-foreground mt-1">Customize the color palette for your portal</p>
      </div>

      <div className="space-y-3">
        <Label>Preset Palettes</Label>
        <div className="flex flex-wrap gap-3">
          {Object.entries(THEME_PRESETS).map(([name, preset]) => (
            <button
              key={name}
              onClick={() => setTheme(preset)}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all hover:shadow-sm',
                JSON.stringify(theme) === JSON.stringify(preset)
                  ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border hover:border-primary/20'
              )}
            >
              <div className="flex gap-1">
                <div
                  className="w-4 h-4 rounded-full border border-border/50"
                  style={{ backgroundColor: hslToHex(preset.primary) }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-border/50"
                  style={{ backgroundColor: hslToHex(preset.accent) }}
                />
              </div>
              <span className="text-sm font-medium">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {COLOR_FIELDS.map(({ key, label, description }) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hslToHex(theme[key])}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="w-10 h-10 rounded-lg border cursor-pointer bg-transparent"
              />
              <div>
                <p className="text-sm font-mono text-foreground">{hslToHex(theme[key])}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Label>Live Preview</Label>
        <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: hslToHex(theme.surface) }}>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: hslToHex(theme.primary), color: '#fff' }}>
              Active Tab
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: hslToHex(theme.background) }}>
              Inactive Tab
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: hslToHex(theme.primary), color: '#fff' }}>
              Primary Button
            </div>
            <div className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ color: hslToHex(theme.primary), borderColor: hslToHex(theme.primary) }}>
              Outline Button
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: hslToHex(theme.primary) + '20', color: hslToHex(theme.primary) }}>
              Badge
            </div>
            <div className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: hslToHex(theme.accent) + '20', color: hslToHex(theme.accent) }}>
              Accent Badge
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button variant="outline" size="sm" onClick={resetTheme}>
          <RotateCcw size={14} />
          Reset Theme to Default
        </Button>
      </div>
    </div>
  );
}

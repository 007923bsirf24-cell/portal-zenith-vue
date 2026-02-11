import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Image, LayoutDashboard, Download } from 'lucide-react';
import { BrandingSettings } from '@/components/settings/BrandingSettings';
import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { DashboardManager } from '@/components/settings/DashboardManager';
import { ImportExportSettings } from '@/components/settings/ImportExportSettings';

const Settings = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize branding, theme, and manage dashboards</p>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="bg-muted rounded-xl p-1 h-auto flex-wrap">
          <TabsTrigger value="branding" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Image size={15} />
            Branding
          </TabsTrigger>
          <TabsTrigger value="theme" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Palette size={15} />
            Theme
          </TabsTrigger>
          <TabsTrigger value="dashboards" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutDashboard size={15} />
            Dashboards
          </TabsTrigger>
          <TabsTrigger value="import-export" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Download size={15} />
            Import / Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding"><BrandingSettings /></TabsContent>
        <TabsContent value="theme"><ThemeSettings /></TabsContent>
        <TabsContent value="dashboards"><DashboardManager /></TabsContent>
        <TabsContent value="import-export"><ImportExportSettings /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

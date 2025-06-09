import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Accessibility, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Focus,
  Type,
  Pause,
  RotateCcw,
  Palette,
  MousePointer,
  Volume2
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  focusVisible: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  cursorSize: number;
  underlineLinks: boolean;
  stopAnimations: boolean;
  readingGuide: boolean;
}

const AccessibilityButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    highContrast: false,
    focusVisible: false,
    dyslexiaFont: false,
    reducedMotion: false,
    cursorSize: 1,
    underlineLinks: false,
    stopAnimations: false,
    readingGuide: false,
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  // Save settings to localStorage and apply them
  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(updatedSettings));
    applySettings(updatedSettings);
  };

  const applySettings = (settingsToApply: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Apply font size
    root.style.setProperty('--accessibility-font-scale', (settingsToApply.fontSize / 100).toString());
    document.body.style.fontSize = `${settingsToApply.fontSize}%`;
    
    // Apply high contrast
    if (settingsToApply.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Apply focus visibility
    if (settingsToApply.focusVisible) {
      document.body.classList.add('enhanced-focus');
    } else {
      document.body.classList.remove('enhanced-focus');
    }
    
    // Apply dyslexia font
    if (settingsToApply.dyslexiaFont) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
    
    // Apply reduced motion
    if (settingsToApply.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    
    // Apply cursor size
    root.style.setProperty('--cursor-scale', settingsToApply.cursorSize.toString());
    
    // Apply underlined links
    if (settingsToApply.underlineLinks) {
      document.body.classList.add('underline-links');
    } else {
      document.body.classList.remove('underline-links');
    }
    
    // Apply stop animations (stricter than reduced motion)
    if (settingsToApply.stopAnimations) {
      document.body.classList.add('stop-animations');
    } else {
      document.body.classList.remove('stop-animations');
    }
    
    // Apply reading guide
    if (settingsToApply.readingGuide) {
      document.body.classList.add('reading-guide');
    } else {
      document.body.classList.remove('reading-guide');
    }
  };

  const increaseFontSize = () => {
    if (settings.fontSize < 150) {
      updateSettings({ fontSize: settings.fontSize + 10 });
    }
  };

  const decreaseFontSize = () => {
    if (settings.fontSize > 80) {
      updateSettings({ fontSize: settings.fontSize - 10 });
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 100,
      highContrast: false,
      focusVisible: false,
      dyslexiaFont: false,
      reducedMotion: false,
      cursorSize: 1,
      underlineLinks: false,
      stopAnimations: false,
      readingGuide: false,
    };
    updateSettings(defaultSettings);
  };

  const getActiveCount = () => {
    let count = 0;
    if (settings.fontSize !== 100) count++;
    if (settings.highContrast) count++;
    if (settings.focusVisible) count++;
    if (settings.dyslexiaFont) count++;
    if (settings.reducedMotion) count++;
    if (settings.cursorSize !== 1) count++;
    if (settings.underlineLinks) count++;
    if (settings.stopAnimations) count++;
    if (settings.readingGuide) count++;
    return count;
  };

  return (
    <div className="fixed bottom-16 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative bg-white hover:bg-white shadow-lg hover:shadow-xl transition-shadow rounded-full w-12 h-12 border-2 border-blue-200"
            aria-label="פתח תפריט נגישות"
            title="אפשרויות נגישות"
            data-accessibility-button="true"
          >
            <Accessibility className="h-5 w-5" />
            {getActiveCount() > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {getActiveCount()}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-80 max-h-96 overflow-y-auto"
          align="start"
          side="top"
        >
          <DropdownMenuLabel className="text-center font-semibold">
            אפשרויות נגישות
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Font Size Controls */}
          <div className="px-2 py-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">גודל טקסט</span>
              <span className="text-xs text-muted-foreground">{settings.fontSize}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseFontSize}
                disabled={settings.fontSize <= 80}
                className="flex-1"
              >
                <ZoomOut className="h-4 w-4 ml-1" />
                הקטן
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={increaseFontSize}
                disabled={settings.fontSize >= 150}
                className="flex-1"
              >
                <ZoomIn className="h-4 w-4 ml-1" />
                הגדל
              </Button>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Toggle Options */}
          <DropdownMenuCheckboxItem
            checked={settings.highContrast}
            onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            ניגודיות גבוהה
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuCheckboxItem
            checked={settings.focusVisible}
            onCheckedChange={(checked) => updateSettings({ focusVisible: checked })}
            className="flex items-center gap-2"
          >
            <Focus className="h-4 w-4" />
            הדגשת פוקוס משופרת
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuCheckboxItem
            checked={settings.dyslexiaFont}
            onCheckedChange={(checked) => updateSettings({ dyslexiaFont: checked })}
            className="flex items-center gap-2"
          >
            <Type className="h-4 w-4" />
            פונט נוח לדיסלקציה
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuCheckboxItem
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
            className="flex items-center gap-2"
          >
            <Pause className="h-4 w-4" />
            הפחתת אנימציות
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuCheckboxItem
            checked={settings.stopAnimations}
            onCheckedChange={(checked) => updateSettings({ stopAnimations: checked })}
            className="flex items-center gap-2"
          >
            <Volume2 className="h-4 w-4" />
            עצירת כל האנימציות
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuCheckboxItem
            checked={settings.underlineLinks}
            onCheckedChange={(checked) => updateSettings({ underlineLinks: checked })}
            className="flex items-center gap-2"
          >
            <MousePointer className="h-4 w-4" />
            קו תחתי לכל הקישורים
          </DropdownMenuCheckboxItem>
          
          {/* Cursor Size Control */}
          <div className="px-2 py-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">גודל סמן עכבר</span>
              <span className="text-xs text-muted-foreground">{settings.cursorSize}x</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSettings({ cursorSize: Math.max(1, settings.cursorSize - 0.5) })}
                disabled={settings.cursorSize <= 1}
                className="flex-1"
              >
                <ZoomOut className="h-4 w-4 ml-1" />
                הקטן
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSettings({ cursorSize: Math.min(3, settings.cursorSize + 0.5) })}
                disabled={settings.cursorSize >= 3}
                className="flex-1"
              >
                <ZoomIn className="h-4 w-4 ml-1" />
                הגדל
              </Button>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Reset Button */}
          <DropdownMenuItem 
            onClick={resetSettings}
            className="flex items-center gap-2 text-destructive focus:text-destructive"
          >
            <RotateCcw className="h-4 w-4" />
            איפוס הגדרות
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <div className="px-2 py-1 text-xs text-muted-foreground text-center">
            לחץ Esc לסגירה
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AccessibilityButton; 
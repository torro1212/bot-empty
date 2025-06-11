import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Download, 
  Trash2, 
  RefreshCw, 
  Calendar,
  MousePointer,
  TrendingUp,
  Users,
  Settings,
  Cloud,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  getAllClicks, 
  getClickStatistics, 
  clearClickData, 
  exportClickData,
  setGoogleSheetsUrl,
  getGoogleSheetsUrl,
  testGoogleSheetsConnection,
  syncAllDataToGoogleSheets,
  ClickData 
} from '@/utils/analytics';

interface ClickAnalyticsDashboardProps {
  onClose?: () => void;
}

const ClickAnalyticsDashboard = ({ onClose }: ClickAnalyticsDashboardProps) => {
  const [stats, setStats] = useState<any>(null);
  const [clicks, setClicks] = useState<ClickData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGoogleSheetsSettings, setShowGoogleSheetsSettings] = useState(false);
  const [googleSheetsUrl, setGoogleSheetsUrlState] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'error'>('unknown');

  const loadData = () => {
    setIsLoading(true);
    try {
      const clickData = getAllClicks();
      const statistics = getClickStatistics();
      setClicks(clickData);
      setStats(statistics);
      
      // טעינת הגדרות Google Sheets
      const savedUrl = getGoogleSheetsUrl();
      setGoogleSheetsUrlState(savedUrl);
    } catch (error) {
      console.error('שגיאה בטעינת נתוני אנליטיקס:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearData = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל נתוני המעקב?')) {
      clearClickData();
      loadData();
    }
  };

  const handleExportData = () => {
    exportClickData();
  };

  const handleSaveGoogleSheetsUrl = () => {
    setGoogleSheetsUrl(googleSheetsUrl);
    setConnectionStatus('unknown');
    alert('Google Sheets URL נשמר בהצלחה!');
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const success = await testGoogleSheetsConnection();
      setConnectionStatus(success ? 'success' : 'error');
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSyncToGoogleSheets = async () => {
    setIsSyncing(true);
    try {
      const result = await syncAllDataToGoogleSheets();
      alert(`סנכרון הושלם!\nסה"כ: ${result.total}\nהצליח: ${result.success}\nנכשל: ${result.errors}`);
    } catch (error) {
      alert(`שגיאה בסנכרון: ${error}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getButtonDisplayName = (buttonId: string) => {
    const buttonNames: Record<string, string> = {
      'kupa': 'בעיות קופה',
      'ashrai': 'בעיות אשראי',
      'holetz': 'בעיות חולץ'
    };
    return buttonNames[buttonId] || buttonId;
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin ml-2" />
            <span>טוען נתוני אנליטיקס...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" dir="rtl">
      {/* כותרת וכפתורי פעולה */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                דשבורד אנליטיקס לחיצות
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                מעקב אחר לחיצות על כפתורי הבעיות בדף הראשי
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowGoogleSheetsSettings(!showGoogleSheetsSettings)}
              >
                <Settings className="h-4 w-4 ml-1" />
                Google Sheets
              </Button>
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="h-4 w-4 ml-1" />
                רענן
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="h-4 w-4 ml-1" />
                ייצא נתונים
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClearData}>
                <Trash2 className="h-4 w-4 ml-1" />
                נקה נתונים
              </Button>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  סגור
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* הגדרות Google Sheets */}
      {showGoogleSheetsSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              הגדרות Google Sheets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Google Apps Script Web App URL
              </label>
              <input
                type="url"
                value={googleSheetsUrl}
                onChange={(e) => setGoogleSheetsUrlState(e.target.value)}
                placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                העתק את ה-URL של ה-Web App מ-Google Apps Script
              </p>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSaveGoogleSheetsUrl}
                disabled={!googleSheetsUrl.trim()}
              >
                שמור URL
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTestConnection}
                disabled={!googleSheetsUrl.trim() || isTestingConnection}
              >
                {isTestingConnection ? (
                  <RefreshCw className="h-4 w-4 animate-spin ml-1" />
                ) : (
                  <CheckCircle className="h-4 w-4 ml-1" />
                )}
                בדוק חיבור
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSyncToGoogleSheets}
                disabled={!googleSheetsUrl.trim() || isSyncing || clicks.length === 0}
              >
                {isSyncing ? (
                  <RefreshCw className="h-4 w-4 animate-spin ml-1" />
                ) : (
                  <Cloud className="h-4 w-4 ml-1" />
                )}
                סנכרן כל הנתונים
              </Button>
            </div>
            
            {connectionStatus !== 'unknown' && (
              <div className={`flex items-center gap-2 p-2 rounded-md ${
                connectionStatus === 'success' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {connectionStatus === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {connectionStatus === 'success' 
                    ? 'החיבור ל-Google Sheets פעיל!' 
                    : 'שגיאה בחיבור ל-Google Sheets'}
                </span>
              </div>
            )}
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800 font-medium mb-1">
                💡 איך להגדיר Google Sheets:
              </p>
              <ol className="text-xs text-blue-700 space-y-1 mr-4">
                <li>1. צור גיליון Google Sheets חדש</li>
                <li>2. פתח script.google.com וצור פרויקט חדש</li>
                <li>3. העתק את הקוד מהקובץ google-sheets-script.js</li>
                <li>4. שמור ופרסם כ-Web App</li>
                <li>5. העתק את ה-URL והדבק כאן</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* סטטיסטיקות כלליות */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">סה"כ לחיצות</p>
                <p className="text-2xl font-bold">{stats?.totalClicks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">סשנים ייחודיים</p>
                <p className="text-2xl font-bold">
                  {stats ? new Set(clicks.map(c => c.sessionId)).size : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">ימים פעילים</p>
                <p className="text-2xl font-bold">
                  {stats ? Object.keys(stats.clicksByDay).length : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">לחיצה אחרונה</p>
                <p className="text-sm font-medium">
                  {stats?.lastClick ? formatDate(stats.lastClick.timestamp) : 'אין נתונים'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* לחיצות לפי כפתור */}
      <Card>
        <CardHeader>
          <CardTitle>לחיצות לפי כפתור</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats && Object.entries(stats.clicksByButton).map(([buttonId, count]) => (
              <div key={buttonId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{getButtonDisplayName(buttonId)}</Badge>
                  <span className="text-sm text-gray-600">ID: {buttonId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{count as number}</span>
                  <span className="text-sm text-gray-500">לחיצות</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* לחיצות לפי יום */}
      <Card>
        <CardHeader>
          <CardTitle>לחיצות לפי יום</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats && Object.entries(stats.clicksByDay)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 10)
              .map(([date, count]) => (
              <div key={date} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">{new Date(date).toLocaleDateString('he-IL')}</span>
                <Badge variant="secondary">{count as number} לחיצות</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* לחיצות אחרונות */}
      <Card>
        <CardHeader>
          <CardTitle>לחיצות אחרונות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {clicks.slice(-20).reverse().map((click, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge>{getButtonDisplayName(click.buttonId)}</Badge>
                  <span className="text-sm text-gray-600">
                    {formatDate(click.timestamp)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Session: {click.sessionId.slice(-8)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClickAnalyticsDashboard; 
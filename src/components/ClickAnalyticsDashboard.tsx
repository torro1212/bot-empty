import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Upload,
  Clock
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
  ClickData,
  getAllTimings,
  getTimingStatistics,
  formatDuration,
  clearTimingData,
  exportTimingData,
  syncAllTimingDataToGoogleSheets,
  type SessionTiming
} from '@/utils/analytics';

interface ClickAnalyticsDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

// פונקציה להצגת זמן בשניות במקום במילישניות
const formatTimeInSeconds = (milliseconds: number | undefined): string => {
  if (!milliseconds) return 'לא ידוע';
  
  // המרה למספר שניות מעוגל
  const seconds = Math.round(milliseconds / 1000);
  
  if (seconds < 60) {
    return `${seconds} שניות`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} דקות ${remainingSeconds > 0 ? `ו-${remainingSeconds} שניות` : ''}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} שעות ${minutes > 0 ? `ו-${minutes} דקות` : ''}`;
  }
};

const ClickAnalyticsDashboard: React.FC<ClickAnalyticsDashboardProps> = ({ isVisible, onClose }) => {
  const [clicks, setClicks] = useState<ClickData[]>([]);
  const [timings, setTimings] = useState<SessionTiming[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [timingStats, setTimingStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showGoogleSheetsSettings, setShowGoogleSheetsSettings] = useState(false);
  const [googleSheetsUrl, setGoogleSheetsUrlState] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'error'>('unknown');

  useEffect(() => {
    if (isVisible) {
      loadData();
    }
  }, [isVisible]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log('📊 טוען נתוני אנליטיקס...');
      
      // טעינת נתוני לחיצות
      const clicksData = getAllClicks();
      const clickStats = getClickStatistics();
      
      // טעינת נתוני זמן
      const timingsData = getAllTimings();
      const timingStatsData = getTimingStatistics();
      
      setClicks(clicksData);
      setStats(clickStats);
      setTimings(timingsData);
      setTimingStats(timingStatsData);
      
      console.log('✅ נתונים נטענו:', {
        clicks: clicksData.length,
        timings: timingsData.length,
        stats: clickStats,
        timingStats: timingStatsData
      });
      
      // טעינת הגדרות Google Sheets
      const savedUrl = getGoogleSheetsUrl();
      setGoogleSheetsUrlState(savedUrl);
    } catch (error) {
      console.error('❌ שגיאה בטעינת נתונים:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים?')) {
      clearClickData();
      clearTimingData();
      loadData();
    }
  };

  const handleExportData = () => {
    exportClickData();
    exportTimingData();
  };

  const handleSaveGoogleSheetsUrl = () => {
    setGoogleSheetsUrl(googleSheetsUrl);
    setConnectionStatus('unknown');
    alert('Google Sheets URL נשמר בהצלחה!');
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const url = getGoogleSheetsUrl();
      if (!url) {
        alert('❌ Google Sheets URL לא מוגדר!\nלחץ על "הגדרות Google Sheets" והגדר את ה-URL');
        setConnectionStatus('error');
        return;
      }
      
      console.log('🧪 בודק חיבור ל:', url);
      const success = await testGoogleSheetsConnection();
      setConnectionStatus(success ? 'success' : 'error');
      
      alert(success 
        ? '✅ החיבור ל-Google Sheets עובד!' 
        : '❌ שגיאה בחיבור ל-Google Sheets.\nבדוק את ה-URL ואת הרשאות הסקריפט'
      );
    } catch (error) {
      console.error('שגיאה בבדיקת חיבור:', error);
      alert(`❌ שגיאה בבדיקת חיבור:\n${error}`);
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

  const handleSyncTimingToGoogleSheets = async () => {
    setIsSyncing(true);
    try {
      const result = await syncAllTimingDataToGoogleSheets();
      alert(`סנכרון נתוני זמן הושלם!\n${result.message}`);
    } catch (error) {
      alert(`שגיאה בסנכרון נתוני זמן: ${error}`);
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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">דשבורד אנליטיקס</h2>
          <Button variant="outline" onClick={onClose}>
            סגור
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Real-time Status Alert */}
          <Card className={`border-2 ${googleSheetsUrl ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
        <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {googleSheetsUrl ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                סטטוס שליחת נתונים בזמן אמת
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">שמירה מקומית בדפדפן: <strong>פעיל</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  {googleSheetsUrl ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className="text-sm">
                    שליחה ל-Google Sheets: <strong>{googleSheetsUrl ? 'פעיל' : 'לא מוגדר'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">מעקב זמן משתמש: <strong>פעיל</strong></span>
                </div>
                
                {googleSheetsUrl ? (
                  <div className="mt-3 p-3 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      ✅ הנתונים נשלחים בזמן אמת ל-Google Sheets!
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      כל לחיצה ומדידת זמן נשלחת מיד לגיליון האלקטרוני שלך
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ הנתונים נשמרים רק מקומית בדפדפן
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      להפעלת שליחה בזמן אמת, הגדר Google Sheets URL בהגדרות למטה
              </p>
            </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* כפתורי פעולה */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="h-4 w-4 ml-2" />
              רענן נתונים
            </Button>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 ml-2" />
              ייצא נתונים
            </Button>
            <Button variant="outline" onClick={handleClearData}>
              <Trash2 className="h-4 w-4 ml-2" />
              נקה נתונים
            </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowGoogleSheetsSettings(!showGoogleSheetsSettings)}
              >
              <Settings className="h-4 w-4 ml-2" />
              הגדרות Google Sheets
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                const timings = getAllTimings();
                const clicks = getAllClicks();
                alert(`נתונים מקומיים:\n• לחיצות: ${clicks.length}\n• זמנים: ${timings.length}\n\nפתח את הקונסול (F12) לפרטים נוספים`);
                console.table(timings);
                console.table(clicks);
              }}
            >
              🔍 בדוק נתונים מקומיים
              </Button>
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isTestingConnection}
            >
              <Upload className="h-4 w-4 ml-2" />
              בדוק חיבור לגיליונות
              </Button>
            <Button 
              variant="outline" 
              onClick={handleSyncToGoogleSheets}
              disabled={isSyncing}
            >
              <Upload className="h-4 w-4 ml-2" />
              סנכרן לחיצות לגיליונות
              </Button>
            <Button 
              variant="outline" 
              onClick={handleSyncTimingToGoogleSheets}
              disabled={isSyncing}
            >
              <Clock className="h-4 w-4 ml-2" />
              סנכרן זמנים לגיליונות
              </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                const { sendTimingToGoogleSheets } = require('@/utils/analytics');
                const testData = {
                  type: 'timing',
                  sessionId: 'test-' + Date.now(),
                  startTime: Date.now() - 60000,
                  endTime: Date.now(),
                  duration: 60000,
                  formattedDuration: '1ד',
                  actionType: 'בדיקה',
                  buttonId: 'test-button',
                  completed: true,
                  userAgent: navigator.userAgent,
                  url: window.location.href
                };
                
                console.log('🧪 שולח נתוני בדיקה:', testData);
                
                fetch(getGoogleSheetsUrl(), {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(testData),
                  mode: 'no-cors'
                }).then(() => {
                  alert('✅ נתוני בדיקה נשלחו!\nבדוק ב-Google Drive קובץ בשם:\n"BOTEX Analytics Dashboard"');
                }).catch(error => {
                  alert(`❌ שגיאה בשליחה: ${error}`);
                });
              }}
            >
              🧪 שלח נתוני בדיקה
                </Button>
          </div>

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
                    Google Apps Script URL:
              </label>
              <input
                type="url"
                value={googleSheetsUrl}
                onChange={(e) => setGoogleSheetsUrlState(e.target.value)}
                placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">איך להגדיר Google Sheets:</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>פתח Google Sheets וצור גיליון חדש</li>
                    <li>לך ל-Extensions → Apps Script</li>
                    <li>מחק את הקוד הקיים והדבק את הקוד מהמדריך</li>
                    <li>שמור ולחץ על Deploy → New deployment</li>
                    <li>בחר "Web app" ו-"Anyone" ב-Who has access</li>
                    <li>העתק את ה-URL והדבק כאן</li>
                  </ol>
            </div>
            
                <div className="flex gap-2">
                  <Button onClick={handleSaveGoogleSheetsUrl}>
                שמור URL
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                    disabled={isTestingConnection || !googleSheetsUrl.trim()}
              >
                {isTestingConnection ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin ml-2" />
                        בודק...
                      </>
                    ) : (
                      'בדוק חיבור'
                    )}
              </Button>
            </div>
            
            {connectionStatus !== 'unknown' && (
                  <div className={`p-3 rounded-lg ${
                connectionStatus === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
              }`}>
                  {connectionStatus === 'success' 
                      ? '✅ החיבור ל-Google Sheets עובד!' 
                      : '❌ שגיאה בחיבור - בדוק את ה-URL והרשאות'
                    }
                  </div>
                )}
              </CardContent>
            </Card>
            )}
            
          {/* סטטוס חיבור */}
          {connectionStatus !== 'unknown' && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Badge variant={connectionStatus === 'success' ? 'default' : 'destructive'}>
                    {connectionStatus === 'success' ? '✅ מחובר לגיליונות' : '❌ שגיאה בחיבור'}
                  </Badge>
            </div>
          </CardContent>
        </Card>
      )}

          {/* סטטיסטיקות כלליות - לחיצות */}
          <div>
            <h3 className="text-xl font-bold mb-4">📱 סטטיסטיקות לחיצות</h3>
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
                    <MousePointer className="h-5 w-5 text-orange-500" />
              <div>
                      <p className="text-sm text-gray-600">ממוצע ליום</p>
                      <p className="text-2xl font-bold">
                        {stats && Object.keys(stats.clicksByDay).length > 0 
                          ? Math.round(stats.totalClicks / Object.keys(stats.clicksByDay).length)
                          : 0
                        }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
            </div>
          </div>

          {/* סטטיסטיקות זמן */}
          <div>
            <h3 className="text-xl font-bold mb-4">⏱️ סטטיסטיקות זמן</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">סה"כ סשנים</p>
                      <p className="text-2xl font-bold">{timingStats?.totalSessions || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">זמן ממוצע</p>
                      <p className="text-lg font-bold">
                        {timingStats?.averageDuration ? formatTimeInSeconds(timingStats.averageDuration) : '0 שניות'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">זמן מינימלי</p>
                      <p className="text-lg font-bold">
                        {timingStats?.minDuration ? formatTimeInSeconds(timingStats.minDuration) : '0 שניות'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">זמן מקסימלי</p>
                      <p className="text-lg font-bold">
                        {timingStats?.maxDuration ? formatTimeInSeconds(timingStats.maxDuration) : '0 שניות'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
      </div>

          {/* פילוח לחיצות לפי כפתור */}
          {stats && Object.keys(stats.clicksByButton).length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle>לחיצות לפי כפתור</CardTitle>
        </CardHeader>
        <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.clicksByButton)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .map(([buttonId, count]) => (
                      <div key={buttonId} className="flex justify-between items-center">
                        <span>{getButtonDisplayName(buttonId)}</span>
                        <Badge>{count as number} לחיצות</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
          )}

          {/* זמנים אחרונים */}
          {timings.length > 0 && (
      <Card>
        <CardHeader>
                <CardTitle>מדידות זמן אחרונות (20 האחרונות)</CardTitle>
        </CardHeader>
        <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {timings
                    .filter(t => t.completed && t.duration)
                    .slice(-20)
                    .reverse()
                    .map((timing, index) => (
                      <div key={timing.sessionId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">
                            {timing.buttonId ? getButtonDisplayName(timing.buttonId) : 'לא צוין'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(timing.startTime)}
                          </p>
                        </div>
                        <div className="text-left">
                          <Badge variant="outline">
                            {timing.duration ? formatTimeInSeconds(timing.duration) : 'לא ידוע'}
                          </Badge>
                        </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
          )}

      {/* לחיצות אחרונות */}
          {clicks.length > 0 && (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>לחיצות אחרונות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right px-2 py-2">כפתור</th>
                  <th className="text-right px-2 py-2">זמן</th>
                  <th className="text-right px-2 py-2">זמן פתרון</th>
                  <th className="text-right px-2 py-2">הושלם</th>
                </tr>
              </thead>
              <tbody>
                {clicks.slice(-20).reverse().map((click, index) => {
                  // חיפוש נתוני זמן התואמים לסשן של הלחיצה
                  const relatedTiming = timings.find(t => t.sessionId === click.sessionId && t.completed);
                  
                  // חישוב זמן פתרון אם קיים
                  const resolutionTime = relatedTiming?.duration 
                    ? formatTimeInSeconds(relatedTiming.duration)
                    : 'לא ידוע';
                  
                  const isCompleted = relatedTiming?.completed ? 'כן' : 'לא';
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-2 py-2">
                        <Badge>{getButtonDisplayName(click.buttonId)}</Badge>
                      </td>
                      <td className="px-2 py-2 text-gray-600 whitespace-nowrap">
                        {formatDate(click.timestamp)}
                      </td>
                      <td className="px-2 py-2 text-gray-600">
                        {resolutionTime}
                      </td>
                      <td className="px-2 py-2">
                        {relatedTiming?.completed !== undefined ? (
                          <Badge variant={relatedTiming.completed ? "default" : "destructive"}>
                            {isCompleted}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
          )}

          {/* מדידות זמן אחרונות */}
          {timings.length > 0 && (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>מדידות זמן אחרונות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right px-2 py-2">כפתור</th>
                  <th className="text-right px-2 py-2">זמן פתרון</th>
                  <th className="text-right px-2 py-2">הושלם</th>
                  <th className="text-right px-2 py-2">זמן התחלה</th>
                </tr>
              </thead>
              <tbody>
                {timings.filter(t => t.completed && t.duration).slice(-20).reverse().map((timing, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <Badge>{timing.buttonId ? getButtonDisplayName(timing.buttonId) : 'לא ידוע'}</Badge>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <span className="font-medium">{timing.duration ? formatTimeInSeconds(timing.duration) : '-'}</span>
                    </td>
                    <td className="px-2 py-2">
                      <Badge variant={timing.completed ? "default" : "destructive"}>
                        {timing.completed ? 'כן' : 'לא'}
                      </Badge>
                    </td>
                    <td className="px-2 py-2 text-gray-600">
                      {formatDate(timing.startTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
          )}

          {/* הודעה אם אין נתונים */}
          {clicks.length === 0 && timings.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">אין נתונים זמינים</p>
                <p className="text-sm text-gray-400 mt-2">
                  נתונים יופיעו כאן לאחר שמשתמשים יתחילו להשתמש במערכת
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClickAnalyticsDashboard; 
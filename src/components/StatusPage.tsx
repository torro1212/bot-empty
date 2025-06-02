import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, Wifi, Server, Database } from 'lucide-react';

const StatusPage = () => {
  const systemStatus = [
    {
      name: 'מערכות קופה (POS)',
      status: 'operational',
      uptime: 99.9,
      description: 'כל מערכות הקופה פועלות תקין',
      icon: Server,
      lastIncident: null
    },
    {
      name: 'מדפסות ותוויות',
      status: 'operational',
      uptime: 99.7,
      description: 'שירותי הדפסה זמינים',
      icon: Activity,
      lastIncident: null
    },
    {
      name: 'חיבור רשת',
      status: 'degraded',
      uptime: 97.2,
      description: 'חיבור איטי בחלק מהסניפים',
      icon: Wifi,
      lastIncident: '2 שעות'
    },
    {
      name: 'מסד נתונים',
      status: 'operational',
      uptime: 99.8,
      description: 'כל בסיסי הנתונים זמינים',
      icon: Database,
      lastIncident: null
    }
  ];

  const incidents = [
    {
      id: '1',
      title: 'חיבור איטי לאינטרנט בסניף תל אביב',
      status: 'investigating',
      severity: 'medium',
      startTime: '14:30',
      description: 'אנחנו מודעים לבעיות חיבור לאינטרנט בסניף תל אביב ועובדים על פתרון.',
      updates: [
        { time: '15:45', message: 'הצוות הטכני בדרך לסניף' },
        { time: '14:30', message: 'זוהתה בעיה בחיבור לאינטרנט' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'down': return XCircle;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'פעיל';
      case 'degraded': return 'ביצועים מופחתים';
      case 'down': return 'לא פעיל';
      default: return 'לא ידוע';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'identified': return 'bg-orange-100 text-orange-800';
      case 'monitoring': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentStatusText = (status: string) => {
    switch (status) {
      case 'investigating': return 'בחקירה';
      case 'identified': return 'זוהה';
      case 'monitoring': return 'במעקב';
      case 'resolved': return 'נפתר';
      default: return 'לא ידוע';
    }
  };

  const overallStatus = systemStatus.every(system => system.status === 'operational') 
    ? 'operational' 
    : systemStatus.some(system => system.status === 'down') 
    ? 'down' 
    : 'degraded';

  const OverallStatusIcon = getStatusIcon(overallStatus);

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8">
      {/* Overall Status */}
      <Card className="text-center">
        <CardHeader className="p-3 sm:p-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${getStatusColor(overallStatus)}`}>
              <OverallStatusIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl">
            מצב כללי של המערכות: <span className={getStatusColor(overallStatus).split(' ')[0]}>{getStatusText(overallStatus)}</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {overallStatus === 'operational' 
              ? 'כל המערכות פועלות תקין' 
              : overallStatus === 'degraded'
              ? 'חלק מהמערכות חווים בעיות'
              : 'יש תקלות במערכות קריטיות'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* System Status */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-6">סטטוס מערכות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          {systemStatus.map((system, index) => {
            const StatusIcon = getStatusIcon(system.status);
            const SystemIcon = system.icon;
            
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <SystemIcon className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
                      <CardTitle className="text-base sm:text-lg">{system.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <StatusIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${getStatusColor(system.status).split(' ')[0]}`} />
                      <Badge className={`${getStatusColor(system.status)} text-xs sm:text-sm px-1 sm:px-2 py-0 sm:py-0.5`}>
                        {getStatusText(system.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{system.description}</p>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>זמינות (30 יום)</span>
                      <span className="font-medium">{system.uptime}%</span>
                    </div>
                    <Progress value={system.uptime} className="h-1.5 sm:h-2" />
                  </div>
                  
                  {system.lastIncident && (
                    <p className="text-xs text-gray-500 mt-2 sm:mt-3">
                      תקרית אחרונה: לפני {system.lastIncident}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Active Incidents */}
      {incidents.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-6">תקריות פעילות</h2>
          <div className="space-y-3 sm:space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2 sm:pb-4 p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <div>
                      <CardTitle className="text-base sm:text-lg">{incident.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm mt-1">
                        התחיל ב-{incident.startTime}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity === 'low' ? 'נמוכה' : 
                         incident.severity === 'medium' ? 'בינונית' : 
                         incident.severity === 'high' ? 'גבוהה' : 'קריטית'}
                      </Badge>
                      <Badge className={getIncidentStatusColor(incident.status)}>
                        {getIncidentStatusText(incident.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">{incident.description}</p>
                  
                  <div className="border-t pt-2 sm:pt-3">
                    <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">עדכונים אחרונים</h4>
                    <div className="space-y-2 sm:space-y-3">
                      {incident.updates.map((update, i) => (
                        <div key={i} className="flex gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div className="font-medium text-gray-500 whitespace-nowrap">{update.time}</div>
                          <div className="text-gray-700">{update.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-6">תחזוקה מתוכננת</h2>
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-base sm:text-lg">אין תחזוקה מתוכננת בקרוב</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              אנו נודיע מראש על כל תחזוקה מתוכננת שעלולה להשפיע על השירות
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default StatusPage;

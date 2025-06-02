
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overall Status */}
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getStatusColor(overallStatus)}`}>
              <OverallStatusIcon className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            מצב כללי של המערכות: <span className={getStatusColor(overallStatus).split(' ')[0]}>{getStatusText(overallStatus)}</span>
          </CardTitle>
          <CardDescription>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">סטטוס מערכות</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {systemStatus.map((system, index) => {
            const StatusIcon = getStatusIcon(system.status);
            const SystemIcon = system.icon;
            
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <SystemIcon className="w-6 h-6 text-gray-600" />
                      <CardTitle className="text-lg">{system.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-5 h-5 ${getStatusColor(system.status).split(' ')[0]}`} />
                      <Badge className={getStatusColor(system.status)}>
                        {getStatusText(system.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{system.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>זמינות (30 יום)</span>
                      <span className="font-medium">{system.uptime}%</span>
                    </div>
                    <Progress value={system.uptime} className="h-2" />
                  </div>
                  
                  {system.lastIncident && (
                    <p className="text-xs text-gray-500 mt-3">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">תקריות פעילות</h2>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{incident.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity === 'medium' ? 'בינוני' : incident.severity}
                      </Badge>
                      <Badge className={getIncidentStatusColor(incident.status)}>
                        {getIncidentStatusText(incident.status)}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    התחיל בשעה {incident.startTime} • {incident.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <h4 className="font-medium text-gray-900 mb-3">עדכונים:</h4>
                  <div className="space-y-3">
                    {incident.updates.map((update, index) => (
                      <div key={index} className="flex gap-3 text-sm">
                        <span className="text-gray-500 font-medium min-w-[50px]">{update.time}</span>
                        <span className="text-gray-700">{update.message}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Status History */}
      <Card>
        <CardHeader>
          <CardTitle>היסטוריית מערכות - 7 ימים אחרונים</CardTitle>
          <CardDescription>סטטוס יומי של המערכות הקריטיות</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {systemStatus.map((system, systemIndex) => (
              <div key={systemIndex}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{system.name}</span>
                  <span className="text-xs text-gray-500">זמינות שבועית: {system.uptime}%</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const isToday = dayIndex === 6;
                    const hasIssue = system.status !== 'operational' && isToday;
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`h-8 flex-1 rounded ${
                          hasIssue ? 'bg-yellow-200' : 'bg-green-200'
                        } flex items-center justify-center`}
                        title={`יום ${dayIndex + 1}`}
                      >
                        {hasIssue ? (
                          <AlertTriangle className="w-3 h-3 text-yellow-600" />
                        ) : (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span>פעיל</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-200 rounded"></div>
              <span>בעיות</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-200 rounded"></div>
              <span>לא פעיל</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusPage;

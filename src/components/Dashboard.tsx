import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Science as ScienceIcon,
  AccountBalance as TokenIcon,
  NetworkCheck as NetworkIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { AppState, HarmonicTarget } from '../types';

interface DashboardProps {
  appState: AppState;
  onTargetSelect: (target: HarmonicTarget) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appState, onTargetSelect }) => {
  // Sample data for charts
  const ciHistoryData = [
    { time: '00:00', ci: 0.82 },
    { time: '04:00', ci: 0.85 },
    { time: '08:00', ci: 0.78 },
    { time: '12:00', ci: 0.88 },
    { time: '16:00', ci: 0.84 },
    { time: '20:00', ci: 0.86 },
  ];

  const targetTypeData = [
    { name: 'UCO to Biodiesel', value: 12, color: '#00ff88' },
    { name: 'Food Waste to Biogas', value: 8, color: '#ff6b35' },
    { name: 'Textile Waste', value: 5, color: '#ffaa00' },
    { name: 'Plastic Waste', value: 7, color: '#00aaff' },
    { name: 'Specialized Streams', value: 3, color: '#ff44aa' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getTargetTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'UCO_to_Biodiesel': '#00ff88',
      'Food_Waste_to_Biogas': '#ff6b35',
      'Textile_Waste_to_Recycled_Materials': '#ffaa00',
      'Plastic_Waste_to_Recycled_Products': '#00aaff',
      'Specialized_Waste_Streams': '#ff44aa',
    };
    return colors[type] || '#666666';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'success': return <CheckCircleIcon />;
      default: return <InfoIcon />;
    }
  };

  return (
    <Box>
      {/* Header Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,255,136,0.05) 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Active Targets</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {appState.targets.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Harmonic transformation nodes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.05) 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <NetworkIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">DGO Nodes</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {appState.dgoNetworkStatus.activeNodes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Network participants
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(0,170,255,0.1) 0%, rgba(0,170,255,0.05) 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TokenIcon sx={{ mr: 1, color: '#00aaff' }} />
                <Typography variant="h6">Total GSWT</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#00aaff' }}>
                {appState.dgoNetworkStatus.totalGSWT.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tokens in circulation
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(255,170,0,0.1) 0%, rgba(255,170,0,0.05) 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScienceIcon sx={{ mr: 1, color: '#ffaa00' }} />
                <Typography variant="h6">Avg CI</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ffaa00' }}>
                {appState.dgoNetworkStatus.averageCI.toFixed(3)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Network coherence
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Coherence Index Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ScienceIcon sx={{ mr: 1 }} />
              Coherence Index Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ciHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="#b0b0b0" />
                <YAxis domain={[0.7, 1.0]} stroke="#b0b0b0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(0,255,136,0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ci"
                  stroke="#00ff88"
                  strokeWidth={3}
                  dot={{ fill: '#00ff88', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#00ff88', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Target Type Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 1 }} />
              Target Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={targetTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {targetTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(0,255,136,0.3)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Active Targets List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 1 }} />
              Active Harmonic Targets
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {appState.targets.slice(0, 5).map((target) => (
                <ListItem
                  key={target.target_id}
                  component="div"
                  onClick={() => onTargetSelect(target)}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: '1px solid rgba(0,255,136,0.2)',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0,255,136,0.1)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: getTargetTypeColor(target.target_type),
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={target.target_name || target.target_id}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={target.target_type.replace(/_/g, ' ')}
                          size="small"
                          sx={{
                            backgroundColor: getTargetTypeColor(target.target_type),
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        />
                        <Chip
                          label={target.dgo_network_connection.status}
                          size="small"
                          color={getStatusColor(target.dgo_network_connection.status) as any}
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* System Alerts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1 }} />
              System Alerts
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {appState.alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  severity={alert.type as any}
                  icon={getAlertIcon(alert.type)}
                  sx={{ mb: 1 }}
                >
                  <AlertTitle>{alert.message}</AlertTitle>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(alert.timestamp).toLocaleString()}
                  </Typography>
                </Alert>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Current CI Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ScienceIcon sx={{ mr: 1 }} />
              Current System Coherence Index
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={appState.currentCI * 100}
                  sx={{
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: appState.currentCI > 0.8 ? '#00ff88' : appState.currentCI > 0.7 ? '#ffaa00' : '#ff4444',
                      borderRadius: 10,
                    },
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', minWidth: 100, textAlign: 'right' }}>
                {appState.currentCI.toFixed(3)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {appState.currentCI > 0.8 ? 'Optimal' : appState.currentCI > 0.7 ? 'Warning' : 'Critical'} - 
              {appState.currentCI > 0.8 ? ' All systems operating within normal parameters' : 
               appState.currentCI > 0.7 ? ' Monitor for potential CRL events' : 
               ' Emergency protocols may be required'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

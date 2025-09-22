import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Report as EmergencyIcon,
  Science as ScienceIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { CRLPreventionProtocols } from '../types';
import { crlPreventionProtocols } from '../data/sampleData';

interface SafetyProtocolsProps {
  currentCI: number;
}

const SafetyProtocols: React.FC<SafetyProtocolsProps> = ({ currentCI }) => {
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [crlThreats, setCrlThreats] = useState<any[]>([]);

  const getCIStatus = (ci: number) => {
    if (ci > 0.8) return { level: 'optimal', color: 'success', message: 'Optimal - All systems stable' };
    if (ci > 0.75) return { level: 'warning', color: 'warning', message: 'Warning - Monitor for potential issues' };
    if (ci > 0.7) return { level: 'critical', color: 'error', message: 'Critical - Emergency protocols may be required' };
    return { level: 'emergency', color: 'error', message: 'EMERGENCY - Immediate action required' };
  };

  const ciStatus = getCIStatus(currentCI);

  const ciHistoryData = [
    { time: '00:00', ci: 0.82, threshold: 0.7 },
    { time: '04:00', ci: 0.85, threshold: 0.7 },
    { time: '08:00', ci: 0.78, threshold: 0.7 },
    { time: '12:00', ci: 0.88, threshold: 0.7 },
    { time: '16:00', ci: 0.84, threshold: 0.7 },
    { time: '20:00', ci: 0.86, threshold: 0.7 },
  ];

  const handleEmergencyQuench = () => {
    setEmergencyDialogOpen(true);
  };

  const handleProtocolActivation = (protocolId: string) => {
    setActiveProtocol(protocolId);
    // Simulate protocol activation
    setTimeout(() => {
      setActiveProtocol(null);
    }, 3000);
  };

  return (
    <Box>
      {/* Current CI Status */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <ScienceIcon sx={{ mr: 1 }} />
          Coherence Integrity and Safety Protocol (CISP)
        </Typography>
        
        <Alert severity={ciStatus.color as any} sx={{ mb: 2 }}>
          <AlertTitle>Current System Status: {ciStatus.level.toUpperCase()}</AlertTitle>
          {ciStatus.message}
        </Alert>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Coherence Index: {currentCI.toFixed(3)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={currentCI * 100}
              sx={{
                height: 20,
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: ciStatus.color === 'success' ? '#00ff88' : 
                                 ciStatus.color === 'warning' ? '#ffaa00' : '#ff4444',
                  borderRadius: 10,
                },
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<EmergencyIcon />}
            onClick={handleEmergencyQuench}
            disabled={currentCI > 0.7}
            sx={{ minWidth: 200 }}
          >
            EMERGENCY QUENCH
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* CI Monitoring */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1 }} />
              Coherence Index Monitoring
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ciHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="#b0b0b0" />
                <YAxis domain={[0.6, 1.0]} stroke="#b0b0b0" />
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
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="#ff4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* CI Thresholds */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1 }} />
              CI Thresholds
            </Typography>
            <List>
              {crlPreventionProtocols.ciMonitoring.thresholds.map((threshold, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {threshold.level === 'Warning' ? (
                      <WarningIcon color="warning" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${threshold.level}: ${threshold.ci_condition}`}
                    secondary={threshold.operator_alert}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* CRL Threat Management */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1 }} />
              CRL Threat Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {crlPreventionProtocols.crlThreatManagement.description}
            </Typography>
            <List>
              {crlPreventionProtocols.crlThreatManagement.protocols.map((protocol, index) => (
                <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                      {protocol.threat_type}
                    </Typography>
                    <Chip
                      label={protocol.mitigation_protocol_id}
                      size="small"
                      color="primary"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {protocol.detection_method}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {protocol.action}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleProtocolActivation(protocol.mitigation_protocol_id)}
                    disabled={activeProtocol === protocol.mitigation_protocol_id}
                    sx={{ mt: 1 }}
                  >
                    {activeProtocol === protocol.mitigation_protocol_id ? 'Activating...' : 'Activate Protocol'}
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Emergency Procedures */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <EmergencyIcon sx={{ mr: 1 }} />
              Emergency Procedures
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {crlPreventionProtocols.emergencyProcedures.description}
            </Typography>
            
            <Card sx={{ p: 2, mb: 2, border: '2px solid #ff4444' }}>
              <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                {crlPreventionProtocols.emergencyProcedures.protocol.protocol_id}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {crlPreventionProtocols.emergencyProcedures.protocol.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Trigger:</strong> {crlPreventionProtocols.emergencyProcedures.protocol.trigger}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Manual Activation:</strong> {crlPreventionProtocols.emergencyProcedures.protocol.manual_activation}
              </Typography>
              <Button
                variant="contained"
                color="error"
                fullWidth
                startIcon={<EmergencyIcon />}
                onClick={handleEmergencyQuench}
                disabled={currentCI > 0.7}
              >
                EMERGENCY FIELD QUENCH
              </Button>
            </Card>

            <Alert severity="error">
              <AlertTitle>Warning</AlertTitle>
              Emergency Field Quench is irreversible and will immediately halt all scalar wave activity.
            </Alert>
          </Paper>
        </Grid>

        {/* Protocol Failure Handling */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} />
              Verification and Protocol Failure Handling
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {crlPreventionProtocols.verificationAndProtocolFailureHandling.description}
            </Typography>
            
            <Stepper orientation="vertical">
              {crlPreventionProtocols.verificationAndProtocolFailureHandling.process.map((step, index) => (
                <Step key={index} active>
                  <StepLabel>{step.name}</StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      {step.details}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        {/* Active Protocols Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <PlayIcon sx={{ mr: 1 }} />
              Active Safety Protocols
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    CI Monitoring
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Continuous monitoring active
                  </Typography>
                  <Chip label="ACTIVE" color="success" sx={{ mt: 1 }} />
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="info.main">
                    CRL Detection
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real-time threat analysis
                  </Typography>
                  <Chip label="ACTIVE" color="info" sx={{ mt: 1 }} />
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="warning.main">
                    Emergency Quench
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ready for activation
                  </Typography>
                  <Chip 
                    label={currentCI <= 0.7 ? "READY" : "STANDBY"} 
                    color={currentCI <= 0.7 ? "error" : "warning"} 
                    sx={{ mt: 1 }} 
                  />
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Emergency Quench Confirmation Dialog */}
      <Dialog
        open={emergencyDialogOpen}
        onClose={() => setEmergencyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmergencyIcon sx={{ mr: 1, color: 'error.main' }} />
            Emergency Field Quench Confirmation
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>CRITICAL WARNING</AlertTitle>
            This action will immediately halt all scalar wave activity and render all materials inert.
            This process is IRREVERSIBLE.
          </Alert>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Current Coherence Index: <strong>{currentCI.toFixed(3)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you absolutely certain you want to proceed with the Emergency Field Quench?
            This will trigger a system-wide lockdown and alert all operators.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmergencyDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setEmergencyDialogOpen(false);
              // Simulate emergency quench
              alert('EMERGENCY FIELD QUENCH ACTIVATED - All systems shutting down');
            }}
          >
            CONFIRM QUENCH
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SafetyProtocols;

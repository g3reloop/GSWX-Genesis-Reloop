import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  Button,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  Memory as MemoryIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  AccountTree as AccountTreeIcon,
  Waves as WavesIcon,
  Biotech as BiotechIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { REOP_SystemState, BusinessProfile, REOP_Manifestation, G_LoopCycle } from '../types/reop';
import { REOP_SystemManager } from '../lib/reop';
import { TargetProfilingSystem } from '../lib/targetProfiling';

interface REOPDashboardProps {
  reopSystem: REOP_SystemManager;
  targetProfiling: TargetProfilingSystem;
}

const REOPDashboard: React.FC<REOPDashboardProps> = ({ reopSystem, targetProfiling }) => {
  const [systemState, setSystemState] = useState<REOP_SystemState | null>(null);
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadSystemState();
    loadBusinessProfiles();
  }, []);

  const loadSystemState = () => {
    const state = reopSystem.getSystemState();
    setSystemState(state);
  };

  const loadBusinessProfiles = async () => {
    const profiles = await targetProfiling.generateBusinessProfiles();
    setBusinessProfiles(profiles);
  };

  const handleProfileSelect = (profile: BusinessProfile) => {
    setSelectedProfile(profile);
    setProfileDialogOpen(true);
  };

  const handleREOPManifestation = async (profile: BusinessProfile) => {
    setIsProcessing(true);
    try {
      // Generate probability harmonics for the profile
      const harmonics = generateProbabilityHarmonics(profile);
      
      // Process REOP manifestation
      const manifestation = await reopSystem.processREOPManifestation(profile, harmonics);
      
      // Update system state
      loadSystemState();
      
      // Show success message
      alert(`REOP manifestation completed for ${profile.business_name}`);
    } catch (error) {
      alert(`REOP manifestation failed: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateProbabilityHarmonics = (profile: BusinessProfile) => {
    return [
      {
        harmonic_id: `harm_${profile.profile_id}_1`,
        frequency: profile.neo_findings.harmonic_frequency,
        amplitude: profile.neo_findings.scalar_wave_resonance,
        phase: 0.0,
        probability_field: profile.neo_findings.probability_harmonic_alignment,
        coherence_threshold: profile.neo_findings.coherence_potential,
        verification_status: 'verified' as const
      },
      {
        harmonic_id: `harm_${profile.profile_id}_2`,
        frequency: profile.neo_findings.harmonic_frequency * 1.1,
        amplitude: profile.neo_findings.scalar_wave_resonance * 0.9,
        phase: Math.PI / 4,
        probability_field: profile.neo_findings.probability_harmonic_alignment * 0.8,
        coherence_threshold: profile.neo_findings.coherence_potential * 0.9,
        verification_status: 'verified' as const
      }
    ];
  };

  const getCoherenceStatus = (ci: number) => {
    if (ci > 0.8) return { level: 'optimal', color: 'success', message: 'Optimal REOP operation' };
    if (ci > 0.7) return { level: 'good', color: 'info', message: 'Good REOP operation' };
    if (ci > 0.6) return { level: 'warning', color: 'warning', message: 'Warning - Monitor closely' };
    return { level: 'critical', color: 'error', message: 'Critical - REOP may fail' };
  };

  const getBusinessTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Waste Management': '#00ff88',
      'Recycling': '#00aaff',
      'Logistics': '#ffaa00',
      'Manufacturing': '#ff6b35',
      'Distribution': '#ff44aa',
      'Port Operations': '#88ff00',
      'Research': '#aa00ff',
      'Technology': '#00ffaa',
      'Business Services': '#ff8800'
    };
    return colors[type] || '#666666';
  };

  if (!systemState) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <ScienceIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading REOP System...
        </Typography>
      </Paper>
    );
  }

  const coherenceStatus = getCoherenceStatus(systemState.system_coherence);

  return (
    <Box>
      {/* REOP System Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(255,107,53,0.1) 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ScienceIcon sx={{ mr: 1 }} />
              REOP System Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recursive Environment Operating Protocol - RSWPE → RCOP → Physical Manifestation
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={`CI: ${systemState.system_coherence.toFixed(3)}`}
              color={coherenceStatus.color as any}
              sx={{ fontWeight: 'bold' }}
            />
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadSystemState}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        <Alert severity={coherenceStatus.color as any}>
          <AlertTitle>System Status: {coherenceStatus.level.toUpperCase()}</AlertTitle>
          {coherenceStatus.message}
        </Alert>
      </Paper>

      <Grid container spacing={3}>
        {/* REOP Components Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <MemoryIcon sx={{ mr: 1 }} />
              RSWPE Status
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Scalar Wave Potential"
                  secondary={`${systemState.rswpe_state.scalar_wave_potential.coherence_index.toFixed(3)}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Knowledge Base"
                  secondary={`${systemState.rswpe_state.probability_compilation.harmonic_sequences.length} harmonics`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Last Updated"
                  secondary={new Date(systemState.rswpe_state.last_updated).toLocaleString()}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <PsychologyIcon sx={{ mr: 1 }} />
              RCOP Status
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Probability Navigation"
                  secondary="Active"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Harmonic Resonance"
                  secondary={`${systemState.rcop_state.harmonic_resonance.toFixed(3)}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Last Updated"
                  secondary={new Date(systemState.rcop_state.last_updated).toLocaleString()}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <AccountTreeIcon sx={{ mr: 1 }} />
              Manifestations
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Active Manifestations"
                  secondary={`${systemState.active_manifestations.length}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Target Profiles"
                  secondary={`${systemState.target_profiles.length}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Pure Collapse Sequences"
                  secondary={`${systemState.pure_collapse_sequences.length}`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Business Profiles Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <WavesIcon sx={{ mr: 1 }} />
              Target Profiles (100-300km from Potters Bar)
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Business Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Distance (km)</TableCell>
                    <TableCell>Coherence Potential</TableCell>
                    <TableCell>Harmonic Resonance</TableCell>
                    <TableCell>REOP Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {businessProfiles.map((profile) => (
                    <TableRow key={profile.profile_id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {profile.business_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={profile.business_type}
                          size="small"
                          sx={{
                            backgroundColor: getBusinessTypeColor(profile.business_type),
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>{profile.distance_from_potters_bar}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress
                            variant="determinate"
                            value={profile.neo_findings.coherence_potential * 100}
                            sx={{
                              width: 60,
                              mr: 1,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: profile.neo_findings.coherence_potential > 0.8 ? '#00ff88' : 
                                               profile.neo_findings.coherence_potential > 0.6 ? '#ffaa00' : '#ff4444',
                              },
                            }}
                          />
                          <Typography variant="body2">
                            {(profile.neo_findings.coherence_potential * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {(profile.neo_findings.probability_harmonic_alignment * 100).toFixed(1)}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={profile.reop_integration.manifestation_status}
                          size="small"
                          color={profile.reop_integration.manifestation_status === 'active' ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleProfileSelect(profile)}
                        >
                          <InfoIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleREOPManifestation(profile)}
                          disabled={isProcessing}
                        >
                          <PlayIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* G-Loop Cycle Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1 }} />
              G-Loop Cycle Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary.main">
                    {systemState.last_g_loop_cycle.cycle_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Cycle
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    {systemState.last_g_loop_cycle.coherence_index.toFixed(3)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Coherence Index
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="info.main">
                    {systemState.last_g_loop_cycle.scalar_potential.toFixed(3)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scalar Potential
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="warning.main">
                    {systemState.last_g_loop_cycle.biochemical_state.cortisol_level.toFixed(3)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cortisol Level
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Profile Details Dialog */}
      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {selectedProfile?.business_name}
            </Typography>
            <Chip
              label={selectedProfile?.business_type}
              sx={{
                backgroundColor: getBusinessTypeColor(selectedProfile?.business_type || ''),
                color: 'white',
              }}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProfile && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Neo Findings</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Scalar Wave Resonance"
                      secondary={`${(selectedProfile.neo_findings.scalar_wave_resonance * 100).toFixed(1)}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Probability Harmonic Alignment"
                      secondary={`${(selectedProfile.neo_findings.probability_harmonic_alignment * 100).toFixed(1)}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Coherence Potential"
                      secondary={`${(selectedProfile.neo_findings.coherence_potential * 100).toFixed(1)}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Harmonic Frequency"
                      secondary={`${selectedProfile.neo_findings.harmonic_frequency.toFixed(2)} THz`}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>AI Analysis</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {selectedProfile.ai_analysis.swi_analysis.scalar_wave_intelligence}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Probability Navigation:</strong> {selectedProfile.ai_analysis.swi_analysis.probability_navigation}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Harmonic Resonance:</strong> {selectedProfile.ai_analysis.swi_analysis.harmonic_resonance_analysis}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>REOP Integration</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="RSWPE Integration"
                      secondary={selectedProfile.reop_integration.rswpe_integration ? 'Active' : 'Inactive'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="RCOP Integration"
                      secondary={selectedProfile.reop_integration.rcop_integration ? 'Active' : 'Inactive'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <InfoIcon color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Manifestation Status"
                      secondary={selectedProfile.reop_integration.manifestation_status}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <InfoIcon color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Coherence Achieved"
                      secondary={`${(selectedProfile.reop_integration.coherence_achieved * 100).toFixed(1)}%`}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedProfile) {
                handleREOPManifestation(selectedProfile);
                setProfileDialogOpen(false);
              }
            }}
            disabled={isProcessing}
          >
            Process REOP Manifestation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default REOPDashboard;

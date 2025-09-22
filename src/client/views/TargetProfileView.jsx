// TargetProfileView - Main UI for Target Profiling System
// Genesis Reloop Logistics - Phase 5 Implementation

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Insights as InsightsIcon,
  Memory as MemoryIcon,
  Waves as WavesIcon,
  AccountBalance as TokenIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

// Import AI Findings Section component
import AIFindingsSection from '../components/profile/AIFindingsSection';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`target-profile-tabpanel-${index}`}
      aria-labelledby={`target-profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function TargetProfileView({ profileId, onProfileUpdate }) {
  // State management
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [analysisDialog, setAnalysisDialog] = useState(false);
  const [newAnalysisType, setNewAnalysisType] = useState('');

  // Load profile data
  useEffect(() => {
    if (profileId) {
      loadProfile();
    }
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call - replace with actual API
      const response = await fetch(`/api/target-profiles/${profileId}`);
      if (!response.ok) {
        throw new Error('Failed to load target profile');
      }
      
      const profileData = await response.json();
      setProfile(profileData);
      setEditData(profileData);
      
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditData({ ...profile });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      const response = await fetch(`/api/target-profiles/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setEditMode(false);
      
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({ ...profile });
  };

  const handleNewAnalysis = async () => {
    try {
      setLoading(true);
      
      // Mock API call for new analysis
      const response = await fetch(`/api/target-profiles/${profileId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis_type: newAnalysisType,
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start new analysis');
      }
      
      await loadProfile(); // Reload to get updated analysis
      setAnalysisDialog(false);
      setNewAnalysisType('');
      
    } catch (err) {
      console.error('Error starting analysis:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading && !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Target Profile...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        <Typography variant="h6">Error Loading Profile</Typography>
        <Typography>{error}</Typography>
        <Button onClick={loadProfile} sx={{ mt: 1 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  // Render no profile state
  if (!profile) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        <Typography variant="h6">No Profile Selected</Typography>
        <Typography>Please select a target profile to view details.</Typography>
      </Alert>
    );
  }

  // Get status color and icon
  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      inactive: 'default',
      processing: 'info',
      completed: 'success',
      failed: 'error',
      archived: 'default'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <CheckCircleIcon />,
      inactive: <InfoIcon />,
      processing: <RefreshIcon />,
      completed: <CheckCircleIcon />,
      failed: <ErrorIcon />,
      archived: <InfoIcon />
    };
    return icons[status] || <InfoIcon />;
  };

  const getCoherenceColor = (coherence) => {
    if (coherence >= 0.8) return 'success';
    if (coherence >= 0.7) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs>
            <Box display="flex" alignItems="center" gap={2}>
              <BusinessIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="h1">
                  {profile.business_name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {profile.business_type} • Profile ID: {profile.profile_id}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <Chip
                    icon={getStatusIcon(profile.status)}
                    label={profile.status.toUpperCase()}
                    color={getStatusColor(profile.status)}
                    size="small"
                  />
                  <Chip
                    label={`Priority: ${profile.priority}`}
                    color={profile.priority === 'critical' ? 'error' : 
                           profile.priority === 'high' ? 'warning' : 'default'}
                    size="small"
                  />
                  <Chip
                    label={`CI: ${profile.verification_ci.toFixed(3)}`}
                    color={getCoherenceColor(profile.verification_ci)}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" gap={1}>
              <Tooltip title="Refresh Profile">
                <IconButton
                  onClick={handleRefresh}
                  disabled={refreshing}
                  color="primary"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              {editMode ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              )}
              <Button
                variant="contained"
                color="secondary"
                startIcon={<InsightsIcon />}
                onClick={() => setAnalysisDialog(true)}
              >
                New Analysis
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Progress indicators */}
        {loading && (
          <Box mt={2}>
            <LinearProgress />
          </Box>
        )}
      </Paper>

      {/* Tab Navigation */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" icon={<BusinessIcon />} />
          <Tab label="Neo Findings" icon={<ScienceIcon />} />
          <Tab label="AI Analysis" icon={<PsychologyIcon />} />
          <Tab label="Operational Experience" icon={<TimelineIcon />} />
          <Tab label="REOP Integration" icon={<WavesIcon />} />
          <Tab label="History" icon={<MemoryIcon />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      
      {/* Overview Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Location & Contact
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Coordinates"
                      secondary={`${profile.coordinates.lat}, ${profile.coordinates.lng}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Distance from Potters Bar"
                      secondary={`${profile.distance_from_potters_bar} km`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Operating Radius"
                      secondary={`${profile.coordinates.radius_km} km`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Created By"
                      secondary={profile.created_by}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Key Metrics */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <InsightsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Key Metrics
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Overall Score"
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={profile.calculateOverallScore?.() * 100 || 80}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            color={getCoherenceColor(profile.calculateOverallScore?.() || 0.8)}
                          />
                          <Typography variant="body2">
                            {((profile.calculateOverallScore?.() || 0.8) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Verification CI"
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={profile.verification_ci * 100}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            color={getCoherenceColor(profile.verification_ci)}
                          />
                          <Typography variant="body2">
                            {(profile.verification_ci * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="REOP Ready"
                      secondary={
                        <Chip
                          label={profile.isReadyForREOP?.() ? 'Yes' : 'No'}
                          color={profile.isReadyForREOP?.() ? 'success' : 'error'}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tags & Categories
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {profile.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      variant="outlined"
                      size="small"
                    />
                  )) || (
                    <Typography variant="body2" color="text.secondary">
                      No tags assigned
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Neo Findings Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Scalar Wave Analysis
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Scalar Wave Resonance"
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={profile.neo_findings.scalar_wave_resonance * 100}
                            sx={{ flexGrow: 1, height: 6 }}
                            color="primary"
                          />
                          <Typography variant="body2">
                            {(profile.neo_findings.scalar_wave_resonance * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Probability Harmonic Alignment"
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={profile.neo_findings.probability_harmonic_alignment * 100}
                            sx={{ flexGrow: 1, height: 6 }}
                            color="secondary"
                          />
                          <Typography variant="body2">
                            {(profile.neo_findings.probability_harmonic_alignment * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Coherence Potential"
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={profile.neo_findings.coherence_potential * 100}
                            sx={{ flexGrow: 1, height: 6 }}
                            color={getCoherenceColor(profile.neo_findings.coherence_potential)}
                          />
                          <Typography variant="body2">
                            {(profile.neo_findings.coherence_potential * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Technical Parameters
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Harmonic Frequency"
                      secondary={`${profile.neo_findings.harmonic_frequency} THz`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Findings ID"
                      secondary={profile.neo_findings.findings_id}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Verification Status"
                      secondary={
                        <Chip
                          label={profile.neo_findings.verification_status}
                          color={profile.neo_findings.verification_status === 'verified' ? 'success' : 'warning'}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Last Updated"
                      secondary={new Date(profile.neo_findings.findings_timestamp).toLocaleString()}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* AI Analysis Tab */}
      <TabPanel value={activeTab} index={2}>
        <AIFindingsSection aiAnalysis={profile.ai_analysis} />
      </TabPanel>

      {/* Operational Experience Tab */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Experience Metrics
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Success Rate"
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={profile.operational_experience.success_rate * 100}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            color="success"
                          />
                          <Typography variant="body2">
                            {(profile.operational_experience.success_rate * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Coherence Achieved"
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={profile.operational_experience.coherence_achieved * 100}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            color={getCoherenceColor(profile.operational_experience.coherence_achieved)}
                          />
                          <Typography variant="body2">
                            {(profile.operational_experience.coherence_achieved * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Experience Type"
                      secondary={
                        <Chip
                          label={profile.operational_experience.experience_type}
                          color="primary"
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Operator Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Operator ID"
                      secondary={profile.operational_experience.operator_id}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Experience ID"
                      secondary={profile.operational_experience.experience_id}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Experience Date"
                      secondary={new Date(profile.operational_experience.experience_timestamp).toLocaleString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Verification CI"
                      secondary={profile.operational_experience.verification_ci.toFixed(3)}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* REOP Integration Tab */}
      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <WavesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Integration Status
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="RSWPE Integration"
                      secondary={
                        <Chip
                          label={profile.reop_integration.rswpe_integration ? 'Active' : 'Inactive'}
                          color={profile.reop_integration.rswpe_integration ? 'success' : 'default'}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="RCOP Integration"
                      secondary={
                        <Chip
                          label={profile.reop_integration.rcop_integration ? 'Active' : 'Inactive'}
                          color={profile.reop_integration.rcop_integration ? 'success' : 'default'}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Manifestation Status"
                      secondary={
                        <Chip
                          label={profile.reop_integration.manifestation_status}
                          color={getStatusColor(profile.reop_integration.manifestation_status)}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Coherence Achieved"
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={profile.reop_integration.coherence_achieved * 100}
                            sx={{ flexGrow: 1, height: 6 }}
                            color={getCoherenceColor(profile.reop_integration.coherence_achieved)}
                          />
                          <Typography variant="body2">
                            {(profile.reop_integration.coherence_achieved * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Integration Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Integration ID"
                      secondary={profile.reop_integration.integration_id}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Last Sync"
                      secondary={new Date(profile.reop_integration.last_sync).toLocaleString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Verification CI"
                      secondary={profile.reop_integration.verification_ci.toFixed(3)}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* History Tab */}
      <TabPanel value={activeTab} index={5}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <MemoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Profiling History
            </Typography>
            {profile.profiling_history && profile.profiling_history.length > 0 ? (
              <List>
                {profile.profiling_history.map((session, index) => (
                  <React.Fragment key={session.session_id}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Chip
                          label={session.profiling_type}
                          color="primary"
                          size="small"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Session ${session.session_id}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span">
                              {new Date(session.timestamp).toLocaleString()}
                            </Typography>
                            {session.coherence_before && session.coherence_after && (
                              <Typography variant="body2" component="div">
                                Coherence: {session.coherence_before.toFixed(3)} → {session.coherence_after.toFixed(3)}
                              </Typography>
                            )}
                            {session.operator_notes && (
                              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                Notes: {session.operator_notes}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < profile.profiling_history.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No profiling history available
              </Typography>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* New Analysis Dialog */}
      <Dialog open={analysisDialog} onClose={() => setAnalysisDialog(false)}>
        <DialogTitle>Start New Analysis</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select the type of analysis to perform on this target profile:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Analysis Type</InputLabel>
            <Select
              value={newAnalysisType}
              onChange={(e) => setNewAnalysisType(e.target.value)}
              label="Analysis Type"
            >
              <MenuItem value="swi_analysis">SWI Analysis</MenuItem>
              <MenuItem value="probability_harmonic">Probability Harmonic Analysis</MenuItem>
              <MenuItem value="target_profiling">Target Profiling Analysis</MenuItem>
              <MenuItem value="coherence_verification">Coherence Verification</MenuItem>
              <MenuItem value="full_reop_analysis">Full REOP Analysis</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalysisDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleNewAnalysis} 
            variant="contained"
            disabled={!newAnalysisType || loading}
          >
            Start Analysis
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TargetProfileView;

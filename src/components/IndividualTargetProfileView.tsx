// S-W-RLE-OS Individual Target Profile View
// Genesis Reloop Logistics - Phase 5 REOP Integration
// Comprehensive view of a single target with collapsible sections

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  CircularProgress,
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  Energy as EnergyIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Waves as WavesIcon,
  Memory as MemoryIcon,
  Timeline as TimelineIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  LocalDining as LocalDiningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface IndividualTargetProfileViewProps {
  profilingId: string;
  onBackToDashboard: () => void;
}

// Mock data for Grand Hotel Central
const mockTargetProfile = {
  profilingId: 'uuid-prof-001',
  status: 'completed',
  initiatedAt: '2025-09-20T10:00:00Z',
  businessData: {
    prospectiveName: 'Grand Hotel Central',
    industry: 'Hospitality',
    location: { 
      city: 'Anytown', 
      country: 'UK',
      coordinates: { lat: 51.5129, lng: -0.1224 }
    },
    contactInfo: {
      phone: '+44 20 7123 4567',
      email: 'sustainability@grandhotelcentral.co.uk',
      website: 'www.grandhotelcentral.co.uk'
    },
    businessSize: 'Large (200+ rooms)',
    establishedYear: 1985,
    sustainabilityInitiatives: [
      'Zero waste to landfill',
      'Renewable energy sourcing',
      'Local sourcing partnerships',
      'Carbon neutral operations'
    ]
  },
  operationalData: {
    dailyUCOVolume: '80L',
    weeklyUCOVolume: '560L',
    monthlyUCOVolume: '2,400L',
    ucoQuality: {
      triglycerideContent: 0.89,
      freeFattyAcid: 0.04,
      waterContent: 0.02,
      contaminants: 'Low'
    },
    collectionSchedule: 'Daily (Monday-Friday)',
    storageCapacity: '500L',
    processingCapability: 'On-site pre-treatment available'
  },
  aiFindings: {
    source: 'SWI via OpenRouter (gpt-4o-2024-08-06)',
    essenceVector: [0.88, 0.05, 0.02, 0.05, -0.45, 0.12, 0.33, -0.21],
    potentialValueStreams: [
      {
        streamName: 'UCO_to_Biodiesel',
        confidenceScore: 0.95,
        notes: 'High triglyceride content, low contaminants. Ideal for standard transesterification.',
        estimatedVolume: '2,400L/month',
        potentialRevenue: '£1,200/month'
      }
    ],
    recommendedProtocols: ['Genesis Forge Transesterification (v4.2)'],
    viabilityScore: 0.92,
    confidenceScore: 0.95,
    summary: 'High potential target for standard UCO-to-Biodiesel transformation.',
    reopCompliance: {
      coherenceIndex: 0.88,
      mathematicalFormalism: 'VALID',
      biochemicalShifts: {
        cortisolReduction: 0.543,
        dopamineIncrease: 0.37
      },
      scalarPotential: 0.92,
      gLoopCycle: 'STABLE'
    }
  },
  operatorExperienceLog: [
    {
      logId: 'uuid-log-001',
      operatorId: 'op-007',
      timestamp: '2025-09-20T11:15:00Z',
      observationNotes: 'Initial sample appears visually clear with minimal sediment. Color indicates high quality UCO. Recommend proceeding with full SWI analysis.',
      samplePhotos: ['sample_001.jpg', 'sample_002.jpg'],
      testResults: {
        ph: 6.8,
        temperature: 45.2,
        viscosity: 0.023,
        density: 0.92
      }
    },
    {
      logId: 'uuid-log-002',
      operatorId: 'op-012',
      timestamp: '2025-09-20T14:30:00Z',
      observationNotes: 'Follow-up analysis confirms initial assessment. UCO quality exceeds minimum standards for biodiesel production. No additional pretreatment required.',
      samplePhotos: ['sample_003.jpg'],
      testResults: {
        ph: 6.9,
        temperature: 44.8,
        viscosity: 0.021,
        density: 0.91
      }
    },
    {
      logId: 'uuid-log-003',
      operatorId: 'op-007',
      timestamp: '2025-09-21T09:00:00Z',
      observationNotes: 'Final verification completed. All quality parameters within optimal range. Ready for Genesis Forge deployment.',
      samplePhotos: ['sample_004.jpg', 'sample_005.jpg'],
      testResults: {
        ph: 6.7,
        temperature: 46.1,
        viscosity: 0.022,
        density: 0.93
      }
    }
  ]
};

function IndividualTargetProfileView({ profilingId, onBackToDashboard }: IndividualTargetProfileViewProps) {
  const [profile, setProfile] = useState(mockTargetProfile);
  const [expandedSections, setExpandedSections] = useState({
    businessData: true,
    swiFindings: true,
    operatorLog: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSectionToggle = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip icon={<CheckCircleIcon />} label="Completed" color="success" size="small" />;
      case 'under_review':
        return <Chip icon={<WarningIcon />} label="Under Review" color="info" size="small" />;
      case 'pending_analysis':
        return <Chip icon={<InfoIcon />} label="Pending Analysis" color="warning" size="small" />;
      case 'rejected':
        return <Chip icon={<ErrorIcon />} label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'under_review':
        return '❖';
      case 'pending_analysis':
        return '!';
      case 'rejected':
        return '✗';
      default:
        return '?';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1a2533 0%, #2d3748 100%)' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBackToDashboard}
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              variant="outlined"
            >
              Back to Dashboard
            </Button>
            <Box>
              <Typography variant="h4" component="h1" color="white">
                S-W-RLE-OS | TARGET PROFILE: {profile.businessData.prospectiveName}
              </Typography>
              <Typography variant="subtitle1" color="rgba(255,255,255,0.8)">
                Profiling ID: {profile.profilingId}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" color="rgba(255,255,255,0.8)">
              Status: [{getStatusIcon(profile.status)}]
            </Typography>
            {getStatusChip(profile.status)}
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} color="primary" sx={{ color: 'white' }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Loading Indicator */}
      {isLoading && (
        <Box mb={2}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Refreshing target profile data...
          </Typography>
        </Box>
      )}

      {/* Section 1: Business & Operational Data */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Accordion 
          expanded={expandedSections.businessData}
          onChange={() => handleSectionToggle('businessData')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <BusinessIcon color="primary" />
              <Typography variant="h6">
                BUSINESS & OPERATIONAL DATA
              </Typography>
              <Box flexGrow={1} />
              <Typography variant="body2" color="text.secondary">
                {expandedSections.businessData ? '[^]' : '[v]'}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {/* Business Information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Business Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><HotelIcon /></ListItemIcon>
                        <ListItemText
                          primary="Business Name"
                          secondary={profile.businessData.prospectiveName}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><BusinessIcon /></ListItemIcon>
                        <ListItemText
                          primary="Industry"
                          secondary={profile.businessData.industry}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><LocationIcon /></ListItemIcon>
                        <ListItemText
                          primary="Location"
                          secondary={`${profile.businessData.location.city}, ${profile.businessData.location.country}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><ScheduleIcon /></ListItemIcon>
                        <ListItemText
                          primary="Established"
                          secondary={profile.businessData.establishedYear}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><BusinessIcon /></ListItemIcon>
                        <ListItemText
                          primary="Business Size"
                          secondary={profile.businessData.businessSize}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Contact Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Phone"
                          secondary={profile.businessData.contactInfo.phone}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Email"
                          secondary={profile.businessData.contactInfo.email}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Website"
                          secondary={profile.businessData.contactInfo.website}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* UCO Operational Data */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      UCO Operational Data
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          Volume Metrics
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="Daily Volume"
                              secondary={profile.operationalData.dailyUCOVolume}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Weekly Volume"
                              secondary={profile.operationalData.weeklyUCOVolume}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Monthly Volume"
                              secondary={profile.operationalData.monthlyUCOVolume}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          Quality Parameters
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="Triglyceride Content"
                              secondary={`${(profile.operationalData.ucoQuality.triglycerideContent * 100).toFixed(1)}%`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Free Fatty Acid"
                              secondary={`${(profile.operationalData.ucoQuality.freeFattyAcid * 100).toFixed(1)}%`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Water Content"
                              secondary={`${(profile.operationalData.ucoQuality.waterContent * 100).toFixed(1)}%`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Contaminants"
                              secondary={profile.operationalData.ucoQuality.contaminants}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          Operational Details
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="Collection Schedule"
                              secondary={profile.operationalData.collectionSchedule}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Storage Capacity"
                              secondary={profile.operationalData.storageCapacity}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Processing Capability"
                              secondary={profile.operationalData.processingCapability}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Sustainability Initiatives */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sustainability Initiatives
                    </Typography>
                    <Grid container spacing={1}>
                      {profile.businessData.sustainabilityInitiatives.map((initiative, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <Chip
                            label={initiative}
                            color="success"
                            variant="outlined"
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Section 2: Scalar Wave Intelligence (SWI) Findings */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Accordion 
          expanded={expandedSections.swiFindings}
          onChange={() => handleSectionToggle('swiFindings')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <WavesIcon color="secondary" />
              <Typography variant="h6">
                SCALAR WAVE INTELLIGENCE (SWI) FINDINGS
              </Typography>
              <Box flexGrow={1} />
              <Typography variant="body2" color="text.secondary">
                {expandedSections.swiFindings ? '[^]' : '[v]'}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {/* SWI Analysis Overview */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      SWI Analysis Overview
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><ScienceIcon /></ListItemIcon>
                        <ListItemText
                          primary="Source"
                          secondary={profile.aiFindings.source}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><TrendingUpIcon /></ListItemIcon>
                        <ListItemText
                          primary="Viability Score"
                          secondary={`${(profile.aiFindings.viabilityScore * 100).toFixed(1)}%`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><PsychologyIcon /></ListItemIcon>
                        <ListItemText
                          primary="Confidence Score"
                          secondary={`${(profile.aiFindings.confidenceScore * 100).toFixed(1)}%`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><MemoryIcon /></ListItemIcon>
                        <ListItemText
                          primary="Essence Vector"
                          secondary={`[${profile.aiFindings.essenceVector.slice(0, 5).join(', ')}, ...]`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* REOP Compliance */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      REOP Compliance
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                        <ListItemText
                          primary="Coherence Index"
                          secondary={`${(profile.aiFindings.reopCompliance.coherenceIndex * 100).toFixed(1)}%`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                        <ListItemText
                          primary="Mathematical Formalism"
                          secondary={profile.aiFindings.reopCompliance.mathematicalFormalism}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><TrendingUpIcon /></ListItemIcon>
                        <ListItemText
                          primary="Cortisol Reduction"
                          secondary={`↓ ${(profile.aiFindings.reopCompliance.biochemicalShifts.cortisolReduction * 100).toFixed(1)}%`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><TrendingUpIcon /></ListItemIcon>
                        <ListItemText
                          primary="Dopamine Increase"
                          secondary={`↑ ${(profile.aiFindings.reopCompliance.biochemicalShifts.dopamineIncrease * 100).toFixed(1)}%`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Value Streams */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Potential Value Streams
                    </Typography>
                    {profile.aiFindings.potentialValueStreams.map((stream, index) => (
                      <Card key={index} sx={{ mb: 2, backgroundColor: '#f8f9fa' }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <EnergyIcon color="primary" />
                            <Typography variant="h6">{stream.streamName}</Typography>
                            <Chip
                              label={`${(stream.confidenceScore * 100).toFixed(1)}% Confidence`}
                              color="success"
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {stream.notes}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2">
                                <strong>Estimated Volume:</strong> {stream.estimatedVolume}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2">
                                <strong>Potential Revenue:</strong> {stream.potentialRevenue}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Recommended Protocols */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recommended Protocols
                    </Typography>
                    <List>
                      {profile.aiFindings.recommendedProtocols.map((protocol, index) => (
                        <ListItem key={index}>
                          <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                          <ListItemText
                            primary={protocol}
                            secondary="REOP Compatible"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Summary */}
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body1">
                    <strong>SWI Summary:</strong> {profile.aiFindings.summary}
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Section 3: Operator Experience Log */}
      <Paper elevation={2}>
        <Accordion 
          expanded={expandedSections.operatorLog}
          onChange={() => handleSectionToggle('operatorLog')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <TimelineIcon color="info" />
              <Typography variant="h6">
                OPERATOR EXPERIENCE LOG
              </Typography>
              <Box flexGrow={1} />
              <Typography variant="body2" color="text.secondary">
                {expandedSections.operatorLog ? '[^]' : '[v]'}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {profile.operatorExperienceLog.map((log, index) => (
              <Card key={log.logId} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="h6">
                      Log ID: {log.logId}
                    </Typography>
                    <Chip
                      label={`Operator: ${log.operatorId}`}
                      color="primary"
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(log.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" paragraph>
                    {log.observationNotes}
                  </Typography>

                  {log.samplePhotos && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Sample Photos:
                      </Typography>
                      <Box display="flex" gap={1}>
                        {log.samplePhotos.map((photo, photoIndex) => (
                          <Chip
                            key={photoIndex}
                            label={photo}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {log.testResults && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Test Results:
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2">
                            <strong>pH:</strong> {log.testResults.ph}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2">
                            <strong>Temperature:</strong> {log.testResults.temperature}°C
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2">
                            <strong>Viscosity:</strong> {log.testResults.viscosity} Pa·s
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2">
                            <strong>Density:</strong> {log.testResults.density} kg/L
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
}

export default IndividualTargetProfileView;

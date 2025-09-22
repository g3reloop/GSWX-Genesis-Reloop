// S-W-RLE-OS Target Profiling System Dashboard
// Genesis Reloop Logistics - Phase 5 REOP Integration
// Main dashboard for target profiling system management

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  InputAdornment,
} from '@mui/material';

import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  Energy as EnergyIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

interface TargetProfile {
  profilingId: string;
  status: 'completed' | 'under_review' | 'pending_analysis' | 'rejected';
  initiatedAt: string;
  businessData: {
    prospectiveName: string;
    industry: string;
    location: { city: string; country?: string };
  };
  aiFindings?: {
    viabilityScore: number;
    confidenceScore: number;
    summary: string;
  };
  operatorExperienceLog?: Array<{
    logId: string;
    operatorId: string;
    timestamp: string;
    observationNotes: string;
  }>;
}

const mockTargetProfiles: TargetProfile[] = [
  {
    profilingId: 'uuid-prof-001',
    status: 'completed',
    initiatedAt: '2025-09-20T10:00:00Z',
    businessData: {
      prospectiveName: 'Grand Hotel Central',
      industry: 'Hospitality',
      location: { city: 'Anytown', country: 'UK' }
    },
    aiFindings: {
      viabilityScore: 0.92,
      confidenceScore: 0.95,
      summary: 'High potential target for standard UCO-to-Biodiesel transformation.'
    },
    operatorExperienceLog: [{
      logId: 'uuid-log-001',
      operatorId: 'op-007',
      timestamp: '2025-09-20T11:15:00Z',
      observationNotes: 'Initial sample appears visually clear... Recommend proceeding with full SWI analysis.'
    }]
  },
  {
    profilingId: 'uuid-prof-002',
    status: 'under_review',
    initiatedAt: '2025-09-21T09:15:00Z',
    businessData: {
      prospectiveName: 'Metro Industrial Fats',
      industry: 'Industrial Processing',
      location: { city: 'London', country: 'UK' }
    },
    aiFindings: {
      viabilityScore: 0.78,
      confidenceScore: 0.82,
      summary: 'Moderate potential with some contamination concerns. Requires additional analysis.'
    }
  },
  {
    profilingId: 'uuid-prof-003',
    status: 'pending_analysis',
    initiatedAt: '2025-09-22T11:05:00Z',
    businessData: {
      prospectiveName: 'City Bistro Collective',
      industry: 'Food Service',
      location: { city: 'Manchester', country: 'UK' }
    }
  },
  {
    profilingId: 'uuid-prof-004',
    status: 'rejected',
    initiatedAt: '2025-09-19T14:00:00Z',
    businessData: {
      prospectiveName: 'AgriCorp Processing Plant',
      industry: 'Agriculture',
      location: { city: 'Birmingham', country: 'UK' }
    },
    aiFindings: {
      viabilityScore: 0.45,
      confidenceScore: 0.38,
      summary: 'High contamination levels. Not suitable for standard processing protocols.'
    }
  }
];

function TargetProfilingDashboard() {
  const [profiles, setProfiles] = useState<TargetProfile[]>(mockTargetProfiles);
  const [filteredProfiles, setFilteredProfiles] = useState<TargetProfile[]>(profiles);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProfile, setSelectedProfile] = useState<TargetProfile | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [newProfileDialogOpen, setNewProfileDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and search logic
  useEffect(() => {
    let filtered = profiles;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(profile => profile.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(profile =>
        profile.businessData.prospectiveName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.businessData.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.businessData.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.profilingId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
  }, [profiles, statusFilter, searchTerm]);

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip icon={<CheckCircleIcon />} label="Completed" color="success" size="small" />;
      case 'under_review':
        return <Chip icon={<PendingIcon />} label="Under Review" color="info" size="small" />;
      case 'pending_analysis':
        return <Chip icon={<WarningIcon />} label="Pending Analysis" color="warning" size="small" />;
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

  const handleProfileClick = (profile: TargetProfile) => {
    setSelectedProfile(profile);
    setDetailDialogOpen(true);
  };

  const handleNewProfile = () => {
    setNewProfileDialogOpen(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getStatusCounts = () => {
    const counts = {
      all: profiles.length,
      completed: profiles.filter(p => p.status === 'completed').length,
      under_review: profiles.filter(p => p.status === 'under_review').length,
      pending_analysis: profiles.filter(p => p.status === 'pending_analysis').length,
      rejected: profiles.filter(p => p.status === 'rejected').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1a2533 0%, #2d3748 100%)' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="h1" color="white" gutterBottom>
              S-W-RLE-OS | TARGET PROFILING SYSTEM | Main Dashboard
            </Typography>
            <Typography variant="subtitle1" color="rgba(255,255,255,0.8)">
              REOP Framework Integration - Cognitive-Level Target Analysis
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} color="primary" sx={{ color: 'white' }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={<FilterIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography>All</Typography>
                    <Badge badgeContent={statusCounts.all} color="primary" />
                  </Box>
                </MenuItem>
                <MenuItem value="completed">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography>Completed</Typography>
                    <Badge badgeContent={statusCounts.completed} color="success" />
                  </Box>
                </MenuItem>
                <MenuItem value="under_review">
                  <Box display="flex" alignItems="center" gap={1}>
                    <PendingIcon color="info" fontSize="small" />
                    <Typography>Under Review</Typography>
                    <Badge badgeContent={statusCounts.under_review} color="info" />
                  </Box>
                </MenuItem>
                <MenuItem value="pending_analysis">
                  <Box display="flex" alignItems="center" gap={1}>
                    <WarningIcon color="warning" fontSize="small" />
                    <Typography>Pending Analysis</Typography>
                    <Badge badgeContent={statusCounts.pending_analysis} color="warning" />
                  </Box>
                </MenuItem>
                <MenuItem value="rejected">
                  <Box display="flex" alignItems="center" gap={1}>
                    <ErrorIcon color="error" fontSize="small" />
                    <Typography>Rejected</Typography>
                    <Badge badgeContent={statusCounts.rejected} color="error" />
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by Name, Industry, Location, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewProfile}
              sx={{ height: '40px' }}
            >
              New Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading Indicator */}
      {isLoading && (
        <Box mb={2}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Refreshing target profiles...
          </Typography>
        </Box>
      )}

      {/* Main Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>
                  PROFILING ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>
                  PROSPECTIVE NAME
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>
                  STATUS
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>
                  INITIATED AT
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow
                  key={profile.profilingId}
                  hover
                  onClick={() => handleProfileClick(profile)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }}
                >
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0', fontFamily: 'monospace' }}>
                    {profile.profilingId}
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {profile.businessData.prospectiveName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profile.businessData.industry} • {profile.businessData.location.city}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        [{getStatusIcon(profile.status)}]
                      </Typography>
                      {getStatusChip(profile.status)}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                    <Typography variant="body2">
                      {new Date(profile.initiatedAt).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick(profile);
                        }}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Profile">
                        <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Profile">
                        <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary Statistics */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    {statusCounts.completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Profiles
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PendingIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {statusCounts.under_review}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Under Review
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <WarningIcon color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {statusCounts.pending_analysis}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Analysis
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ErrorIcon color="error" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="error.main">
                    {statusCounts.rejected}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rejected
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <BusinessIcon color="primary" />
            <Typography variant="h6">
              {selectedProfile?.businessData.prospectiveName}
            </Typography>
            {selectedProfile && getStatusChip(selectedProfile.status)}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProfile && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Business Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><BusinessIcon /></ListItemIcon>
                      <ListItemText
                        primary="Industry"
                        secondary={selectedProfile.businessData.industry}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><LocationIcon /></ListItemIcon>
                      <ListItemText
                        primary="Location"
                        secondary={`${selectedProfile.businessData.location.city}, ${selectedProfile.businessData.location.country}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><ScheduleIcon /></ListItemIcon>
                      <ListItemText
                        primary="Initiated"
                        secondary={new Date(selectedProfile.initiatedAt).toLocaleString()}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  {selectedProfile.aiFindings && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        REOP Analysis
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><TrendingUpIcon /></ListItemIcon>
                          <ListItemText
                            primary="Viability Score"
                            secondary={`${(selectedProfile.aiFindings.viabilityScore * 100).toFixed(1)}%`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><PsychologyIcon /></ListItemIcon>
                          <ListItemText
                            primary="Confidence Score"
                            secondary={`${(selectedProfile.aiFindings.confidenceScore * 100).toFixed(1)}%`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><ScienceIcon /></ListItemIcon>
                          <ListItemText
                            primary="Summary"
                            secondary={selectedProfile.aiFindings.summary}
                          />
                        </ListItem>
                      </List>
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<EditIcon />}>
            Edit Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Profile Dialog */}
      <Dialog
        open={newProfileDialogOpen}
        onClose={() => setNewProfileDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Target Profile</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            New profile creation functionality will be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewProfileDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Create Profile</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TargetProfilingDashboard;

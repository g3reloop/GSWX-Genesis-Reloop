// S-W-RLE-OS Operator Experience Log Section Component
// Genesis Reloop Logistics - Phase 5 REOP Integration
// Displays operator observations and provides form for new entries

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Chip,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import {
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  EditNote as EditNoteIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface OperatorLogEntry {
  logId: string;
  operatorId: string;
  operatorName?: string;
  timestamp: string;
  observationNotes: string;
  logType: 'observation' | 'test_result' | 'quality_check' | 'recommendation' | 'issue' | 'resolution';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'archived';
  tags?: string[];
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
  relatedTests?: Array<{
    testName: string;
    result: string;
    value: string;
    unit: string;
  }>;
}

interface OperatorExperienceLogSectionProps {
  logEntries: OperatorLogEntry[];
  currentOperator: {
    id: string;
    name: string;
    role: string;
  };
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  onRefresh?: () => void;
  onEdit?: () => void;
  onSubmitObservation?: (observation: Partial<OperatorLogEntry>) => void;
  onEditEntry?: (logId: string, updates: Partial<OperatorLogEntry>) => void;
  onDeleteEntry?: (logId: string) => void;
  showActions?: boolean;
}

// Mock data for Grand Hotel Central operator logs
const mockLogEntries: OperatorLogEntry[] = [
  {
    logId: 'uuid-log-001',
    operatorId: 'op-007',
    operatorName: 'Alex Chen',
    timestamp: '2025-09-20T15:00:00Z',
    observationNotes: 'AI findings align with physical assessment. Recommend fast-tracking.',
    logType: 'recommendation',
    priority: 'high',
    status: 'active',
    tags: ['AI Validation', 'Fast Track', 'Quality Assessment'],
    relatedTests: [
      {
        testName: 'pH Level',
        result: 'PASS',
        value: '6.8',
        unit: 'pH'
      },
      {
        testName: 'Temperature',
        result: 'PASS',
        value: '22.5',
        unit: '°C'
      }
    ]
  },
  {
    logId: 'uuid-log-002',
    operatorId: 'op-013',
    operatorName: 'Sarah Johnson',
    timestamp: '2025-09-20T14:30:00Z',
    observationNotes: 'Initial sample appears visually clear with minimal sediment. Recommend proceeding with full SWI analysis.',
    logType: 'observation',
    priority: 'medium',
    status: 'active',
    tags: ['Visual Inspection', 'Sample Quality', 'SWI Analysis'],
    relatedTests: [
      {
        testName: 'Visual Clarity',
        result: 'PASS',
        value: 'Clear',
        unit: 'Visual'
      },
      {
        testName: 'Sediment Level',
        result: 'PASS',
        value: 'Minimal',
        unit: 'Visual'
      }
    ]
  },
  {
    logId: 'uuid-log-003',
    operatorId: 'op-005',
    operatorName: 'Mike Rodriguez',
    timestamp: '2025-09-20T13:45:00Z',
    observationNotes: 'Collection point established. Daily volume confirmed at 120L. Quality parameters within expected range.',
    logType: 'test_result',
    priority: 'medium',
    status: 'active',
    tags: ['Collection Setup', 'Volume Confirmation', 'Quality Check'],
    relatedTests: [
      {
        testName: 'Daily Volume',
        result: 'PASS',
        value: '120',
        unit: 'L/day'
      },
      {
        testName: 'Triglyceride Content',
        result: 'PASS',
        value: '89',
        unit: '%'
      }
    ]
  },
  {
    logId: 'uuid-log-004',
    operatorId: 'op-012',
    operatorName: 'Emma Wilson',
    timestamp: '2025-09-20T12:15:00Z',
    observationNotes: 'Site visit completed. Hotel staff cooperative. Collection schedule established for 6 AM daily.',
    logType: 'observation',
    priority: 'low',
    status: 'active',
    tags: ['Site Visit', 'Staff Coordination', 'Schedule Setup'],
    relatedTests: []
  }
];

const mockCurrentOperator = {
  id: 'op-013',
  name: 'Sarah Johnson',
  role: 'Senior Operator'
};

function OperatorExperienceLogSection({ 
  logEntries = mockLogEntries, 
  currentOperator = mockCurrentOperator,
  isExpanded = false, 
  onToggleExpanded,
  onRefresh,
  onEdit,
  onSubmitObservation,
  onEditEntry,
  onDeleteEntry,
  showActions = true 
}: OperatorExperienceLogSectionProps) {
  const [newObservation, setNewObservation] = useState('');
  const [logType, setLogType] = useState<OperatorLogEntry['logType']>('observation');
  const [priority, setPriority] = useState<OperatorLogEntry['priority']>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getLogTypeIcon = (logType: string) => {
    switch (logType) {
      case 'observation': return <VisibilityIcon />;
      case 'test_result': return <CheckCircleIcon />;
      case 'quality_check': return <WarningIcon />;
      case 'recommendation': return <InfoIcon />;
      case 'issue': return <WarningIcon />;
      case 'resolution': return <CheckCircleIcon />;
      default: return <EditNoteIcon />;
    }
  };

  const getLogTypeColor = (logType: string) => {
    switch (logType) {
      case 'observation': return 'info';
      case 'test_result': return 'success';
      case 'quality_check': return 'warning';
      case 'recommendation': return 'primary';
      case 'issue': return 'error';
      case 'resolution': return 'success';
      default: return 'default';
    }
  };

  const handleSubmitObservation = async () => {
    if (!newObservation.trim()) return;

    setIsSubmitting(true);
    
    const newEntry: Partial<OperatorLogEntry> = {
      operatorId: currentOperator.id,
      operatorName: currentOperator.name,
      timestamp: new Date().toISOString(),
      observationNotes: newObservation.trim(),
      logType,
      priority,
      status: 'active',
      tags: []
    };

    try {
      if (onSubmitObservation) {
        await onSubmitObservation(newEntry);
      }
      setNewObservation('');
      setLogType('observation');
      setPriority('medium');
    } catch (error) {
      console.error('Error submitting observation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEntry = (logId: string) => {
    setEditingEntry(logId);
    setEditDialogOpen(true);
  };

  const handleDeleteEntry = (logId: string) => {
    if (onDeleteEntry) {
      onDeleteEntry(logId);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatOperatorInfo = (entry: OperatorLogEntry) => {
    return `[${entry.operatorId} @ ${formatTimestamp(entry.timestamp)}]`;
  };

  return (
    <Paper elevation={2} sx={{ mb: 2 }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <PersonIcon color="primary" />
          <Typography variant="h6" component="h3">
            OPERATOR EXPERIENCE LOG
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {showActions && (
            <>
              <Tooltip title="Refresh Log">
                <IconButton size="small" onClick={onRefresh}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Log">
                <IconButton size="small" onClick={onEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
          {onToggleExpanded && (
            <IconButton size="small" onClick={onToggleExpanded}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {isExpanded ? '[^]' : '[v]'}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      {isExpanded && (
        <Box sx={{ p: 3 }}>
          {/* Log Entries */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              **Log Entries**
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {logEntries.length === 0 ? (
              <Alert severity="info">
                No log entries found. Add your first observation below.
              </Alert>
            ) : (
              <List>
                {logEntries.map((entry, index) => (
                  <React.Fragment key={entry.logId}>
                    <ListItem
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        py: 2,
                        px: 0
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        {/* Entry Header */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            {getLogTypeIcon(entry.logType)}
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {formatOperatorInfo(entry)}
                            </Typography>
                            <Chip
                              label={entry.logType.replace('_', ' ').toUpperCase()}
                              color={getLogTypeColor(entry.logType)}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={entry.priority.toUpperCase()}
                              color={getPriorityColor(entry.priority)}
                              size="small"
                            />
                          </Box>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Edit Entry">
                              <IconButton size="small" onClick={() => handleEditEntry(entry.logId)}>
                                <EditNoteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Entry">
                              <IconButton size="small" onClick={() => handleDeleteEntry(entry.logId)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Entry Content */}
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {entry.observationNotes}
                        </Typography>

                        {/* Tags */}
                        {entry.tags && entry.tags.length > 0 && (
                          <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 1 }}>
                            {entry.tags.map((tag, tagIndex) => (
                              <Chip
                                key={tagIndex}
                                label={tag}
                                size="small"
                                variant="outlined"
                                color="secondary"
                              />
                            ))}
                          </Box>
                        )}

                        {/* Related Tests */}
                        {entry.relatedTests && entry.relatedTests.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Related Tests:
                            </Typography>
                            <Grid container spacing={1}>
                              {entry.relatedTests.map((test, testIndex) => (
                                <Grid item xs={12} sm={6} md={4} key={testIndex}>
                                  <Card variant="outlined" sx={{ p: 1 }}>
                                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                      <Typography variant="body2" fontWeight="medium">
                                        {test.testName}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {test.result}: {test.value} {test.unit}
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </Box>
                    </ListItem>
                    {index < logEntries.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {/* Add New Observation Form */}
          <Box>
            <Typography variant="h6" gutterBottom>
              **Add New Observation** (Operator: {currentOperator.id})
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                placeholder="Enter notes here..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Log Type</InputLabel>
                  <Select
                    value={logType}
                    onChange={(e) => setLogType(e.target.value as OperatorLogEntry['logType'])}
                    label="Log Type"
                  >
                    <MenuItem value="observation">Observation</MenuItem>
                    <MenuItem value="test_result">Test Result</MenuItem>
                    <MenuItem value="quality_check">Quality Check</MenuItem>
                    <MenuItem value="recommendation">Recommendation</MenuItem>
                    <MenuItem value="issue">Issue</MenuItem>
                    <MenuItem value="resolution">Resolution</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as OperatorLogEntry['priority'])}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSubmitObservation}
              disabled={!newObservation.trim() || isSubmitting}
              sx={{ mb: 2 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Observation'}
            </Button>
          </Box>
        </Box>
      )}

      {/* Edit Entry Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Log Entry</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Edit functionality would be implemented here for modifying existing log entries.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setEditDialogOpen(false)}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default OperatorExperienceLogSection;

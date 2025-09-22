// AIFindingsSection - Visualizes AI Analysis Data
// Genesis Reloop Logistics - Phase 5 Implementation

import React, { useState } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

import {
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  Timeline as TimelineIcon,
  Insights as InsightsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon,
  Memory as MemoryIcon,
  Waves as WavesIcon,
  Speed as SpeedIcon,
  Lightbulb as LightbulbIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

function AIFindingsSection({ aiAnalysis, onAnalysisUpdate }) {
  const [expandedPanel, setExpandedPanel] = useState('swi');
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const handleViewDetails = (analysisType, analysisData) => {
    setSelectedAnalysis({ type: analysisType, data: analysisData });
    setDetailDialog(true);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.7) return 'warning';
    return 'error';
  };

  const getRiskColor = (risk) => {
    const colors = {
      low: 'success',
      moderate: 'warning',
      high: 'error'
    };
    return colors[risk] || 'default';
  };

  if (!aiAnalysis) {
    return (
      <Alert severity="info">
        <Typography variant="h6">No AI Analysis Available</Typography>
        <Typography>AI analysis has not been performed for this target profile yet.</Typography>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Analysis Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="primary">
                    Analysis ID
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {aiAnalysis.analysis_id}
                  </Typography>
                </Box>
                <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="secondary">
                    Verification CI
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    {(aiAnalysis.verification_ci * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <SpeedIcon color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6">
                    Analysis Date
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(aiAnalysis.analysis_timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SWI Analysis Section */}
      <Accordion
        expanded={expandedPanel === 'swi'}
        onChange={handlePanelChange('swi')}
        elevation={2}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <PsychologyIcon color="primary" />
            <Box flexGrow={1}>
              <Typography variant="h6">
                Scalar Wave Intelligence (SWI) Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered consciousness analysis and recommendations
              </Typography>
            </Box>
            <Chip
              label={`Confidence: ${(aiAnalysis.swi_analysis.analysis_confidence * 100).toFixed(0)}%`}
              color={getConfidenceColor(aiAnalysis.swi_analysis.analysis_confidence)}
              size="small"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                <WavesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Scalar Wave Intelligence
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2">
                  {aiAnalysis.swi_analysis.scalar_wave_intelligence}
                </Typography>
              </Paper>

              <Typography variant="subtitle1" gutterBottom>
                <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                Probability Navigation
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2">
                  {aiAnalysis.swi_analysis.probability_navigation}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Harmonic Resonance Analysis
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2">
                  {aiAnalysis.swi_analysis.harmonic_resonance_analysis}
                </Typography>
              </Paper>

              <Typography variant="subtitle1" gutterBottom>
                Metrics
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Coherence Prediction"
                    secondary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress
                          variant="determinate"
                          value={aiAnalysis.swi_analysis.coherence_prediction * 100}
                          sx={{ flexGrow: 1, height: 6 }}
                          color={getScoreColor(aiAnalysis.swi_analysis.coherence_prediction)}
                        />
                        <Typography variant="body2">
                          {(aiAnalysis.swi_analysis.coherence_prediction * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Analysis Confidence"
                    secondary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress
                          variant="determinate"
                          value={aiAnalysis.swi_analysis.analysis_confidence * 100}
                          sx={{ flexGrow: 1, height: 6 }}
                          color={getConfidenceColor(aiAnalysis.swi_analysis.analysis_confidence)}
                        />
                        <Typography variant="body2">
                          {(aiAnalysis.swi_analysis.analysis_confidence * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </List>

              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewDetails('swi', aiAnalysis.swi_analysis)}
                sx={{ mt: 1 }}
              >
                View Full Analysis
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Probability Harmonic Analysis Section */}
      <Accordion
        expanded={expandedPanel === 'harmonic'}
        onChange={handlePanelChange('harmonic')}
        elevation={2}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <WavesIcon color="secondary" />
            <Box flexGrow={1}>
              <Typography variant="h6">
                Probability Harmonic Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Frequency analysis and harmonic resonance patterns
              </Typography>
            </Box>
            <Chip
              label={`CI: ${aiAnalysis.probability_harmonic_analysis.verification_ci.toFixed(3)}`}
              color={getScoreColor(aiAnalysis.probability_harmonic_analysis.verification_ci)}
              size="small"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Harmonic Frequencies (THz)
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Probability</TableCell>
                      <TableCell>Coherence</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {aiAnalysis.probability_harmonic_analysis.harmonic_frequencies.map((freq, index) => (
                      <TableRow key={index}>
                        <TableCell>{freq.toFixed(2)} THz</TableCell>
                        <TableCell>
                          {((aiAnalysis.probability_harmonic_analysis.probability_distribution[index] || 0) * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={(aiAnalysis.probability_harmonic_analysis.coherence_analysis[index] || 0).toFixed(3)}
                            color={getScoreColor(aiAnalysis.probability_harmonic_analysis.coherence_analysis[index] || 0)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Navigation Recommendations
              </Typography>
              <List dense>
                {aiAnalysis.probability_harmonic_analysis.navigation_recommendations.map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>

              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewDetails('harmonic', aiAnalysis.probability_harmonic_analysis)}
                sx={{ mt: 1 }}
              >
                View Detailed Analysis
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Target Profiling Analysis Section */}
      <Accordion
        expanded={expandedPanel === 'profiling'}
        onChange={handlePanelChange('profiling')}
        elevation={2}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <InsightsIcon color="success" />
            <Box flexGrow={1}>
              <Typography variant="h6">
                Target Profiling Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Business compatibility and success rate predictions
              </Typography>
            </Box>
            <Chip
              label={`Success Rate: ${(aiAnalysis.target_profiling.probability_success_rate * 100).toFixed(0)}%`}
              color={getScoreColor(aiAnalysis.target_profiling.probability_success_rate)}
              size="small"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Compatibility Scores
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Business Compatibility"
                    secondary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress
                          variant="determinate"
                          value={aiAnalysis.target_profiling.business_compatibility * 100}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          color={getScoreColor(aiAnalysis.target_profiling.business_compatibility)}
                        />
                        <Typography variant="body2">
                          {(aiAnalysis.target_profiling.business_compatibility * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Harmonic Resonance Score"
                    secondary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress
                          variant="determinate"
                          value={aiAnalysis.target_profiling.harmonic_resonance_score * 100}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          color={getScoreColor(aiAnalysis.target_profiling.harmonic_resonance_score)}
                        />
                        <Typography variant="body2">
                          {(aiAnalysis.target_profiling.harmonic_resonance_score * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Probability Success Rate"
                    secondary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress
                          variant="determinate"
                          value={aiAnalysis.target_profiling.probability_success_rate * 100}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          color={getScoreColor(aiAnalysis.target_profiling.probability_success_rate)}
                        />
                        <Typography variant="body2">
                          {(aiAnalysis.target_profiling.probability_success_rate * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recommended Approach
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2">
                  {aiAnalysis.target_profiling.recommended_approach}
                </Typography>
              </Paper>

              <Typography variant="subtitle1" gutterBottom>
                Analysis Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Analysis ID"
                    secondary={aiAnalysis.target_profiling.analysis_id}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Verification CI"
                    secondary={aiAnalysis.target_profiling.verification_ci.toFixed(3)}
                  />
                </ListItem>
              </List>

              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewDetails('profiling', aiAnalysis.target_profiling)}
                sx={{ mt: 1 }}
              >
                View Implementation Strategy
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Analysis Detail Dialog */}
      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedAnalysis && (
            <Box display="flex" alignItems="center" gap={2}>
              {selectedAnalysis.type === 'swi' && <PsychologyIcon />}
              {selectedAnalysis.type === 'harmonic' && <WavesIcon />}
              {selectedAnalysis.type === 'profiling' && <InsightsIcon />}
              <Typography variant="h6">
                {selectedAnalysis.type === 'swi' && 'SWI Analysis Details'}
                {selectedAnalysis.type === 'harmonic' && 'Harmonic Analysis Details'}
                {selectedAnalysis.type === 'profiling' && 'Target Profiling Details'}
              </Typography>
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedAnalysis && (
            <Box>
              {selectedAnalysis.type === 'swi' && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Analysis ID: {selectedAnalysis.data.analysis_id}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Burn Timestamp: {selectedAnalysis.data.burn_timestamp}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Scalar Wave Intelligence
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedAnalysis.data.scalar_wave_intelligence}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom>
                    Probability Navigation
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedAnalysis.data.probability_navigation}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom>
                    Harmonic Resonance Analysis
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedAnalysis.data.harmonic_resonance_analysis}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Coherence Prediction</Typography>
                      <Typography variant="h4" color="primary">
                        {(selectedAnalysis.data.coherence_prediction * 100).toFixed(1)}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Analysis Confidence</Typography>
                      <Typography variant="h4" color="secondary">
                        {(selectedAnalysis.data.analysis_confidence * 100).toFixed(1)}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {selectedAnalysis.type === 'harmonic' && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Analysis ID: {selectedAnalysis.data.analysis_id}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Verification CI: {selectedAnalysis.data.verification_ci.toFixed(3)}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Harmonic Frequency Analysis
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Frequency (THz)</TableCell>
                          <TableCell>Probability Distribution</TableCell>
                          <TableCell>Coherence Analysis</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedAnalysis.data.harmonic_frequencies.map((freq, index) => (
                          <TableRow key={index}>
                            <TableCell>{freq.toFixed(3)}</TableCell>
                            <TableCell>
                              {((selectedAnalysis.data.probability_distribution[index] || 0) * 100).toFixed(2)}%
                            </TableCell>
                            <TableCell>
                              {(selectedAnalysis.data.coherence_analysis[index] || 0).toFixed(3)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Navigation Recommendations
                  </Typography>
                  <List>
                    {selectedAnalysis.data.navigation_recommendations.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {selectedAnalysis.type === 'profiling' && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Analysis ID: {selectedAnalysis.data.analysis_id}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Verification CI: {selectedAnalysis.data.verification_ci.toFixed(3)}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Compatibility Metrics
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Business Compatibility"
                            secondary={`${(selectedAnalysis.data.business_compatibility * 100).toFixed(1)}%`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Harmonic Resonance Score"
                            secondary={`${(selectedAnalysis.data.harmonic_resonance_score * 100).toFixed(1)}%`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Probability Success Rate"
                            secondary={`${(selectedAnalysis.data.probability_success_rate * 100).toFixed(1)}%`}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Recommended Approach
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body2">
                          {selectedAnalysis.data.recommended_approach}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AIFindingsSection;

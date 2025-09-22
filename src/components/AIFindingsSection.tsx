// S-W-RLE-OS AI Findings (SWI) Section Component
// Genesis Reloop Logistics - Phase 5 REOP Integration
// Visualizes SWI service output with AI summary, viability score, and value streams

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material';

import {
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Waves as WavesIcon,
  Energy as EnergyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface SWIFindings {
  source: string;
  aiSummary: string;
  viabilityScore: number;
  confidenceScore: number;
  essenceVector: number[];
  potentialValueStreams: Array<{
    streamName: string;
    confidence: number;
    description: string;
    estimatedRevenue?: string;
    processingComplexity?: 'Low' | 'Medium' | 'High';
  }>;
  reopCompliance: {
    coherenceIndex: number;
    mathematicalFormalism: 'VALID' | 'INVALID';
    biochemicalShifts: {
      cortisolReduction: number;
      dopamineIncrease: number;
    };
    scalarPotential: number;
    gLoopCycle: 'STABLE' | 'UNSTABLE';
  };
  analysisTimestamp: string;
  burnTimestamp: string;
}

interface AIFindingsSectionProps {
  swiFindings: SWIFindings;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  onRefresh?: () => void;
  onEdit?: () => void;
  showActions?: boolean;
}

// Mock data for Grand Hotel Central SWI analysis
const mockSWIFindings: SWIFindings = {
  source: 'SWI via OpenRouter (gpt-4o-2024-08-06)',
  aiSummary: 'High potential target for standard UCO-to-Biodiesel transformation.',
  viabilityScore: 0.92,
  confidenceScore: 0.95,
  essenceVector: [0.89, 0.04, 0.02, 0.05, 0.12, 0.33, 0.21, 0.15],
  potentialValueStreams: [
    {
      streamName: 'UCO_to_Biodiesel',
      confidence: 0.95,
      description: 'High triglyceride content. Ideal case.',
      estimatedRevenue: '£1,200/month',
      processingComplexity: 'Low'
    },
    {
      streamName: 'UCO_to_Surfactants',
      confidence: 0.65,
      description: 'Possible, less economically viable.',
      estimatedRevenue: '£400/month',
      processingComplexity: 'Medium'
    },
    {
      streamName: 'UCO_to_Soap_Production',
      confidence: 0.78,
      description: 'Good potential for artisanal soap production.',
      estimatedRevenue: '£600/month',
      processingComplexity: 'Medium'
    },
    {
      streamName: 'UCO_to_Animal_Feed',
      confidence: 0.45,
      description: 'Requires extensive purification. Not recommended.',
      estimatedRevenue: '£200/month',
      processingComplexity: 'High'
    }
  ],
  reopCompliance: {
    coherenceIndex: 0.88,
    mathematicalFormalism: 'VALID',
    biochemicalShifts: {
      cortisolReduction: 0.543,
      dopamineIncrease: 0.37
    },
    scalarPotential: 0.92,
    gLoopCycle: 'STABLE'
  },
  analysisTimestamp: '2025-09-20T11:30:00Z',
  burnTimestamp: 'burn_swi_001_20250920_113000@reop.verification'
};

function AIFindingsSection({ 
  swiFindings = mockSWIFindings, 
  isExpanded = true, 
  onToggleExpanded,
  onRefresh,
  onEdit,
  showActions = true 
}: AIFindingsSectionProps) {
  const getViabilityColor = (score: number) => {
    if (score >= 0.9) return 'success';
    if (score >= 0.8) return 'info';
    if (score >= 0.7) return 'warning';
    return 'error';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.8) return 'info';
    if (confidence >= 0.7) return 'warning';
    return 'error';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };

  const renderEssenceVectorBar = (value: number, label: string, index: number) => {
    const barWidth = Math.max(value * 20, 2); // Minimum 2 characters
    const bar = '█'.repeat(Math.floor(barWidth)) + '▏'.repeat(Math.floor((barWidth % 1) * 8));
    const spaces = ' '.repeat(Math.max(0, 20 - bar.length));
    
    return (
      <Box key={index} sx={{ mb: 1 }}>
        <Typography variant="body2" sx={{ mb: 0.5, fontFamily: 'monospace' }}>
          {label.padEnd(15)} [{bar}{spaces}]
        </Typography>
      </Box>
    );
  };

  const essenceVectorLabels = [
    'Triglyceride',
    'Free Fatty Acid',
    'Water',
    'Contaminants',
    'Potential',
    'Coherence',
    'Resonance',
    'Stability'
  ];

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
          <WavesIcon color="secondary" />
          <Typography variant="h6" component="h3">
            SCALAR WAVE INTELLIGENCE (SWI) FINDINGS
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {showActions && (
            <>
              <Tooltip title="Refresh Analysis">
                <IconButton size="small" onClick={onRefresh}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Analysis">
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
          {/* Source Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Source: {swiFindings.source}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Analysis Timestamp: {new Date(swiFindings.analysisTimestamp).toLocaleString()}
            </Typography>
          </Box>

          {/* AI Summary */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              **AI Summary**
            </Typography>
            <Alert severity="info" sx={{ fontStyle: 'italic' }}>
              {swiFindings.aiSummary}
            </Alert>
          </Box>

          {/* Viability Score */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              **Viability Score: {(swiFindings.viabilityScore * 100).toFixed(0)}%**
            </Typography>
            <LinearProgress
              variant="determinate"
              value={swiFindings.viabilityScore * 100}
              sx={{
                height: 20,
                borderRadius: 10,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getViabilityColor(swiFindings.viabilityScore) === 'success' ? '#4caf50' :
                                 getViabilityColor(swiFindings.viabilityScore) === 'info' ? '#2196f3' :
                                 getViabilityColor(swiFindings.viabilityScore) === 'warning' ? '#ff9800' : '#f44336',
                  borderRadius: 10
                }
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Confidence: {(swiFindings.confidenceScore * 100).toFixed(0)}%
            </Typography>
          </Box>

          {/* Essence Vector Visualization */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              **Essence Vector (Normalized Visualization)**
            </Typography>
            <Box sx={{ 
              backgroundColor: '#f8f9fa', 
              p: 2, 
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}>
              {swiFindings.essenceVector.slice(0, 8).map((value, index) => 
                renderEssenceVectorBar(value, essenceVectorLabels[index], index)
              )}
            </Box>
          </Box>

          {/* REOP Compliance */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              **REOP Compliance**
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h6" color="success.main">
                      {(swiFindings.reopCompliance.coherenceIndex * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Coherence Index
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <ScienceIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h6" color="primary">
                      {swiFindings.reopCompliance.mathematicalFormalism}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mathematical Formalism
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon color="info" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h6" color="info.main">
                      ↓{(swiFindings.reopCompliance.biochemicalShifts.cortisolReduction * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cortisol Reduction
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h6" color="success.main">
                      ↑{(swiFindings.reopCompliance.biochemicalShifts.dopamineIncrease * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dopamine Increase
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Potential Value Streams */}
          <Box>
            <Typography variant="h6" gutterBottom>
              **Potential Value Streams**
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Stream Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Confidence</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Revenue</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Complexity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {swiFindings.potentialValueStreams.map((stream, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <EnergyIcon color="primary" />
                          <Typography variant="body2" fontWeight="medium">
                            {stream.streamName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${(stream.confidence * 100).toFixed(0)}%`}
                          color={getConfidenceColor(stream.confidence)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {stream.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {stream.estimatedRevenue || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={stream.processingComplexity || 'N/A'}
                          color={getComplexityColor(stream.processingComplexity || '')}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Burn Timestamp */}
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="caption" color="text.secondary">
              Burn Timestamp: {swiFindings.burnTimestamp}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

export default AIFindingsSection;

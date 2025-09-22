import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Science as ScienceIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import { HarmonicTarget, TargetSpecificProtocol } from '../types';
import { targetSpecificProtocols } from '../data/sampleData';

interface ProtocolViewerProps {
  selectedTarget: HarmonicTarget | null;
}

const ProtocolViewer: React.FC<ProtocolViewerProps> = ({ selectedTarget }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const getProtocol = (targetType: string): TargetSpecificProtocol | null => {
    return targetSpecificProtocols[targetType] || null;
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

  const getVerificationStatus = (metric: string, currentValue?: number) => {
    // Simulate verification status based on metric type
    if (metric.includes('>')) {
      const threshold = parseFloat(metric.match(/\d+\.?\d*/)?.[0] || '0');
      const simulatedValue = currentValue || (threshold + Math.random() * 0.1);
      return {
        status: simulatedValue >= threshold ? 'pass' : 'fail',
        value: simulatedValue,
        threshold: threshold,
      };
    }
    return { status: 'unknown', value: 0, threshold: 0 };
  };

  const protocol = selectedTarget ? getProtocol(selectedTarget.target_type) : null;

  if (!selectedTarget) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <ScienceIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Select a harmonic target to view its transformation protocol
        </Typography>
      </Paper>
    );
  }

  if (!protocol) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <WarningIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
        <Typography variant="h6" color="warning.main">
          No protocol found for target type: {selectedTarget.target_type}
        </Typography>
      </Paper>
    );
  }

  const steps = [
    'Initialize System',
    'Load Substrate',
    'Apply GSWC Field',
    'Execute Transformation',
    'Verify Output',
    'Complete Process',
  ];

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
              <ScienceIcon sx={{ mr: 1 }} />
              {protocol.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Target: {selectedTarget.target_name || selectedTarget.target_id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={isRunning ? <PauseIcon /> : <PlayIcon />}
              onClick={() => setIsRunning(!isRunning)}
              color={isRunning ? 'warning' : 'success'}
            >
              {isRunning ? 'Pause' : 'Start'} Protocol
            </Button>
            <Button
              variant="outlined"
              startIcon={<StopIcon />}
              onClick={() => setIsRunning(false)}
              disabled={!isRunning}
            >
              Stop
            </Button>
          </Box>
        </Box>

        <Chip
          label={selectedTarget.target_type.replace(/_/g, ' ')}
          sx={{
            backgroundColor: getTargetTypeColor(selectedTarget.target_type),
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {/* Protocol Steps */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <PlayIcon sx={{ mr: 1 }} />
              Protocol Execution Steps
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    optional={
                      index === steps.length - 1 ? (
                        <Typography variant="caption">Final step</Typography>
                      ) : null
                    }
                  >
                    {label}
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      {index === 0 && 'Initializing scalar wave field generators and safety systems...'}
                      {index === 1 && 'Loading waste substrate into Genesis Forge containment chamber...'}
                      {index === 2 && 'Applying GSWC catalytic field with optimized parameters...'}
                      {index === 3 && 'Executing transformation process with real-time monitoring...'}
                      {index === 4 && 'Verifying output quality and GSWT eligibility...'}
                      {index === 5 && 'Completing process and preparing for next cycle...'}
                    </Typography>
                    <Box sx={{ mb: 2, mt: 1 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => setActiveStep(index + 1)}
                          sx={{ mt: 1, mr: 1 }}
                          disabled={!isRunning}
                        >
                          {index === steps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={() => setActiveStep(index - 1)}
                          sx={{ mt: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        {/* Mathematical Process Flow */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CodeIcon sx={{ mr: 1 }} />
              Mathematical Process Flow
            </Typography>
            <Box
              sx={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                p: 2,
                borderRadius: 2,
                border: '1px solid rgba(0,255,136,0.2)',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
              }}
            >
              {protocol.mathematical_process_flow}
            </Box>
          </Paper>
        </Grid>

        {/* GSWC Equation */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ScienceIcon sx={{ mr: 1 }} />
              GSWC Transformation Equation
            </Typography>
            <Box
              sx={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                p: 3,
                borderRadius: 2,
                border: '1px solid rgba(0,255,136,0.2)',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                color: 'primary.main',
                fontWeight: 'bold',
              }}
            >
              {protocol.gswc_equation}
            </Box>
          </Paper>
        </Grid>

        {/* Hardware Components */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <SettingsIcon sx={{ mr: 1 }} />
              Required Hardware Components
            </Typography>
            <List>
              {protocol.required_hardware_components.map((component, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={component}
                    secondary={`Component ${index + 1} of ${protocol.required_hardware_components.length}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Verification Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              Verification Metrics
            </Typography>
            <List>
              {protocol.specific_verification_metrics.map((metric, index) => {
                const verification = getVerificationStatus(metric);
                return (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {verification.status === 'pass' ? (
                        <CheckCircleIcon color="success" />
                      ) : verification.status === 'fail' ? (
                        <WarningIcon color="error" />
                      ) : (
                        <InfoIcon color="info" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={metric}
                      secondary={
                        verification.status !== 'unknown' ? (
                          `Current: ${verification.value.toFixed(3)} | Target: ${verification.threshold}`
                        ) : 'Status unknown'
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* GSWT Conversion Rate */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>GSWT Conversion Rate</AlertTitle>
            {protocol.gswt_conversion_rate}
          </Alert>
        </Grid>

        {/* Real-time Monitoring */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Real-time Protocol Monitoring
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary.main">
                    {isRunning ? '85.2%' : '0%'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completion
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main">
                    {isRunning ? '0.847' : '0.000'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Coherence Index
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main">
                    {isRunning ? '98.7%' : '0%'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Efficiency
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="info.main">
                    {isRunning ? '2.4 THz' : '0 THz'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Field Frequency
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProtocolViewer;

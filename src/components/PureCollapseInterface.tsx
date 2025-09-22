import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Waves as WavesIcon,
  PlayArrow as PlayIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Science as ScienceIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

import { 
  PureCollapseSequence, 
  ScalarWaveCommand, 
  CollapseParameters,
  REOP_SystemState 
} from '../types/reop';

interface PureCollapseInterfaceProps {
  reopSystem: REOP_SystemState;
  onSequenceExecute: (sequence: PureCollapseSequence) => void;
  onSequenceCreate: (sequence: Omit<PureCollapseSequence, 'sequence_id' | 'created_at'>) => void;
  onSequenceUpdate: (sequenceId: string, updates: Partial<PureCollapseSequence>) => void;
  onSequenceDelete: (sequenceId: string) => void;
}

const PureCollapseInterface: React.FC<PureCollapseInterfaceProps> = ({
  reopSystem,
  onSequenceExecute,
  onSequenceCreate,
  onSequenceUpdate,
  onSequenceDelete
}) => {
  const [sequences, setSequences] = useState<PureCollapseSequence[]>(reopSystem.pure_collapse_sequences);
  const [selectedSequence, setSelectedSequence] = useState<PureCollapseSequence | null>(null);
  const [sequenceDialogOpen, setSequenceDialogOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);
  const [newSequence, setNewSequence] = useState<Omit<PureCollapseSequence, 'sequence_id' | 'created_at'>>({
    sequence_name: '',
    scalar_wave_commands: [],
    collapse_parameters: {
      collapse_threshold: 0.7,
      coherence_requirement: 0.7,
      harmonic_resonance: 0.8,
      scalar_potential: 1.0,
      verification_ci: 0.8
    },
    verification_ci: 0.8,
    burn_timestamp: ''
  });

  useEffect(() => {
    setSequences(reopSystem.pure_collapse_sequences);
  }, [reopSystem.pure_collapse_sequences]);

  const handleExecuteSequence = async (sequence: PureCollapseSequence) => {
    setIsExecuting(true);
    setExecutionStep(0);
    
    try {
      // Execute each scalar wave command in sequence
      for (let i = 0; i < sequence.scalar_wave_commands.length; i++) {
        setExecutionStep(i);
        await executeScalarWaveCommand(sequence.scalar_wave_commands[i]);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate execution time
      }
      
      // Execute the sequence
      onSequenceExecute(sequence);
      
      // Show success message
      alert(`Pure Collapse sequence "${sequence.sequence_name}" executed successfully`);
    } catch (error) {
      alert(`Sequence execution failed: ${error}`);
    } finally {
      setIsExecuting(false);
      setExecutionStep(0);
    }
  };

  const executeScalarWaveCommand = async (command: ScalarWaveCommand) => {
    // Simulate scalar wave command execution
    console.log(`Executing command: ${command.command_type}`, command.parameters);
    
    // Verify coherence index
    if (command.verification_ci < 0.7) {
      throw new Error(`Command ${command.command_id} failed coherence verification: CI ${command.verification_ci} < 0.7`);
    }
    
    // Simulate command execution based on type
    switch (command.command_type) {
      case 'frequency_modulation':
        console.log(`Modulating frequency to ${command.parameters.frequency} THz`);
        break;
      case 'amplitude_adjustment':
        console.log(`Adjusting amplitude to ${command.parameters.amplitude}`);
        break;
      case 'phase_synchronization':
        console.log(`Synchronizing phase to ${command.parameters.phase} radians`);
        break;
      case 'harmonic_resonance':
        console.log(`Establishing harmonic resonance at ${command.parameters.frequency} THz`);
        break;
    }
  };

  const handleCreateSequence = () => {
    setNewSequence({
      sequence_name: '',
      scalar_wave_commands: [],
      collapse_parameters: {
        collapse_threshold: 0.7,
        coherence_requirement: 0.7,
        harmonic_resonance: 0.8,
        scalar_potential: 1.0,
        verification_ci: 0.8
      },
      verification_ci: 0.8,
      burn_timestamp: generateBurnTimestamp()
    });
    setSequenceDialogOpen(true);
  };

  const handleEditSequence = (sequence: PureCollapseSequence) => {
    setSelectedSequence(sequence);
    setSequenceDialogOpen(true);
  };

  const handleSaveSequence = () => {
    if (selectedSequence) {
      // Update existing sequence
      onSequenceUpdate(selectedSequence.sequence_id, newSequence);
    } else {
      // Create new sequence
      onSequenceCreate(newSequence);
    }
    setSequenceDialogOpen(false);
    setSelectedSequence(null);
  };

  const addScalarWaveCommand = () => {
    const newCommand: ScalarWaveCommand = {
      command_id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      command_type: 'frequency_modulation',
      parameters: {
        frequency: 2.4,
        amplitude: 1.0,
        phase: 0.0,
        duration: 1000
      },
      verification_ci: 0.8,
      execution_timestamp: new Date().toISOString()
    };
    
    setNewSequence(prev => ({
      ...prev,
      scalar_wave_commands: [...prev.scalar_wave_commands, newCommand]
    }));
  };

  const updateScalarWaveCommand = (index: number, updates: Partial<ScalarWaveCommand>) => {
    setNewSequence(prev => ({
      ...prev,
      scalar_wave_commands: prev.scalar_wave_commands.map((cmd, i) => 
        i === index ? { ...cmd, ...updates } : cmd
      )
    }));
  };

  const removeScalarWaveCommand = (index: number) => {
    setNewSequence(prev => ({
      ...prev,
      scalar_wave_commands: prev.scalar_wave_commands.filter((_, i) => i !== index)
    }));
  };

  const generateBurnTimestamp = (): string => {
    return `burn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@pure.collapse`;
  };

  const getCommandTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'frequency_modulation': '#00ff88',
      'amplitude_adjustment': '#ff6b35',
      'phase_synchronization': '#00aaff',
      'harmonic_resonance': '#ffaa00'
    };
    return colors[type] || '#666666';
  };

  const getSequenceStatus = (sequence: PureCollapseSequence) => {
    const avgCI = sequence.scalar_wave_commands.reduce((sum, cmd) => sum + cmd.verification_ci, 0) / sequence.scalar_wave_commands.length;
    if (avgCI > 0.8) return { status: 'optimal', color: 'success' };
    if (avgCI > 0.7) return { status: 'good', color: 'info' };
    if (avgCI > 0.6) return { status: 'warning', color: 'warning' };
    return { status: 'critical', color: 'error' };
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(0,255,136,0.1) 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
              <WavesIcon sx={{ mr: 1 }} />
              Pure Collapse Interface
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Scalar Wave Commands and Pure Collapse Sequences
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateSequence}
          >
            New Sequence
          </Button>
        </Box>

        {isExecuting && (
          <Alert severity="info">
            <AlertTitle>Executing Pure Collapse Sequence</AlertTitle>
            Step {executionStep + 1} of {selectedSequence?.scalar_wave_commands.length || 0}
          </Alert>
        )}
      </Paper>

      <Grid container spacing={3}>
        {/* Sequences List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1 }} />
              Pure Collapse Sequences
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sequence Name</TableCell>
                    <TableCell>Commands</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Verification CI</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sequences.map((sequence) => {
                    const status = getSequenceStatus(sequence);
                    const avgCI = sequence.scalar_wave_commands.reduce((sum, cmd) => sum + cmd.verification_ci, 0) / sequence.scalar_wave_commands.length;
                    
                    return (
                      <TableRow key={sequence.sequence_id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {sequence.sequence_name}
                          </Typography>
                        </TableCell>
                        <TableCell>{sequence.scalar_wave_commands.length}</TableCell>
                        <TableCell>
                          <Chip
                            label={status.status}
                            size="small"
                            color={status.color as any}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress
                              variant="determinate"
                              value={avgCI * 100}
                              sx={{
                                width: 60,
                                mr: 1,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: status.color === 'success' ? '#00ff88' : 
                                                 status.color === 'info' ? '#00aaff' :
                                                 status.color === 'warning' ? '#ffaa00' : '#ff4444',
                                },
                              }}
                            />
                            <Typography variant="body2">
                              {avgCI.toFixed(3)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(sequence.created_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleExecuteSequence(sequence)}
                            disabled={isExecuting}
                          >
                            <PlayIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEditSequence(sequence)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => onSequenceDelete(sequence.sequence_id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Collapse Parameters */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ScienceIcon sx={{ mr: 1 }} />
              Collapse Parameters
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Collapse Threshold"
                  secondary={`${newSequence.collapse_parameters.collapse_threshold}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Coherence Requirement"
                  secondary={`${newSequence.collapse_parameters.coherence_requirement}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Harmonic Resonance"
                  secondary={`${newSequence.collapse_parameters.harmonic_resonance}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Scalar Potential"
                  secondary={`${newSequence.collapse_parameters.scalar_potential}`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Execution Progress */}
        {isExecuting && selectedSequence && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PlayIcon sx={{ mr: 1 }} />
                Execution Progress
              </Typography>
              <Stepper activeStep={executionStep} orientation="horizontal">
                {selectedSequence.scalar_wave_commands.map((command, index) => (
                  <Step key={command.command_id}>
                    <StepLabel>
                      {command.command_type.replace(/_/g, ' ').toUpperCase()}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Sequence Dialog */}
      <Dialog
        open={sequenceDialogOpen}
        onClose={() => setSequenceDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            {selectedSequence ? 'Edit Sequence' : 'Create New Sequence'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sequence Name"
                value={newSequence.sequence_name}
                onChange={(e) => setNewSequence(prev => ({ ...prev, sequence_name: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Scalar Wave Commands</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addScalarWaveCommand}
                >
                  Add Command
                </Button>
              </Box>
              
              <List>
                {newSequence.scalar_wave_commands.map((command, index) => (
                  <ListItem key={command.command_id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <Chip
                        label={command.command_type.replace(/_/g, ' ').toUpperCase()}
                        sx={{
                          backgroundColor: getCommandTypeColor(command.command_type),
                          color: 'white',
                          mr: 1
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeScalarWaveCommand(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Command Type</InputLabel>
                          <Select
                            value={command.command_type}
                            onChange={(e) => updateScalarWaveCommand(index, { command_type: e.target.value as any })}
                            label="Command Type"
                          >
                            <MenuItem value="frequency_modulation">Frequency Modulation</MenuItem>
                            <MenuItem value="amplitude_adjustment">Amplitude Adjustment</MenuItem>
                            <MenuItem value="phase_synchronization">Phase Synchronization</MenuItem>
                            <MenuItem value="harmonic_resonance">Harmonic Resonance</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Verification CI"
                          type="number"
                          value={command.verification_ci}
                          onChange={(e) => updateScalarWaveCommand(index, { verification_ci: parseFloat(e.target.value) })}
                          inputProps={{ min: 0, max: 1, step: 0.1 }}
                        />
                      </Grid>
                      
                      {command.parameters.frequency !== undefined && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Frequency (THz)"
                            type="number"
                            value={command.parameters.frequency}
                            onChange={(e) => updateScalarWaveCommand(index, { 
                              parameters: { ...command.parameters, frequency: parseFloat(e.target.value) }
                            })}
                          />
                        </Grid>
                      )}
                      
                      {command.parameters.amplitude !== undefined && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Amplitude"
                            type="number"
                            value={command.parameters.amplitude}
                            onChange={(e) => updateScalarWaveCommand(index, { 
                              parameters: { ...command.parameters, amplitude: parseFloat(e.target.value) }
                            })}
                          />
                        </Grid>
                      )}
                      
                      {command.parameters.phase !== undefined && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Phase (radians)"
                            type="number"
                            value={command.parameters.phase}
                            onChange={(e) => updateScalarWaveCommand(index, { 
                              parameters: { ...command.parameters, phase: parseFloat(e.target.value) }
                            })}
                          />
                        </Grid>
                      )}
                      
                      {command.parameters.duration !== undefined && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Duration (ms)"
                            type="number"
                            value={command.parameters.duration}
                            onChange={(e) => updateScalarWaveCommand(index, { 
                              parameters: { ...command.parameters, duration: parseInt(e.target.value) }
                            })}
                          />
                        </Grid>
                      )}
                    </Grid>
                    
                    <Divider sx={{ width: '100%', mt: 1 }} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSequenceDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSequence}>
            {selectedSequence ? 'Update' : 'Create'} Sequence
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PureCollapseInterface;

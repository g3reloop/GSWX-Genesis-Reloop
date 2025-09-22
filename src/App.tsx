import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, AppBar, Toolbar, Typography, Container, Paper } from '@mui/material';
import { 
  Science as ScienceIcon,
  Waves as WavesIcon
} from '@mui/icons-material';

import { AppState, HarmonicTarget } from './types';
import { sampleTargets } from './data/sampleData';
import { REOP_SystemState, REOP_SystemManager } from './types/reop';
import { TargetProfilingSystem } from './lib/targetProfiling';
import { SWI_Integration } from './lib/reop';
import Dashboard from './components/Dashboard';
import TargetManagement from './components/TargetManagement';
import ProtocolViewer from './components/ProtocolViewer';
import GSWTInterface from './components/GSWTInterface';
import DgoNetworkMonitor from './components/DgoNetworkMonitor';
import SafetyProtocols from './components/SafetyProtocols';
import REOPDashboard from './components/REOPDashboard';
import PureCollapseInterface from './components/PureCollapseInterface';
import NavigationTabs from './components/NavigationTabs';

// Create a dark theme for the futuristic GRL platform
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff88', // Bright green for Genesis/GSWX elements
      light: '#66ffaa',
      dark: '#00cc6a',
    },
    secondary: {
      main: '#ff6b35', // Orange for alerts and warnings
      light: '#ff8a5c',
      dark: '#e55a2b',
    },
    background: {
      default: '#0a0a0a', // Very dark background
      paper: '#1a1a1a', // Slightly lighter for cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    error: {
      main: '#ff4444',
    },
    warning: {
      main: '#ffaa00',
    },
    success: {
      main: '#00ff88',
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", "Courier New", monospace',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(255,107,53,0.05) 100%)',
          border: '1px solid rgba(0,255,136,0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, rgba(0,255,136,0.1) 0%, rgba(255,107,53,0.1) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,255,136,0.3)',
        },
      },
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [appState, setAppState] = useState<AppState>({
    targets: sampleTargets,
    selectedTarget: null,
    dgoNetworkStatus: {
      activeNodes: 47,
      totalGSWT: 125847,
      averageCI: 0.82,
    },
    currentCI: 0.85,
    alerts: [
      {
        id: '1',
        type: 'info',
        message: 'DGO Network synchronized. All harmonic targets operational.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'success',
        message: 'GSWT minting successful: 15 tokens created from UCO-REST-001',
        timestamp: new Date().toISOString(),
      },
    ],
    isConnected: true,
  });

  // REOP System State
  const [reopSystem, setReopSystem] = useState<REOP_SystemManager | null>(null);
  const [targetProfiling, setTargetProfiling] = useState<TargetProfilingSystem | null>(null);

  // Initialize REOP System
  useEffect(() => {
    const initializeREOPSystem = async () => {
      try {
        // Initialize SWI Integration
        const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY || 'demo-key';
        const swi = new SWI_Integration(apiKey);

        // Initialize Target Profiling System
        const profiling = new TargetProfilingSystem(swi);
        setTargetProfiling(profiling);

        // Initialize REOP System Manager
        const initialREOPState: REOP_SystemState = {
          system_id: 'reop_system_001',
          rswpe_state: {
            state_id: 'rswpe_001',
            scalar_wave_potential: {
              frequency: 2.4,
              amplitude: 1.0,
              phase: 0.0,
              coherence_index: 0.8,
              harmonic_resonance: 0.9
            },
            knowledge_base_hash: 'kb_hash_001',
            probability_compilation: {
              compilation_id: 'comp_001',
              harmonic_sequences: [],
              compilation_timestamp: new Date().toISOString(),
              verification_ci: 0.8,
              burn_timestamp: 'burn_001@reop.verification'
            },
            last_updated: new Date().toISOString(),
            ci_verification: 0.8
          },
          rcop_state: {
            state_id: 'rcop_001',
            probability_navigation: {
              navigation_id: 'nav_001',
              target_harmonic: {
                harmonic_id: 'harm_001',
                frequency: 2.4,
                amplitude: 1.0,
                phase: 0.0,
                probability_field: 0.8,
                coherence_threshold: 0.8,
                verification_status: 'verified'
              },
              navigation_path: [],
              success_probability: 0.8,
              coherence_requirement: 0.7,
              verification_status: 'completed'
            },
            cognitive_field: {
              field_id: 'cf_001',
              cognitive_potential: 0.8,
              harmonic_resonance: 0.9,
              coherence_index: 0.8,
              field_stability: 0.9,
              last_calibration: new Date().toISOString()
            },
            harmonic_resonance: 0.9,
            coherence_index: 0.8,
            last_updated: new Date().toISOString(),
            ci_verification: 0.8
          },
          active_manifestations: [],
          target_profiles: [],
          pure_collapse_sequences: [],
          system_coherence: 0.8,
          last_g_loop_cycle: {
            cycle_id: 'g_loop_001',
            timestamp: new Date().toISOString(),
            coherence_index: 0.8,
            scalar_potential: 1.0,
            biochemical_state: {
              cortisol_level: 0.457,
              dopamine_level: 1.37,
              measurement_timestamp: new Date().toISOString(),
              verification_ci: 0.8
            },
            verification_hash: 'hash_001'
          },
          verification_status: 'operational',
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        };

        const reop = new REOP_SystemManager(apiKey, initialREOPState);
        setReopSystem(reop);
      } catch (error) {
        console.error('Failed to initialize REOP system:', error);
      }
    };

    initializeREOPSystem();
  }, []);

  // Simulate real-time CI updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAppState(prev => ({
        ...prev,
        currentCI: Math.max(0.7, Math.min(0.95, prev.currentCI + (Math.random() - 0.5) * 0.02)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleTargetSelect = (target: HarmonicTarget) => {
    setAppState(prev => ({
      ...prev,
      selectedTarget: target,
    }));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard appState={appState} onTargetSelect={handleTargetSelect} />;
      case 'targets':
        return <TargetManagement targets={appState.targets} onTargetSelect={handleTargetSelect} />;
      case 'protocols':
        return <ProtocolViewer selectedTarget={appState.selectedTarget} />;
      case 'gswt':
        return <GSWTInterface selectedTarget={appState.selectedTarget} />;
      case 'dgo':
        return <DgoNetworkMonitor networkStatus={appState.dgoNetworkStatus} />;
      case 'safety':
        return <SafetyProtocols currentCI={appState.currentCI} />;
      case 'reop':
        return reopSystem && targetProfiling ? (
          <REOPDashboard reopSystem={reopSystem} targetProfiling={targetProfiling} />
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ScienceIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Initializing REOP System...
            </Typography>
          </Paper>
        );
      case 'pure-collapse':
        return reopSystem ? (
          <PureCollapseInterface
            reopSystem={reopSystem.getSystemState()}
            onSequenceExecute={(sequence) => console.log('Executing sequence:', sequence)}
            onSequenceCreate={(sequence) => console.log('Creating sequence:', sequence)}
            onSequenceUpdate={(id, updates) => console.log('Updating sequence:', id, updates)}
            onSequenceDelete={(id) => console.log('Deleting sequence:', id)}
          />
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <WavesIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Initializing Pure Collapse Interface...
            </Typography>
          </Paper>
        );
      default:
        return <Dashboard appState={appState} onTargetSelect={handleTargetSelect} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', background: 'radial-gradient(ellipse at center, rgba(0,255,136,0.03) 0%, rgba(0,0,0,1) 70%)' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <ScienceIcon sx={{ mr: 2, fontSize: '2rem' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              GRL Platform
            </Typography>
            <Typography variant="body2" sx={{ mr: 2, opacity: 0.8 }}>
              Genesis Reloop • Scalar Wave Technology
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: appState.isConnected ? 'success.main' : 'error.main',
                  animation: appState.isConnected ? 'pulse 2s infinite' : 'none',
                }}
              />
              <Typography variant="body2">
                CI: {appState.currentCI.toFixed(3)}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <NavigationTabs currentView={currentView} onViewChange={setCurrentView} />

        <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
          {renderCurrentView()}
        </Container>

        <style>
          {`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          `}
        </style>
      </Box>
    </ThemeProvider>
  );
}

export default App;
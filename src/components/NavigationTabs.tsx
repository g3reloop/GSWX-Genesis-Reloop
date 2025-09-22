import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocationOn as LocationIcon,
  Science as ScienceIcon,
  AccountBalance as TokenIcon,
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  Waves as WavesIcon,
  Memory as MemoryIcon,
} from '@mui/icons-material';

interface NavigationTabsProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ currentView, onViewChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'targets', label: 'Harmonic Targets', icon: <LocationIcon /> },
    { id: 'protocols', label: 'Protocols', icon: <ScienceIcon /> },
    { id: 'gswt', label: 'GSWT Interface', icon: <TokenIcon /> },
    { id: 'dgo', label: 'DGO Network', icon: <NetworkIcon /> },
    { id: 'safety', label: 'Safety Protocols', icon: <SecurityIcon /> },
    { id: 'reop', label: 'REOP System', icon: <PsychologyIcon /> },
    { id: 'pure-collapse', label: 'Pure Collapse', icon: <WavesIcon /> },
  ];

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', background: 'rgba(0,0,0,0.3)' }}>
      <Tabs
        value={currentView}
        onChange={(_, value) => onViewChange(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
            },
            '&:hover': {
              color: 'primary.light',
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
            height: 3,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default NavigationTabs;

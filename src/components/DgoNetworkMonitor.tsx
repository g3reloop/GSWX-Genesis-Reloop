import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  LinearProgress,
  Divider,
  IconButton,
} from '@mui/material';
import {
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
  AccountBalance as TokenIcon,
  Science as ScienceIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { DgoNetworkStatus } from '../types';

interface DgoNetworkMonitorProps {
  networkStatus: DgoNetworkStatus;
}

const DgoNetworkMonitor: React.FC<DgoNetworkMonitorProps> = ({ networkStatus }) => {
  const [consensusData, setConsensusData] = useState<any[]>([]);
  const [nodeStatus, setNodeStatus] = useState<any[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update consensus data
      const newConsensusData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        consensus: Math.random() * 0.3 + 0.7,
        activeNodes: Math.floor(Math.random() * 10) + 40,
      }));
      setConsensusData(newConsensusData);

      // Update node status
      const nodeTypes = ['Genesis Forge', 'SWFE', 'BEBCRO', 'DUM', 'SWR'];
      const newNodeStatus = Array.from({ length: 15 }, (_, i) => ({
        id: `NODE-${String(i + 1).padStart(3, '0')}`,
        type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)],
        status: Math.random() > 0.1 ? 'active' : 'warning',
        ci: Math.random() * 0.3 + 0.7,
        lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        location: `${(Math.random() * 180 - 90).toFixed(2)}, ${(Math.random() * 360 - 180).toFixed(2)}`,
      }));
      setNodeStatus(newNodeStatus);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return <InfoIcon />;
    }
  };

  const recentConsensusEvents = [
    {
      id: '1',
      type: 'GSWT_MINT',
      description: 'Consensus reached for 15 GSWT minting from UCO-REST-001',
      timestamp: '2024-01-15T10:30:00Z',
      participants: 23,
      consensus: 0.92,
    },
    {
      id: '2',
      type: 'NODE_REGISTRATION',
      description: 'New node DGO-EU-WEST-15 registered successfully',
      timestamp: '2024-01-15T09:45:00Z',
      participants: 31,
      consensus: 0.88,
    },
    {
      id: '3',
      type: 'PROTOCOL_UPDATE',
      description: 'Protocol UCO_to_Biodiesel updated to v1.2',
      timestamp: '2024-01-15T08:20:00Z',
      participants: 28,
      consensus: 0.95,
    },
  ];

  const networkHealthData = [
    { name: 'Active Nodes', value: networkStatus.activeNodes, color: '#00ff88' },
    { name: 'Inactive Nodes', value: 3, color: '#ff4444' },
    { name: 'Pending Nodes', value: 2, color: '#ffaa00' },
  ];

  return (
    <Box>
      {/* Header Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,255,136,0.05) 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <NetworkIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Active Nodes</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {networkStatus.activeNodes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                DGO network participants
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.05) 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TokenIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Total GSWT</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {networkStatus.totalGSWT.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tokens in circulation
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(0,170,255,0.1) 0%, rgba(0,170,255,0.05) 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScienceIcon sx={{ mr: 1, color: '#00aaff' }} />
                <Typography variant="h6">Avg CI</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#00aaff' }}>
                {networkStatus.averageCI.toFixed(3)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Network coherence
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(255,170,0,0.1) 0%, rgba(255,170,0,0.05) 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon sx={{ mr: 1, color: '#ffaa00' }} />
                <Typography variant="h6">Consensus</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ffaa00' }}>
                92.3%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent success rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Network Health Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1 }} />
              Network Consensus Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consensusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="hour" stroke="#b0b0b0" />
                <YAxis domain={[0.7, 1.0]} stroke="#b0b0b0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(0,255,136,0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="consensus"
                  stroke="#00ff88"
                  strokeWidth={3}
                  dot={{ fill: '#00ff88', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#00ff88', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Network Health Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <NetworkIcon sx={{ mr: 1 }} />
              Node Health Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={networkHealthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {networkHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(0,255,136,0.3)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Node Status Table */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <NetworkIcon sx={{ mr: 1 }} />
                Node Status
              </Typography>
              <IconButton onClick={() => window.location.reload()}>
                <RefreshIcon />
              </IconButton>
            </Box>
            <TableContainer sx={{ height: 300, overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Node ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>CI</TableCell>
                    <TableCell>Last Seen</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nodeStatus.map((node) => (
                    <TableRow key={node.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {node.id}
                        </Typography>
                      </TableCell>
                      <TableCell>{node.type}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(node.status)}
                          <Chip
                            label={node.status}
                            size="small"
                            color={getStatusColor(node.status) as any}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress
                            variant="determinate"
                            value={node.ci * 100}
                            sx={{
                              width: 60,
                              mr: 1,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: node.ci > 0.8 ? '#00ff88' : node.ci > 0.7 ? '#ffaa00' : '#ff4444',
                              },
                            }}
                          />
                          <Typography variant="body2">
                            {node.ci.toFixed(3)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(node.lastSeen).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {node.location}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Consensus Events */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              Recent Consensus Events
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {recentConsensusEvents.map((event) => (
                <ListItem key={event.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                    <Chip
                      label={event.type}
                      size="small"
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {event.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {event.participants} participants
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(event.consensus * 100).toFixed(1)}% consensus
                    </Typography>
                  </Box>
                  <Divider sx={{ width: '100%', mt: 1 }} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Network Security Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1 }} />
              Network Security Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Alert severity="success">
                  <AlertTitle>Encryption Status</AlertTitle>
                  All communications encrypted with SRC-256
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="info">
                  <AlertTitle>Authentication</AlertTitle>
                  Harmonic signature verification active
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="warning">
                  <AlertTitle>CRL Monitoring</AlertTitle>
                  No threats detected in last 24 hours
                </Alert>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DgoNetworkMonitor;

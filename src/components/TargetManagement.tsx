import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  Science as ScienceIcon,
  NetworkCheck as NetworkIcon,
  Info as InfoIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import { HarmonicTarget, TargetType } from '../types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TargetManagementProps {
  targets: HarmonicTarget[];
  onTargetSelect: (target: HarmonicTarget) => void;
}

const TargetManagement: React.FC<TargetManagementProps> = ({ targets, onTargetSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TargetType | 'all'>('all');
  const [selectedTarget, setSelectedTarget] = useState<HarmonicTarget | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getTargetTypeColor = (type: TargetType) => {
    const colors: Record<TargetType, string> = {
      'UCO_to_Biodiesel': '#00ff88',
      'Food_Waste_to_Biogas': '#ff6b35',
      'Textile_Waste_to_Recycled_Materials': '#ffaa00',
      'Plastic_Waste_to_Recycled_Products': '#00aaff',
      'Specialized_Waste_Streams': '#ff44aa',
    };
    return colors[type] || '#666666';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const filteredTargets = targets.filter(target => {
    const matchesSearch = target.target_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         target.target_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         target.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || target.target_type === filterType;
    return matchesSearch && matchesType;
  });

  const handleTargetClick = (target: HarmonicTarget) => {
    setSelectedTarget(target);
    setDetailsOpen(true);
    onTargetSelect(target);
  };

  const getTargetTypeStats = () => {
    const stats: Record<TargetType, number> = {
      'UCO_to_Biodiesel': 0,
      'Food_Waste_to_Biogas': 0,
      'Textile_Waste_to_Recycled_Materials': 0,
      'Plastic_Waste_to_Recycled_Products': 0,
      'Specialized_Waste_Streams': 0,
    };

    targets.forEach(target => {
      stats[target.target_type]++;
    });

    return stats;
  };

  const stats = getTargetTypeStats();

  return (
    <Box>
      {/* Header with Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon sx={{ mr: 1 }} />
            Harmonic Target Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search targets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as TargetType | 'all')}
                label="Filter by Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="UCO_to_Biodiesel">UCO to Biodiesel</MenuItem>
                <MenuItem value="Food_Waste_to_Biogas">Food Waste to Biogas</MenuItem>
                <MenuItem value="Textile_Waste_to_Recycled_Materials">Textile Waste</MenuItem>
                <MenuItem value="Plastic_Waste_to_Recycled_Products">Plastic Waste</MenuItem>
                <MenuItem value="Specialized_Waste_Streams">Specialized Streams</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Target Type Statistics */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {Object.entries(stats).map(([type, count]) => (
            <Chip
              key={type}
              label={`${type.replace(/_/g, ' ')}: ${count}`}
              sx={{
                backgroundColor: getTargetTypeColor(type as TargetType),
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          ))}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Targets Table */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: 600 }}>
            <TableContainer sx={{ height: '100%' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Target ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Volume (Daily)</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTargets.map((target) => (
                    <TableRow
                      key={target.target_id}
                      hover
                      onClick={() => handleTargetClick(target)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {target.target_id}
                        </Typography>
                      </TableCell>
                      <TableCell>{target.target_name || 'Unnamed Target'}</TableCell>
                      <TableCell>
                        <Chip
                          label={target.target_type.replace(/_/g, ' ')}
                          size="small"
                          sx={{
                            backgroundColor: getTargetTypeColor(target.target_type),
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {target.location.city}, {target.location.address.split(',')[0]}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={target.dgo_network_connection.status}
                          size="small"
                          color={getStatusColor(target.dgo_network_connection.status) as any}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{target.waste_stream_volume.daily}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <InfoIcon />
                        </IconButton>
                        <IconButton size="small" color="success">
                          <PlayIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Map View */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: 600, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Geographic Distribution</Typography>
            </Box>
            <Box sx={{ height: 'calc(100% - 64px)' }}>
              <MapContainer
                center={[51.505, -0.09]}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {targets.map((target) => (
                  <Marker
                    key={target.target_id}
                    position={[target.location.lat, target.location.long]}
                    eventHandlers={{
                      click: () => handleTargetClick(target),
                    }}
                  >
                    <Popup>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {target.target_name || target.target_id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {target.target_type.replace(/_/g, ' ')}
                        </Typography>
                        <Typography variant="body2">
                          {target.location.city}
                        </Typography>
                        <Chip
                          label={target.dgo_network_connection.status}
                          size="small"
                          color={getStatusColor(target.dgo_network_connection.status) as any}
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Target Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {selectedTarget?.target_name || selectedTarget?.target_id}
            </Typography>
            <Chip
              label={selectedTarget?.dgo_network_connection.status}
              color={getStatusColor(selectedTarget?.dgo_network_connection.status || '') as any}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTarget && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Basic Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Target ID"
                      secondary={selectedTarget.target_id}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Type"
                      secondary={
                        <Chip
                          label={selectedTarget.target_type.replace(/_/g, ' ')}
                          size="small"
                          sx={{
                            backgroundColor: getTargetTypeColor(selectedTarget.target_type),
                            color: 'white',
                          }}
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Location"
                      secondary={`${selectedTarget.location.city}, ${selectedTarget.location.address}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Coordinates"
                      secondary={`${selectedTarget.location.lat}, ${selectedTarget.location.long}`}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>Operational Data</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Daily Volume"
                      secondary={selectedTarget.waste_stream_volume.daily}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Weekly Volume"
                      secondary={selectedTarget.waste_stream_volume.weekly}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Monthly Volume"
                      secondary={selectedTarget.waste_stream_volume.monthly}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="DGO Node"
                      secondary={selectedTarget.dgo_network_connection.node_id}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>Required Components</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedTarget.required_gswx_components.map((component, index) => (
                    <Chip
                      key={index}
                      label={component}
                      variant="outlined"
                      sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Verification Metrics</Typography>
                <List dense>
                  {selectedTarget.verification_metrics.map((metric, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <ScienceIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={metric} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Current Processing</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTarget.current_babylonian_processing}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>GSWX Protocol</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTarget.gswx_transformation_protocol}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>GSWT Value Creation</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTarget.gswt_value_creation}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => setDetailsOpen(false)}>
            Monitor Target
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TargetManagement;

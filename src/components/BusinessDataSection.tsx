// S-W-RLE-OS Business Data Section Component
// Genesis Reloop Logistics - Phase 5 REOP Integration
// Read-only CRM and operational information display

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';

import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  LocalDining as LocalDiningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface BusinessData {
  prospectiveName: string;
  industry: string;
  contact: {
    name: string;
    title: string;
    phone?: string;
    email?: string;
  };
  location: {
    address: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  wasteStream: {
    type: string;
    dailyVolume: string;
    weeklyVolume?: string;
    monthlyVolume?: string;
    quality?: {
      triglycerideContent: number;
      freeFattyAcid: number;
      waterContent: number;
      contaminants: string;
    };
  };
  businessSize?: string;
  establishedYear?: number;
  sustainabilityInitiatives?: string[];
}

interface BusinessDataSectionProps {
  businessData: BusinessData;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  onRefresh?: () => void;
  onEdit?: () => void;
  showActions?: boolean;
}

// Mock data for Grand Hotel Central
const mockBusinessData: BusinessData = {
  prospectiveName: 'Grand Hotel Central',
  industry: 'Hospitality',
  contact: {
    name: 'Jane Doe',
    title: 'Operations Manager',
    phone: '+44 20 7123 4567',
    email: 'jane.doe@grandhotelcentral.co.uk'
  },
  location: {
    address: '123 Main Street',
    city: 'Anytown',
    state: 'England',
    country: 'UK',
    postalCode: 'EN1 1AA',
    coordinates: {
      lat: 51.5129,
      lng: -0.1224
    }
  },
  wasteStream: {
    type: 'Used Cooking Oil (UCO)',
    dailyVolume: '120L/day',
    weeklyVolume: '840L/week',
    monthlyVolume: '3,600L/month',
    quality: {
      triglycerideContent: 0.89,
      freeFattyAcid: 0.04,
      waterContent: 0.02,
      contaminants: 'Low'
    }
  },
  businessSize: 'Large (200+ rooms)',
  establishedYear: 1985,
  sustainabilityInitiatives: [
    'Zero waste to landfill',
    'Renewable energy sourcing',
    'Local sourcing partnerships',
    'Carbon neutral operations'
  ]
};

function BusinessDataSection({ 
  businessData = mockBusinessData, 
  isExpanded = true, 
  onToggleExpanded,
  onRefresh,
  onEdit,
  showActions = true 
}: BusinessDataSectionProps) {
  const formatLocation = () => {
    const { address, city, state, country, postalCode } = businessData.location;
    let locationString = `${address}, ${city}`;
    if (state) locationString += `, ${state}`;
    locationString += `, ${country}`;
    if (postalCode) locationString += ` ${postalCode}`;
    return locationString;
  };

  const formatContact = () => {
    return `${businessData.contact.name} (${businessData.contact.title})`;
  };

  const formatWasteStream = () => {
    return `${businessData.wasteStream.type}, Approx. ${businessData.wasteStream.dailyVolume}`;
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
          <BusinessIcon color="primary" />
          <Typography variant="h6" component="h3">
            BUSINESS & OPERATIONAL DATA
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {showActions && (
            <>
              <Tooltip title="Refresh Data">
                <IconButton size="small" onClick={onRefresh}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Data">
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
          {/* Main Information Grid */}
          <Grid container spacing={3}>
            {/* Left Column - Basic Info */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Prospective Name:</strong> {businessData.prospectiveName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Industry:</strong> {businessData.industry}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>CONTACT:</strong> {formatContact()}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>LOCATION:</strong> {formatLocation()}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>WASTE STREAM:</strong> {formatWasteStream()}
                </Typography>
              </Box>
            </Grid>

            {/* Right Column - Additional Details */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                {businessData.businessSize && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Business Size:</strong> {businessData.businessSize}
                  </Typography>
                )}
                {businessData.establishedYear && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Established:</strong> {businessData.establishedYear}
                  </Typography>
                )}
                {businessData.contact.phone && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {businessData.contact.phone}
                  </Typography>
                )}
                {businessData.contact.email && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {businessData.contact.email}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Waste Stream Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Waste Stream Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <LocalDiningIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" color="primary">
                    {businessData.wasteStream.dailyVolume}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily Volume
                  </Typography>
                </Box>
              </Grid>
              {businessData.wasteStream.weeklyVolume && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                      {businessData.wasteStream.weeklyVolume}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Weekly Volume
                    </Typography>
                  </Box>
                </Grid>
              )}
              {businessData.wasteStream.monthlyVolume && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                      {businessData.wasteStream.monthlyVolume}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Volume
                    </Typography>
                  </Box>
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="h6" color="success.main">
                    {businessData.wasteStream.quality?.contaminants || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contaminants
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Quality Parameters */}
          {businessData.wasteStream.quality && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quality Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                      {(businessData.wasteStream.quality.triglycerideContent * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Triglyceride
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                      {(businessData.wasteStream.quality.freeFattyAcid * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Free Fatty Acid
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                      {(businessData.wasteStream.quality.waterContent * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Water Content
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="h6" color="success.main">
                      {businessData.wasteStream.quality.contaminants}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contaminants
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Sustainability Initiatives */}
          {businessData.sustainabilityInitiatives && businessData.sustainabilityInitiatives.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Sustainability Initiatives
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {businessData.sustainabilityInitiatives.map((initiative, index) => (
                  <Chip
                    key={index}
                    label={initiative}
                    color="success"
                    variant="outlined"
                    size="small"
                    icon={<BusinessIcon />}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}

export default BusinessDataSection;

import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  AccountBalance as TokenIcon,
  QrCode as QrCodeIcon,
  CameraAlt as CameraIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  History as HistoryIcon,
  Send as SendIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

import { HarmonicTarget, GSWTMintFormData } from '../types';
import { mintingRules, antiFraudSystem } from '../data/sampleData';

interface GSWTInterfaceProps {
  selectedTarget: HarmonicTarget | null;
}

const GSWTInterface: React.FC<GSWTInterfaceProps> = ({ selectedTarget }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [mintForm, setMintForm] = useState<GSWTMintFormData>({
    transformationId: '',
    qrCodePayload: '',
    photographicProof: null,
    operatorId: '',
  });
  const [mintDialogOpen, setMintDialogOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const getMintingRule = (targetType: string) => {
    return mintingRules.find(rule => rule.target_type === targetType);
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

  const mintingSteps = [
    'Verify Transformation',
    'Generate QR Code',
    'Capture Photographic Proof',
    'Submit to DGO Network',
    'Await Consensus',
    'Mint GSWT',
  ];

  const handleMintRequest = () => {
    // Simulate minting process
    setVerificationResult({
      success: true,
      gswtAmount: 1,
      transactionId: '0x' + Math.random().toString(16).substr(2, 8),
      timestamp: new Date().toISOString(),
    });
    setMintDialogOpen(true);
  };

  const recentTransactions = [
    {
      id: '1',
      targetId: 'UCO-REST-001',
      amount: 15,
      status: 'completed',
      timestamp: '2024-01-15T10:30:00Z',
      transactionId: '0x1234567890abcdef',
    },
    {
      id: '2',
      targetId: 'FW-SUPER-001',
      amount: 8,
      status: 'pending',
      timestamp: '2024-01-15T09:15:00Z',
      transactionId: '0xabcdef1234567890',
    },
    {
      id: '3',
      targetId: 'TW-DC-001',
      amount: 12,
      status: 'completed',
      timestamp: '2024-01-15T08:45:00Z',
      transactionId: '0x9876543210fedcba',
    },
  ];

  if (!selectedTarget) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <TokenIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Select a harmonic target to access GSWT minting interface
        </Typography>
      </Paper>
    );
  }

  const mintingRule = getMintingRule(selectedTarget.target_type);

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
              <TokenIcon sx={{ mr: 1 }} />
              GSWT Minting Interface
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Target: {selectedTarget.target_name || selectedTarget.target_id}
            </Typography>
          </Box>
          <Chip
            label={selectedTarget.target_type.replace(/_/g, ' ')}
            sx={{
              backgroundColor: getTargetTypeColor(selectedTarget.target_type),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Minting Process */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <SendIcon sx={{ mr: 1 }} />
              GSWT Minting Process
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
              {mintingSteps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    optional={
                      index === mintingSteps.length - 1 ? (
                        <Typography variant="caption">Final step</Typography>
                      ) : null
                    }
                  >
                    {label}
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      {index === 0 && 'Verify that all transformation metrics meet the required thresholds...'}
                      {index === 1 && 'Generate unique QR code with physical state hash and location data...'}
                      {index === 2 && 'Capture timestamped photograph of the physical unit...'}
                      {index === 3 && 'Submit minting request to DGO network for validation...'}
                      {index === 4 && 'Wait for consensus from peer nodes...'}
                      {index === 5 && 'Mint GSWT tokens and update ledger...'}
                    </Typography>
                    <Box sx={{ mb: 2, mt: 1 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => setActiveStep(index + 1)}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === mintingSteps.length - 1 ? 'Complete' : 'Continue'}
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

        {/* Minting Rules */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ mr: 1 }} />
              Minting Rules
            </Typography>
            {mintingRule ? (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <AlertTitle>Conversion Rate</AlertTitle>
                  {mintingRule.conversion_rate}
                </Alert>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {mintingRule.value_backing}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Verification Metrics:
                </Typography>
                <List dense>
                  {mintingRule.verification_metrics.map((metric, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={metric.metric}
                        secondary={`${metric.condition} - ${metric.description}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Alert severity="warning">
                No minting rules found for this target type.
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* QR Code Generation */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <QrCodeIcon sx={{ mr: 1 }} />
              QR Code Generation
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Transformation ID"
                value={mintForm.transformationId}
                onChange={(e) => setMintForm({ ...mintForm, transformationId: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="QR Code Payload"
                value={mintForm.qrCodePayload}
                onChange={(e) => setMintForm({ ...mintForm, qrCodePayload: e.target.value })}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Operator ID"
                value={mintForm.operatorId}
                onChange={(e) => setMintForm({ ...mintForm, operatorId: e.target.value })}
              />
            </Box>
            <Button
              variant="contained"
              startIcon={<QrCodeIcon />}
              fullWidth
              onClick={() => {
                setMintForm({
                  ...mintForm,
                  qrCodePayload: `HASH(Ψ_physical_state_${Date.now()} + ${Date.now()} + ${selectedTarget.location.lat},${selectedTarget.location.long})`,
                });
              }}
            >
              Generate QR Code
            </Button>
          </Paper>
        </Grid>

        {/* Photographic Proof */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CameraIcon sx={{ mr: 1 }} />
              Photographic Proof
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CameraIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Capture timestamped photograph of the physical unit
              </Typography>
              <Button
                variant="outlined"
                startIcon={<CameraIcon />}
                onClick={() => {
                  // Simulate photo capture
                  setMintForm({ ...mintForm, photographicProof: new File([''], 'proof.jpg') });
                }}
              >
                Capture Photo
              </Button>
              {mintForm.photographicProof && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Photographic proof captured successfully
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Anti-Fraud System Info */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1 }} />
              Anti-Fraud Security Protocols
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {antiFraudSystem.description}
            </Typography>
            <Grid container spacing={2}>
              {antiFraudSystem.securityProtocols.map((protocol, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Layer {protocol.layer}: {protocol.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {protocol.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Mint Button */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<TokenIcon />}
              onClick={handleMintRequest}
              disabled={!mintForm.transformationId || !mintForm.qrCodePayload || !mintForm.operatorId}
              sx={{ px: 4, py: 2, fontSize: '1.1rem' }}
            >
              Mint GSWT Tokens
            </Button>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <HistoryIcon sx={{ mr: 1 }} />
              Recent GSWT Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Target ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {tx.targetId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" color="primary.main">
                          {tx.amount} GSWT
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tx.status}
                          color={tx.status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(tx.timestamp).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {tx.transactionId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <InfoIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Mint Success Dialog */}
      <Dialog open={mintDialogOpen} onClose={() => setMintDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
            GSWT Minting Successful
          </Box>
        </DialogTitle>
        <DialogContent>
          {verificationResult && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                <AlertTitle>Transaction Completed</AlertTitle>
                {verificationResult.gswtAmount} GSWT tokens have been successfully minted.
              </Alert>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Transaction ID"
                    secondary={verificationResult.transactionId}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Timestamp"
                    secondary={new Date(verificationResult.timestamp).toLocaleString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Amount"
                    secondary={`${verificationResult.gswtAmount} GSWT`}
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMintDialogOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => setMintDialogOpen(false)}>
            View Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GSWTInterface;

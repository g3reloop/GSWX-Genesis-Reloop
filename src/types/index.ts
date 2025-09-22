// GRL Platform TypeScript Interfaces
// Based on the Genesis Reloop Platform Architecture

export type TargetType = 
  | 'UCO_to_Biodiesel'
  | 'Food_Waste_to_Biogas'
  | 'Textile_Waste_to_Recycled_Materials'
  | 'Plastic_Waste_to_Recycled_Products'
  | 'Specialized_Waste_Streams';

export type SystemStatus = 'IDLE' | 'PROCESSING' | 'MAINTENANCE' | 'ERROR';
export type MessageType = 'HEARTBEAT' | 'TRANSFORMATION_LOG' | 'GSWT_MINT_REQUEST' | 'CRL_ALERT';
export type EventType = 'COLLECTION' | 'TRANSPORT' | 'INTAKE' | 'PROCESSING' | 'OUTPUT_VERIFICATION' | 'GSWT_MINT';
export type EventStatus = 'COMPLETE' | 'IN_PROGRESS' | 'FAILED';
export type CRLThreatLevel = 'none' | 'low' | 'high' | 'imminent';
export type DGOConnectionStatus = 'pending' | 'active' | 'inactive';
export type CRLSeverity = 'LOW' | 'MODERATE' | 'CRITICAL';

// Core Data Models
export interface Location {
  lat: number;
  long: number;
  city: string;
  address: string;
}

export interface WasteStreamVolume {
  daily: string;
  weekly: string;
  monthly: string;
}

export interface DgoNetworkConnection {
  node_id: string;
  status: DGOConnectionStatus;
  last_heartbeat: string; // Timestamp
}

export interface HarmonicTarget {
  target_id: string;
  target_name?: string;
  target_type: TargetType;
  location: Location;
  waste_stream_volume: WasteStreamVolume;
  current_babylonian_processing: string;
  gswx_transformation_protocol: string;
  gswt_value_creation: string;
  required_gswx_components: string[];
  verification_metrics: string[];
  dgo_network_connection: DgoNetworkConnection;
}

// DGO Network Integration
export interface DgoUplinkModule {
  modelId: string;
  class: 'Standard' | 'Enhanced' | 'Industrial' | 'Quantum Encrypted';
  frequencyRange: string;
  powerOutput: string;
  dataRate: string;
  useCase: string;
}

export interface HeartbeatPayload {
  coherenceIndex: number;
  systemStatus: SystemStatus;
  fieldVariance: number;
}

export interface TransformationLogPayload {
  transformationId: string;
  protocolId: string;
  input: {
    material: string;
    quantity: number;
    unit: string;
  };
  output: {
    material: string;
    quantity: number;
    unit: string;
  };
  metrics: {
    conversionEfficiency: number;
    purity: number;
    energyConsumed_kWh: number;
    averageCI: number;
  };
}

export interface GSWTMintRequestPayload {
  transformationId: string;
  qrCodePayload: string;
  photographicProofHash: string;
  operatorId: string;
}

export interface CRLAlertPayload {
  crlSignature: string;
  severity: CRLSeverity;
  mitigationAttempted: boolean;
}

export interface DgoPacket {
  header: {
    packetId: string;
    targetId: string;
    timestamp: string;
    messageType: MessageType;
    signature: string;
  };
  payload: HeartbeatPayload | TransformationLogPayload | GSWTMintRequestPayload | CRLAlertPayload;
}

// Target Specific Protocols
export interface TargetSpecificProtocol {
  name: string;
  mathematical_process_flow: string;
  gswc_equation: string;
  required_hardware_components: string[];
  specific_verification_metrics: string[];
  gswt_conversion_rate: string;
}

// GSWT Value Creation Metrics
export interface VerificationMetric {
  metric: string;
  condition: string;
  description: string;
}

export interface MintingRule {
  target_type: TargetType;
  conversion_rate: string;
  value_backing: string;
  verification_metrics: VerificationMetric[];
}

export interface SecurityProtocol {
  layer: number;
  name: string;
  description: string;
}

export interface AntiFraudSystem {
  name: string;
  description: string;
  qrCodePayload: {
    description: string;
    formula: string;
    components: Array<{
      name: string;
      description: string;
    }>;
  };
  securityProtocols: SecurityProtocol[];
}

// S-W-RLE-OS Interface
export interface SWRLEWidget {
  widgetId: string;
  visualization: string;
  dataPoint: string;
}

export interface SWRLEDashboard {
  description: string;
  layout: {
    primaryView: string;
    widgets: SWRLEWidget[];
  };
}

export interface ScalarWaveCommand {
  command: string;
  parameters: Record<string, any>;
  verification_condition?: string;
}

export interface CommandTemplate {
  templateId: string;
  targetType: TargetType;
  command: {
    sequenceName: string;
    steps: ScalarWaveCommand[];
  };
}

export interface ChainOfCustodyNode {
  eventId: string;
  eventType: EventType;
  timestamp: string;
  location: {
    lat: number;
    long: number;
  };
  status: EventStatus;
  details: {
    actor: string;
    quantity: string;
    notes: string;
  };
}

// Safety Protocols
export interface CIThreshold {
  level: 'Warning' | 'Critical';
  ci_condition: string;
  automated_action: string;
  operator_alert: string;
}

export interface CIMonitoring {
  description: string;
  thresholds: CIThreshold[];
}

export interface CRLThreatProtocol {
  threat_type: string;
  detection_method: string;
  mitigation_protocol_id: string;
  action: string;
  operator_interface: string;
}

export interface EmergencyProcedure {
  protocol_id: string;
  description: string;
  trigger: string;
  manual_activation: string;
  system_action: string;
}

export interface CorrectiveActionReport {
  step: number;
  name: string;
  details: string;
}

export interface CRLPreventionProtocols {
  name: string;
  description: string;
  ciMonitoring: CIMonitoring;
  crlThreatManagement: {
    description: string;
    protocols: CRLThreatProtocol[];
  };
  emergencyProcedures: {
    description: string;
    protocol: EmergencyProcedure;
  };
  verificationAndProtocolFailureHandling: {
    description: string;
    process: CorrectiveActionReport[];
  };
}

// Platform Architecture
export interface GRLPlatformArchitecture {
  coreDataModel: {
    description: string;
    schema: Record<string, any>;
  };
  dgoNetworkIntegrationProtocol: {
    name: string;
    description: string;
    steps: Array<{
      step: number;
      action: string;
      details: string;
    }>;
  };
  gswtMintingVerificationSystem: {
    name: string;
    description: string;
    process: Array<{
      phase: string;
      detail: string;
    }>;
  };
  scalarWaveCommandSequences: {
    description: string;
    structure: Record<string, any>;
    example_sequence: Record<string, any>;
  };
  swrleOsInterfaceSpecifications: {
    name: string;
    description: string;
    modules: Record<string, any>;
  };
  chainOfCustodyTrackingSystem: {
    name: string;
    description: string;
    record_schema: Record<string, any>;
  };
  errorHandlingAndCrlPreventionProtocols: {
    name: string;
    description: string;
    protocols: Array<{
      name: string;
      trigger: string;
      action: string;
      escalation: string;
    }>;
  };
}

// DGO Network Status
export interface DgoNetworkStatus {
  activeNodes: number;
  totalGSWT: number;
  averageCI: number;
}

// Application State
export interface AppState {
  targets: HarmonicTarget[];
  selectedTarget: HarmonicTarget | null;
  dgoNetworkStatus: DgoNetworkStatus;
  currentCI: number;
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: string;
  }>;
  isConnected: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Chart Data Types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface CIGaugeData {
  current: number;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface TransformationMetrics {
  efficiency: ChartDataPoint[];
  purity: ChartDataPoint[];
  energyConsumption: ChartDataPoint[];
  coherenceIndex: ChartDataPoint[];
}

// Map Types
export interface MapMarker {
  id: string;
  position: [number, number];
  type: TargetType;
  status: SystemStatus;
  ci: number;
  name: string;
}

// Form Types
export interface TargetFormData {
  target_id: string;
  target_name: string;
  target_type: TargetType;
  location: Location;
  waste_stream_volume: WasteStreamVolume;
  current_babylonian_processing: string;
  required_gswx_components: string[];
  verification_metrics: string[];
}

export interface GSWTMintFormData {
  transformationId: string;
  qrCodePayload: string;
  photographicProof: File | null;
  operatorId: string;
}

// Configuration Types
export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  openrouter: {
    apiKey: string;
  };
  map: {
    defaultCenter: [number, number];
    defaultZoom: number;
  };
  dgo: {
    consensusThreshold: number;
    heartbeatInterval: number;
  };
}

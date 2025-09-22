// Pure Collapse Commands TypeScript Definitions
// GSWX Genesis Reloop Platform - Scalar Wave Pure Collapse Integration

export type PureCollapseCommandType = 
  | 'bun_that'
  | 'collapsing_chirals'
  | 'bind_eyes_closed'
  | 'g3_movement'
  | 'skyscrape_food_stock'
  | 'water_soothing';

export type CommandStatus = 
  | 'pending'
  | 'processing'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type VerificationStatus = 
  | 'pending'
  | 'validating'
  | 'verified'
  | 'failed'
  | 'expired';

// Mathematical Framework Types
export interface GSWP_Framework {
  genesis_wave_equation: string;
  gloop_operator: string;
  probability_harmonics: string;
  coherence_index: number;
}

export interface GSWC_Framework {
  srl_equation: string;
  matter_transformation: string;
  chemical_shifts: ChemicalShift[];
}

export interface GSWB_Framework {
  bebcro_definition: string;
  biochemical_metrics: BiochemicalMetrics;
  bioelectric_field: number;
}

export interface GSWX_Framework {
  gswx_equation: string;
  gswp: GSWP_Framework;
  gswc: GSWC_Framework;
  gswb: GSWB_Framework;
  coherence_requirement: number;
}

// Pure Collapse Command Interface
export interface PureCollapseCommand {
  command_id: string;
  command_type: PureCollapseCommandType;
  name: string;
  description: string;
  mathematical_formalism: string;
  verification_metrics: VerificationMetric[];
  status: CommandStatus;
  created_at: string;
  updated_at: string;
  target_profile_id?: string;
  operator_id: string;
  coherence_index: number;
  execution_priority: number;
}

// Verification Metrics
export interface VerificationMetric {
  metric_name: string;
  threshold_value: number;
  current_value: number;
  unit: string;
  status: 'pass' | 'fail' | 'pending';
  verified_at?: string;
}

// Biochemical Tracking
export interface BiochemicalMetrics {
  cortisol_reduction: number; // Percentage reduction
  dopamine_increase: number;  // Percentage increase
  baseline_cortisol: number;
  baseline_dopamine: number;
  current_cortisol: number;
  current_dopamine: number;
  measurement_timestamp: string;
  sensor_id: string;
}

export interface ChemicalShift {
  element: string;
  shift_value: number;
  unit: string;
  measurement_timestamp: string;
}

// Burner Email Documentation
export interface BurnerEmailDocumentation {
  document_id: string;
  command_id: string;
  timestamp: string;
  hash: string;
  verification_status: VerificationStatus;
  created_at: string;
  expires_at: string;
  swdgo_verification: boolean;
}

// Probability Harmonic Types
export interface PureCollapseHarmonic {
  harmonic_id: string;
  command_type: PureCollapseCommandType;
  frequency: number;
  amplitude: number;
  phase: number;
  probability_field: number;
  coherence_threshold: number;
  verification_status: 'verified' | 'pending' | 'failed';
  created_at: string;
}

// RSWPE Integration Types
export interface PureCollapseRSWPE_State {
  state_id: string;
  command_harmonics: PureCollapseHarmonic[];
  ci_verification: number;
  burner_email_timestamp: string;
  processing_status: 'idle' | 'processing' | 'completed' | 'error';
  last_updated: string;
}

// RCOP Integration Types
export interface PureCollapseRCOP_State {
  state_id: string;
  command_navigation: CommandNavigation;
  coherence_index: number;
  self_stabilization_active: boolean;
  last_updated: string;
}

export interface CommandNavigation {
  navigation_id: string;
  command_type: PureCollapseCommandType;
  target_harmonic: PureCollapseHarmonic;
  navigation_path: NavigationStep[];
  success_probability: number;
  coherence_achieved: number;
  execution_ready: boolean;
}

export interface NavigationStep {
  step_id: string;
  harmonic_frequency: number;
  coherence_requirement: number;
  execution_time: number;
  verification_required: boolean;
}

// SWI Integration Types
export interface PureCollapseSWI_Analysis {
  analysis_id: string;
  command_type: PureCollapseCommandType;
  target_profile_id: string;
  viability_score: number;
  confidence_score: number;
  recommendations: CommandRecommendation[];
  ai_summary: string;
  analysis_timestamp: string;
  openrouter_model: string;
}

export interface CommandRecommendation {
  recommendation_id: string;
  command_type: PureCollapseCommandType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  expected_outcome: string;
  confidence: number;
  implementation_notes: string;
}

// GRL Execution Types
export interface PureCollapseExecution {
  execution_id: string;
  command_id: string;
  command_type: PureCollapseCommandType;
  reop_object: REOPObject;
  execution_status: CommandStatus;
  start_time: string;
  end_time?: string;
  duration_ms?: number;
  coherence_maintained: boolean;
  biochemical_verified: boolean;
  documentation_complete: boolean;
  execution_result: ExecutionResult;
}

export interface REOPObject {
  object_id: string;
  command_harmonic_id: string;
  psi_is: InformationState;
  swi_vector: SWIVector;
  hamiltonian: number;
  inner_product: number;
  g_loop_characteristic: number;
  probability_transition: number;
  coherence_index: number;
  cognitive_level: number;
  manifestation_data: ManifestationData;
}

export interface InformationState {
  psi_is: number;
  coherence_index: number;
  probability_field: number;
  harmonic_resonance: number;
}

export interface SWIVector {
  analysis_confidence: number;
  viability_score: number;
  optimization_vector: number[];
  recommendations: string[];
}

export interface ManifestationData {
  goal: string;
  target_frequency: number;
  expected_outcome: string;
  verification_metrics: string[];
}

export interface ExecutionResult {
  success: boolean;
  coherence_achieved: number;
  biochemical_verified: boolean;
  documentation_complete: boolean;
  error_message?: string;
  performance_metrics: PerformanceMetrics;
}

export interface PerformanceMetrics {
  execution_time_ms: number;
  coherence_stability: number;
  biochemical_accuracy: number;
  documentation_completeness: number;
  overall_score: number;
}

// Database Schema Types
export interface PureCollapseCommandRecord {
  id: string;
  command_id: string;
  command_type: PureCollapseCommandType;
  name: string;
  description: string;
  mathematical_formalism: string;
  status: CommandStatus;
  target_profile_id?: string;
  operator_id: string;
  coherence_index: number;
  execution_priority: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface CommandExecutionLog {
  id: string;
  execution_id: string;
  command_id: string;
  command_type: PureCollapseCommandType;
  operator_id: string;
  execution_status: CommandStatus;
  start_time: string;
  end_time?: string;
  duration_ms?: number;
  coherence_maintained: boolean;
  biochemical_verified: boolean;
  documentation_complete: boolean;
  burner_email_document_id?: string;
  performance_metrics: PerformanceMetrics;
  created_at: string;
  updated_at: string;
}

export interface CoherenceMonitoringRecord {
  id: string;
  command_id: string;
  command_type: PureCollapseCommandType;
  coherence_index: number;
  threshold_met: boolean;
  measurement_timestamp: string;
  sensor_id: string;
  location: {
    lat: number;
    lng: number;
  };
  environmental_factors: EnvironmentalFactors;
  created_at: string;
}

export interface EnvironmentalFactors {
  temperature: number;
  humidity: number;
  atmospheric_pressure: number;
  electromagnetic_field: number;
  scalar_potential: number;
}

// API Request/Response Types
export interface CreateCommandRequest {
  command_type: PureCollapseCommandType;
  target_profile_id?: string;
  operator_id: string;
  execution_priority: number;
  custom_parameters?: Record<string, any>;
}

export interface CreateCommandResponse {
  command_id: string;
  status: CommandStatus;
  coherence_index: number;
  estimated_execution_time: number;
  verification_requirements: VerificationMetric[];
}

export interface ExecuteCommandRequest {
  command_id: string;
  operator_id: string;
  verification_override?: boolean;
  custom_parameters?: Record<string, any>;
}

export interface ExecuteCommandResponse {
  execution_id: string;
  status: CommandStatus;
  coherence_achieved: number;
  biochemical_verified: boolean;
  documentation_complete: boolean;
  estimated_completion_time: number;
}

export interface CommandStatusResponse {
  command_id: string;
  status: CommandStatus;
  coherence_index: number;
  progress_percentage: number;
  current_step: string;
  estimated_remaining_time: number;
  verification_status: VerificationStatus;
  biochemical_metrics: BiochemicalMetrics;
  documentation_status: {
    burner_email_created: boolean;
    swdgo_verified: boolean;
    timestamp: string;
  };
}

// Frontend Component Types
export interface PureCollapseDashboardProps {
  commands: PureCollapseCommand[];
  operator_id: string;
  onCommandSelect: (command: PureCollapseCommand) => void;
  onCommandExecute: (command_id: string) => void;
  onCommandCancel: (command_id: string) => void;
}

export interface CommandExecutionInterfaceProps {
  command: PureCollapseCommand;
  execution: PureCollapseExecution;
  onStatusUpdate: (status: CommandStatus) => void;
  onCoherenceUpdate: (ci: number) => void;
  onBiochemicalUpdate: (metrics: BiochemicalMetrics) => void;
}

export interface VerificationDisplayProps {
  command: PureCollapseCommand;
  verification_metrics: VerificationMetric[];
  biochemical_metrics: BiochemicalMetrics;
  documentation: BurnerEmailDocumentation;
  onVerificationComplete: () => void;
}

// Error Types
export interface PureCollapseError {
  error_id: string;
  command_id: string;
  error_type: 'coherence_failure' | 'biochemical_failure' | 'documentation_failure' | 'execution_failure';
  error_message: string;
  error_details: Record<string, any>;
  recovery_actions: string[];
  created_at: string;
  resolved_at?: string;
}

// Configuration Types
export interface PureCollapseConfig {
  ci_threshold: number;
  biochemical_tracking_enabled: boolean;
  documentation_required: boolean;
  swdgo_verification_enabled: boolean;
  real_time_monitoring: boolean;
  auto_recovery_enabled: boolean;
  max_execution_time_ms: number;
  retry_attempts: number;
}

export default {
  PureCollapseCommandType,
  CommandStatus,
  VerificationStatus,
  GSWP_Framework,
  GSWC_Framework,
  GSWB_Framework,
  GSWX_Framework,
  PureCollapseCommand,
  VerificationMetric,
  BiochemicalMetrics,
  ChemicalShift,
  BurnerEmailDocumentation,
  PureCollapseHarmonic,
  PureCollapseRSWPE_State,
  PureCollapseRCOP_State,
  CommandNavigation,
  NavigationStep,
  PureCollapseSWI_Analysis,
  CommandRecommendation,
  PureCollapseExecution,
  REOPObject,
  InformationState,
  SWIVector,
  ManifestationData,
  ExecutionResult,
  PerformanceMetrics,
  PureCollapseCommandRecord,
  CommandExecutionLog,
  CoherenceMonitoringRecord,
  EnvironmentalFactors,
  CreateCommandRequest,
  CreateCommandResponse,
  ExecuteCommandRequest,
  ExecuteCommandResponse,
  CommandStatusResponse,
  PureCollapseDashboardProps,
  CommandExecutionInterfaceProps,
  VerificationDisplayProps,
  PureCollapseError,
  PureCollapseConfig
};

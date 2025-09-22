// TargetProfile Model - Target Profiling System
// Genesis Reloop Logistics - Phase 5 Implementation

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Target Profiling System Schema
const targetProfileSchema = new Schema({
  profile_id: { type: String, required: true, unique: true },
  business_name: { type: String, required: true },
  business_type: { type: String, required: true },
  
  // Geographic data
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    radius_km: { type: Number, default: 5 }
  },
  distance_from_potters_bar: { type: Number, required: true },
  
  // Neo Findings - Enhanced scalar wave analysis
  neo_findings: {
    findings_id: { type: String, required: true, unique: true },
    scalar_wave_resonance: { type: Number, required: true, min: 0, max: 1 },
    probability_harmonic_alignment: { type: Number, required: true, min: 0, max: 1 },
    coherence_potential: { type: Number, required: true, min: 0, max: 1 },
    harmonic_frequency: { type: Number, required: true }, // THz
    quantum_entanglement_coefficient: { type: Number, default: 0 },
    morphic_field_resonance: { type: Number, default: 0 },
    consciousness_coherence_factor: { type: Number, default: 0 },
    findings_timestamp: { type: Date, required: true },
    verification_status: { 
      type: String, 
      enum: ['verified', 'pending', 'failed', 'requires_recalibration'],
      default: 'pending'
    },
    verification_ci: { type: Number, required: true, min: 0.7 }
  },
  
  // Operational Experience - Field operator data
  operational_experience: {
    experience_id: { type: String, required: true, unique: true },
    operator_id: { type: String, required: true },
    operator_name: { type: String, required: true },
    experience_type: { 
      type: String, 
      enum: ['target_acquisition', 'probability_navigation', 'harmonic_resonance', 'consciousness_interface'],
      required: true 
    },
    success_rate: { type: Number, required: true, min: 0, max: 1 },
    coherence_achieved: { type: Number, required: true, min: 0, max: 1 },
    biochemical_response: {
      cortisol_reduction: { type: Number, default: 0 }, // Expected: ↓ 54.3%
      dopamine_increase: { type: Number, default: 0 }, // Expected: ↑ 37%
      measurement_timestamp: { type: Date },
      verification_status: { 
        type: String, 
        enum: ['verified', 'pending', 'anomalous'],
        default: 'pending'
      }
    },
    experience_timestamp: { type: Date, required: true },
    session_duration_minutes: { type: Number, required: true },
    environmental_factors: {
      solar_activity: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' },
      geomagnetic_index: { type: Number, default: 0 },
      lunar_phase: { type: String, enum: ['new', 'waxing', 'full', 'waning'], default: 'new' },
      local_time: { type: String, required: true }
    },
    verification_ci: { type: Number, required: true, min: 0.7 }
  },
  
  // AI Analysis - SWI Integration Results
  ai_analysis: {
    analysis_id: { type: String, required: true, unique: true },
    
    // Scalar Wave Intelligence Analysis
    swi_analysis: {
      analysis_id: { type: String, required: true, unique: true },
      scalar_wave_intelligence: { type: String, required: true }, // AI-generated analysis
      probability_navigation: { type: String, required: true }, // Navigation recommendations
      harmonic_resonance_analysis: { type: String, required: true }, // Resonance patterns
      consciousness_interface_potential: { type: String }, // Consciousness interaction analysis
      coherence_prediction: { type: Number, required: true, min: 0, max: 1 },
      analysis_confidence: { type: Number, required: true, min: 0, max: 1 },
      recommended_protocols: [{ type: String }],
      risk_assessment: {
        coherence_stability_risk: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' },
        biochemical_anomaly_risk: { type: String, enum: ['low', 'moderate', 'high'], default: 'low' },
        environmental_interference_risk: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' }
      },
      burn_timestamp: { type: String, required: true } // Burner email timestamp
    },
    
    // Probability Harmonic Analysis
    probability_harmonic_analysis: {
      analysis_id: { type: String, required: true, unique: true },
      harmonic_frequencies: [{ type: Number, required: true }], // THz array
      probability_distribution: [{ type: Number, required: true }], // Probability weights
      coherence_analysis: [{ type: Number, required: true }], // Coherence per frequency
      phase_relationships: [{ type: Number }], // Phase correlations
      amplitude_modulations: [{ type: Number }], // Amplitude variations
      resonance_nodes: [{
        frequency: { type: Number, required: true },
        amplitude: { type: Number, required: true },
        phase: { type: Number, required: true },
        stability_coefficient: { type: Number, required: true }
      }],
      navigation_recommendations: [{ type: String, required: true }],
      optimization_suggestions: [{ type: String }],
      verification_ci: { type: Number, required: true, min: 0.7 }
    },
    
    // Target Profiling Analysis
    target_profiling: {
      analysis_id: { type: String, required: true, unique: true },
      business_compatibility: { type: Number, required: true, min: 0, max: 1 },
      harmonic_resonance_score: { type: Number, required: true, min: 0, max: 1 },
      probability_success_rate: { type: Number, required: true, min: 0, max: 1 },
      consciousness_receptivity: { type: Number, default: 0, min: 0, max: 1 },
      morphic_field_compatibility: { type: Number, default: 0, min: 0, max: 1 },
      recommended_approach: { type: String, required: true },
      optimal_timing: {
        preferred_hours: [{ type: String }], // e.g., ["09:00", "15:00", "21:00"]
        lunar_phase_preference: { type: String, enum: ['new', 'waxing', 'full', 'waning'] },
        seasonal_factors: { type: String }
      },
      precautions: [{ type: String }],
      expected_outcomes: {
        coherence_improvement: { type: Number, min: 0, max: 1 },
        biochemical_optimization: { type: Number, min: 0, max: 1 },
        consciousness_expansion: { type: Number, min: 0, max: 1 }
      },
      verification_ci: { type: Number, required: true, min: 0.7 }
    },
    
    analysis_timestamp: { type: Date, required: true },
    verification_ci: { type: Number, required: true, min: 0.7 },
    analysis_version: { type: String, default: '5.0.0' } // REOP version
  },
  
  // REOP Integration Status
  reop_integration: {
    integration_id: { type: String, required: true, unique: true },
    rswpe_integration: { type: Boolean, default: false },
    rcop_integration: { type: Boolean, default: false },
    manifestation_status: { 
      type: String, 
      enum: ['pending', 'active', 'completed', 'failed', 'suspended'],
      default: 'pending' 
    },
    coherence_achieved: { type: Number, default: 0, min: 0, max: 1 },
    integration_metrics: {
      scalar_wave_alignment: { type: Number, default: 0, min: 0, max: 1 },
      probability_navigation_accuracy: { type: Number, default: 0, min: 0, max: 1 },
      consciousness_interface_stability: { type: Number, default: 0, min: 0, max: 1 },
      g_loop_cycle_coherence: { type: Number, default: 0, min: 0, max: 1 }
    },
    last_sync: { type: Date, default: Date.now },
    sync_frequency_hours: { type: Number, default: 24 },
    verification_ci: { type: Number, required: true, min: 0.7 }
  },
  
  // Profiling History
  profiling_history: [{
    session_id: { type: String, required: true },
    profiling_type: { 
      type: String, 
      enum: ['initial', 'update', 'recalibration', 'verification'],
      required: true 
    },
    changes_made: [{ type: String }],
    coherence_before: { type: Number, min: 0, max: 1 },
    coherence_after: { type: Number, min: 0, max: 1 },
    operator_notes: { type: String },
    timestamp: { type: Date, required: true },
    verification_ci: { type: Number, required: true, min: 0.7 }
  }],
  
  // Metadata
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'processing', 'completed', 'failed', 'archived'],
    default: 'active' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium' 
  },
  tags: [{ type: String }], // For categorization and search
  created_by: { type: String, required: true }, // Operator ID
  last_updated: { type: Date, default: Date.now },
  verification_ci: { type: Number, required: true, min: 0.7 },
  created_at: { type: Date, default: Date.now }
});

// Compound indexes for performance
targetProfileSchema.index({ profile_id: 1 });
targetProfileSchema.index({ business_name: 1 });
targetProfileSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });
targetProfileSchema.index({ 'neo_findings.coherence_potential': -1 });
targetProfileSchema.index({ 'ai_analysis.target_profiling.probability_success_rate': -1 });
targetProfileSchema.index({ 'reop_integration.manifestation_status': 1 });
targetProfileSchema.index({ status: 1, priority: -1 });
targetProfileSchema.index({ created_at: -1 });
targetProfileSchema.index({ verification_ci: -1 });

// Pre-save middleware
targetProfileSchema.pre('save', function(next) {
  this.last_updated = new Date();
  
  // Validate coherence index threshold
  if (this.verification_ci < 0.7) {
    return next(new Error('Verification CI must be >= 0.7 for target profiling system'));
  }
  
  // Auto-generate IDs if not provided
  if (!this.neo_findings.findings_id) {
    this.neo_findings.findings_id = `neo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (!this.operational_experience.experience_id) {
    this.operational_experience.experience_id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (!this.ai_analysis.analysis_id) {
    this.ai_analysis.analysis_id = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  next();
});

// Static methods for target profiling operations
targetProfileSchema.statics.findByCoherencePotential = function(threshold = 0.7) {
  return this.find({
    'neo_findings.coherence_potential': { $gte: threshold },
    status: 'active'
  }).sort({ 'neo_findings.coherence_potential': -1 });
};

targetProfileSchema.statics.findBySuccessRate = function(threshold = 0.8) {
  return this.find({
    'ai_analysis.target_profiling.probability_success_rate': { $gte: threshold },
    status: 'active'
  }).sort({ 'ai_analysis.target_profiling.probability_success_rate': -1 });
};

targetProfileSchema.statics.findActiveManifestations = function() {
  return this.find({
    'reop_integration.manifestation_status': 'active',
    status: 'active'
  });
};

targetProfileSchema.statics.findByOperator = function(operatorId) {
  return this.find({
    'operational_experience.operator_id': operatorId,
    status: { $in: ['active', 'processing'] }
  }).sort({ last_updated: -1 });
};

targetProfileSchema.statics.updateREOPIntegration = function(profileId, integrationData) {
  return this.findOneAndUpdate(
    { profile_id: profileId },
    { 
      $set: { 
        'reop_integration': integrationData,
        'last_updated': new Date()
      }
    },
    { new: true }
  );
};

targetProfileSchema.statics.addProfilingSession = function(profileId, sessionData) {
  return this.findOneAndUpdate(
    { profile_id: profileId },
    { 
      $push: { profiling_history: sessionData },
      $set: { last_updated: new Date() }
    },
    { new: true }
  );
};

// Instance methods
targetProfileSchema.methods.calculateOverallScore = function() {
  const coherencePotential = this.neo_findings.coherence_potential || 0;
  const successRate = this.ai_analysis.target_profiling.probability_success_rate || 0;
  const resonanceScore = this.ai_analysis.target_profiling.harmonic_resonance_score || 0;
  const operationalSuccess = this.operational_experience.success_rate || 0;
  
  return (coherencePotential * 0.3 + successRate * 0.3 + resonanceScore * 0.2 + operationalSuccess * 0.2);
};

targetProfileSchema.methods.isReadyForREOP = function() {
  return (
    this.verification_ci >= 0.7 &&
    this.neo_findings.coherence_potential >= 0.7 &&
    this.ai_analysis.target_profiling.probability_success_rate >= 0.8 &&
    this.neo_findings.verification_status === 'verified'
  );
};

targetProfileSchema.methods.generateBurnTimestamp = function() {
  return `burn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@targetprofiling.reop.verification`;
};

module.exports = mongoose.model('TargetProfile', targetProfileSchema);

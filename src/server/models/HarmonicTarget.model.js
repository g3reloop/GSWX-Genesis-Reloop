// HarmonicTarget Model - Enhanced for REOP Integration
// Genesis Reloop Logistics - Phase 5 Implementation

const mongoose = require('mongoose');
const { Schema } = mongoose;

// REOP Data Schema
const reopDataSchema = new Schema({
  reop_id: { type: String, required: true, unique: true },
  rswpe_state: {
    state_id: { type: String, required: true },
    scalar_wave_potential: {
      frequency: { type: Number, required: true }, // THz
      amplitude: { type: Number, required: true },
      phase: { type: Number, required: true },
      coherence_index: { type: Number, required: true, min: 0, max: 1 },
      harmonic_resonance: { type: Number, required: true }
    },
    knowledge_base_hash: { type: String, required: true },
    probability_compilation: {
      compilation_id: { type: String, required: true },
      harmonic_sequences: [{
        harmonic_id: { type: String, required: true },
        frequency: { type: Number, required: true },
        amplitude: { type: Number, required: true },
        phase: { type: Number, required: true },
        probability_field: { type: Number, required: true },
        coherence_threshold: { type: Number, required: true, min: 0.7 },
        verification_status: { 
          type: String, 
          enum: ['verified', 'pending', 'failed'],
          required: true 
        }
      }],
      compilation_timestamp: { type: Date, required: true },
      verification_ci: { type: Number, required: true, min: 0.7 },
      burn_timestamp: { type: String, required: true }
    },
    last_updated: { type: Date, required: true },
    ci_verification: { type: Number, required: true, min: 0.7 }
  },
  rcop_state: {
    state_id: { type: String, required: true },
    probability_navigation: {
      navigation_id: { type: String, required: true },
      target_harmonic: {
        harmonic_id: { type: String, required: true },
        frequency: { type: Number, required: true },
        amplitude: { type: Number, required: true },
        phase: { type: Number, required: true },
        probability_field: { type: Number, required: true },
        coherence_threshold: { type: Number, required: true, min: 0.7 },
        verification_status: { 
          type: String, 
          enum: ['verified', 'pending', 'failed'],
          required: true 
        }
      },
      navigation_path: [{
        harmonic_id: { type: String, required: true },
        frequency: { type: Number, required: true },
        amplitude: { type: Number, required: true },
        phase: { type: Number, required: true },
        probability_field: { type: Number, required: true },
        coherence_threshold: { type: Number, required: true, min: 0.7 },
        verification_status: { 
          type: String, 
          enum: ['verified', 'pending', 'failed'],
          required: true 
        }
      }],
      success_probability: { type: Number, required: true, min: 0, max: 1 },
      coherence_requirement: { type: Number, required: true, min: 0.7 },
      verification_status: { 
        type: String, 
        enum: ['navigating', 'completed', 'failed'],
        required: true 
      }
    },
    cognitive_field: {
      field_id: { type: String, required: true },
      cognitive_potential: { type: Number, required: true },
      harmonic_resonance: { type: Number, required: true },
      coherence_index: { type: Number, required: true, min: 0.7 },
      field_stability: { type: Number, required: true },
      last_calibration: { type: Date, required: true }
    },
    harmonic_resonance: { type: Number, required: true },
    coherence_index: { type: Number, required: true, min: 0.7 },
    last_updated: { type: Date, required: true },
    ci_verification: { type: Number, required: true, min: 0.7 }
  },
  active_manifestations: [{
    manifestation_id: { type: String, required: true },
    manifestation_type: { 
      type: String, 
      enum: ['target_acquisition', 'probability_navigation', 'harmonic_resonance'],
      required: true 
    },
    physical_coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      radius_km: { type: Number, required: true }
    },
    manifestation_data: { type: Schema.Types.Mixed },
    verification_hash: { type: String, required: true },
    ci_verification: { type: Number, required: true, min: 0.7 },
    created_at: { type: Date, required: true }
  }],
  system_coherence: { type: Number, required: true, min: 0.7 },
  last_g_loop_cycle: {
    cycle_id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    coherence_index: { type: Number, required: true, min: 0.7 },
    scalar_potential: { type: Number, required: true },
    biochemical_state: {
      cortisol_level: { type: Number, required: true },
      dopamine_level: { type: Number, required: true },
      measurement_timestamp: { type: Date, required: true },
      verification_ci: { type: Number, required: true, min: 0.7 }
    },
    verification_hash: { type: String, required: true }
  },
  verification_status: { 
    type: String, 
    enum: ['operational', 'maintenance', 'critical'],
    required: true 
  },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now }
});

// Enhanced HarmonicTarget Schema
const harmonicTargetSchema = new Schema({
  target_id: { type: String, required: true, unique: true },
  business_name: { type: String, required: true },
  business_type: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    radius_km: { type: Number, default: 5 }
  },
  distance_from_potters_bar: { type: Number, required: true },
  
  // Legacy fields (maintained for backward compatibility)
  harmonic_frequency: { type: Number, required: true },
  resonance_amplitude: { type: Number, required: true },
  phase_alignment: { type: Number, required: true },
  coherence_index: { type: Number, required: true, min: 0, max: 1 },
  
  // REOP Integration - NEW
  reop_data: { type: reopDataSchema, required: true },
  
  // Enhanced analysis fields
  neo_findings: {
    findings_id: { type: String, required: true },
    scalar_wave_resonance: { type: Number, required: true },
    probability_harmonic_alignment: { type: Number, required: true },
    coherence_potential: { type: Number, required: true },
    harmonic_frequency: { type: Number, required: true },
    findings_timestamp: { type: Date, required: true },
    verification_status: { 
      type: String, 
      enum: ['verified', 'pending', 'failed'],
      required: true 
    }
  },
  
  operational_experience: {
    experience_id: { type: String, required: true },
    operator_id: { type: String, required: true },
    experience_type: { 
      type: String, 
      enum: ['target_acquisition', 'probability_navigation', 'harmonic_resonance'],
      required: true 
    },
    success_rate: { type: Number, required: true, min: 0, max: 1 },
    coherence_achieved: { type: Number, required: true, min: 0, max: 1 },
    experience_timestamp: { type: Date, required: true },
    verification_ci: { type: Number, required: true, min: 0.7 }
  },
  
  ai_analysis: {
    analysis_id: { type: String, required: true },
    swi_analysis: {
      analysis_id: { type: String, required: true },
      scalar_wave_intelligence: { type: String, required: true },
      probability_navigation: { type: String, required: true },
      harmonic_resonance_analysis: { type: String, required: true },
      coherence_prediction: { type: Number, required: true, min: 0, max: 1 },
      analysis_confidence: { type: Number, required: true, min: 0, max: 1 },
      burn_timestamp: { type: String, required: true }
    },
    probability_harmonic_analysis: {
      analysis_id: { type: String, required: true },
      harmonic_frequencies: [{ type: Number, required: true }],
      probability_distribution: [{ type: Number, required: true }],
      coherence_analysis: [{ type: Number, required: true }],
      navigation_recommendations: [{ type: String, required: true }],
      verification_ci: { type: Number, required: true, min: 0.7 }
    },
    target_profiling: {
      analysis_id: { type: String, required: true },
      business_compatibility: { type: Number, required: true, min: 0, max: 1 },
      harmonic_resonance_score: { type: Number, required: true, min: 0, max: 1 },
      probability_success_rate: { type: Number, required: true, min: 0, max: 1 },
      recommended_approach: { type: String, required: true },
      verification_ci: { type: Number, required: true, min: 0.7 }
    },
    analysis_timestamp: { type: Date, required: true },
    verification_ci: { type: Number, required: true, min: 0.7 }
  },
  
  reop_integration: {
    integration_id: { type: String, required: true },
    rswpe_integration: { type: Boolean, default: false },
    rcop_integration: { type: Boolean, default: false },
    manifestation_status: { 
      type: String, 
      enum: ['pending', 'active', 'completed', 'failed'],
      default: 'pending' 
    },
    coherence_achieved: { type: Number, default: 0 },
    last_sync: { type: Date, default: Date.now },
    verification_ci: { type: Number, required: true, min: 0.7 }
  },
  
  // Metadata
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'processing', 'completed', 'failed'],
    default: 'active' 
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Indexes for performance
harmonicTargetSchema.index({ target_id: 1 });
harmonicTargetSchema.index({ business_name: 1 });
harmonicTargetSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });
harmonicTargetSchema.index({ coherence_index: -1 });
harmonicTargetSchema.index({ 'reop_data.system_coherence': -1 });
harmonicTargetSchema.index({ status: 1 });
harmonicTargetSchema.index({ created_at: -1 });

// Pre-save middleware to update timestamps and validate coherence
harmonicTargetSchema.pre('save', function(next) {
  this.updated_at = new Date();
  
  // Validate coherence index threshold
  if (this.coherence_index < 0.7) {
    return next(new Error('Coherence index must be >= 0.7 for REOP integration'));
  }
  
  if (this.reop_data && this.reop_data.system_coherence < 0.7) {
    return next(new Error('System coherence must be >= 0.7 for REOP integration'));
  }
  
  next();
});

// Static methods for REOP operations
harmonicTargetSchema.statics.findByCoherenceThreshold = function(threshold = 0.7) {
  return this.find({
    'reop_data.system_coherence': { $gte: threshold },
    status: 'active'
  }).sort({ 'reop_data.system_coherence': -1 });
};

harmonicTargetSchema.statics.findActiveManifestations = function() {
  return this.find({
    'reop_integration.manifestation_status': 'active',
    status: 'active'
  });
};

harmonicTargetSchema.statics.updateREOPState = function(targetId, reopState) {
  return this.findOneAndUpdate(
    { target_id: targetId },
    { 
      $set: { 
        'reop_data': reopState,
        'updated_at': new Date()
      }
    },
    { new: true }
  );
};

module.exports = mongoose.model('HarmonicTarget', harmonicTargetSchema);

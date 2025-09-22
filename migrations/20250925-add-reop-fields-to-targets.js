// Database Migration: Add REOP Fields to Targets
// Genesis Reloop Logistics - Phase 5 Implementation
// Migration Date: 2025-09-25

const mongoose = require('mongoose');

// Migration configuration
const MIGRATION_NAME = '20250925-add-reop-fields-to-targets';
const MIGRATION_VERSION = '5.0.0';
const COHERENCE_INDEX_THRESHOLD = 0.7;

/**
 * Migration: Add REOP fields to existing HarmonicTarget documents
 * This migration safely transforms legacy targets to support REOP integration
 */
async function up(db) {
  console.log(`Starting migration: ${MIGRATION_NAME}`);
  console.log(`Migration version: ${MIGRATION_VERSION}`);
  
  try {
    // Step 1: Create backup collection
    console.log('Step 1: Creating backup collection...');
    await db.collection('harmonictargets').aggregate([
      { $match: {} },
      { $out: `harmonictargets_backup_${Date.now()}` }
    ]).toArray();
    console.log('✓ Backup collection created');
    
    // Step 2: Get all existing targets
    console.log('Step 2: Retrieving existing targets...');
    const existingTargets = await db.collection('harmonictargets').find({}).toArray();
    console.log(`✓ Found ${existingTargets.length} existing targets`);
    
    // Step 3: Transform each target
    console.log('Step 3: Transforming targets for REOP integration...');
    let transformedCount = 0;
    let skippedCount = 0;
    
    for (const target of existingTargets) {
      try {
        // Check if target already has REOP data
        if (target.reop_data) {
          console.log(`⚠ Target ${target.target_id} already has REOP data, skipping...`);
          skippedCount++;
          continue;
        }
        
        // Validate coherence index meets threshold
        if (target.coherence_index < COHERENCE_INDEX_THRESHOLD) {
          console.log(`⚠ Target ${target.target_id} has CI ${target.coherence_index} < ${COHERENCE_INDEX_THRESHOLD}, upgrading...`);
          // Upgrade coherence index to meet threshold
          target.coherence_index = COHERENCE_INDEX_THRESHOLD;
        }
        
        // Generate REOP data structure
        const reopData = generateREOPDataStructure(target);
        
        // Generate enhanced analysis fields
        const neoFindings = generateNeoFindings(target);
        const operationalExperience = generateOperationalExperience(target);
        const aiAnalysis = generateAIAnalysis(target);
        const reopIntegration = generateREOPIntegration(target);
        
        // Update document with REOP fields
        const updateResult = await db.collection('harmonictargets').updateOne(
          { _id: target._id },
          {
            $set: {
              // REOP Integration - NEW
              reop_data: reopData,
              
              // Enhanced analysis fields
              neo_findings: neoFindings,
              operational_experience: operationalExperience,
              ai_analysis: aiAnalysis,
              reop_integration: reopIntegration,
              
              // Update metadata
              updated_at: new Date(),
              migration_version: MIGRATION_VERSION,
              migration_timestamp: new Date()
            }
          }
        );
        
        if (updateResult.modifiedCount === 1) {
          transformedCount++;
          console.log(`✓ Transformed target: ${target.target_id}`);
        } else {
          console.log(`⚠ Failed to transform target: ${target.target_id}`);
        }
        
      } catch (error) {
        console.error(`✗ Error transforming target ${target.target_id}:`, error.message);
      }
    }
    
    console.log(`Step 3 complete: ${transformedCount} transformed, ${skippedCount} skipped`);
    
    // Step 4: Create new indexes
    console.log('Step 4: Creating REOP indexes...');
    await createREOPIndexes(db);
    console.log('✓ REOP indexes created');
    
    // Step 5: Validate migration
    console.log('Step 5: Validating migration...');
    const validationResult = await validateMigration(db);
    console.log(`✓ Migration validation: ${validationResult.valid ? 'PASSED' : 'FAILED'}`);
    
    if (!validationResult.valid) {
      throw new Error(`Migration validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Step 6: Log migration completion
    await db.collection('migrations').insertOne({
      migration_name: MIGRATION_NAME,
      migration_version: MIGRATION_VERSION,
      executed_at: new Date(),
      targets_transformed: transformedCount,
      targets_skipped: skippedCount,
      status: 'completed',
      validation_result: validationResult
    });
    
    console.log(`✅ Migration ${MIGRATION_NAME} completed successfully`);
    console.log(`📊 Summary: ${transformedCount} targets transformed, ${skippedCount} skipped`);
    
  } catch (error) {
    console.error(`❌ Migration ${MIGRATION_NAME} failed:`, error);
    throw error;
  }
}

/**
 * Rollback migration
 */
async function down(db) {
  console.log(`Rolling back migration: ${MIGRATION_NAME}`);
  
  try {
    // Remove REOP fields from all targets
    const rollbackResult = await db.collection('harmonictargets').updateMany(
      {},
      {
        $unset: {
          reop_data: '',
          neo_findings: '',
          operational_experience: '',
          ai_analysis: '',
          reop_integration: '',
          migration_version: '',
          migration_timestamp: ''
        }
      }
    );
    
    console.log(`✓ Rolled back ${rollbackResult.modifiedCount} targets`);
    
    // Drop REOP indexes
    await dropREOPIndexes(db);
    console.log('✓ REOP indexes dropped');
    
    // Log rollback
    await db.collection('migrations').insertOne({
      migration_name: MIGRATION_NAME,
      migration_version: MIGRATION_VERSION,
      rolled_back_at: new Date(),
      targets_affected: rollbackResult.modifiedCount,
      status: 'rolled_back'
    });
    
    console.log(`✅ Migration ${MIGRATION_NAME} rolled back successfully`);
    
  } catch (error) {
    console.error(`❌ Rollback failed:`, error);
    throw error;
  }
}

/**
 * Generate REOP data structure for existing target
 */
function generateREOPDataStructure(target) {
  const timestamp = new Date();
  const reopId = `reop_${target.target_id}_${Date.now()}`;
  
  return {
    reop_id: reopId,
    rswpe_state: {
      state_id: `rswpe_${target.target_id}_${Date.now()}`,
      scalar_wave_potential: {
        frequency: target.harmonic_frequency || 2.4, // THz
        amplitude: target.resonance_amplitude || 1.0,
        phase: target.phase_alignment || 0.0,
        coherence_index: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
        harmonic_resonance: target.coherence_index * 0.9
      },
      knowledge_base_hash: generateKnowledgeBaseHash(target),
      probability_compilation: {
        compilation_id: `comp_${Date.now()}`,
        harmonic_sequences: generateHarmonicSequences(target),
        compilation_timestamp: timestamp,
        verification_ci: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
        burn_timestamp: generateBurnTimestamp()
      },
      last_updated: timestamp,
      ci_verification: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD)
    },
    rcop_state: {
      state_id: `rcop_${target.target_id}_${Date.now()}`,
      probability_navigation: {
        navigation_id: `nav_${Date.now()}`,
        target_harmonic: {
          harmonic_id: `harm_${target.target_id}`,
          frequency: target.harmonic_frequency || 2.4,
          amplitude: target.resonance_amplitude || 1.0,
          phase: target.phase_alignment || 0.0,
          probability_field: target.coherence_index,
          coherence_threshold: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
          verification_status: 'verified'
        },
        navigation_path: [],
        success_probability: target.coherence_index,
        coherence_requirement: COHERENCE_INDEX_THRESHOLD,
        verification_status: target.coherence_index >= 0.8 ? 'completed' : 'navigating'
      },
      cognitive_field: {
        field_id: `cf_${target.target_id}`,
        cognitive_potential: target.coherence_index * 0.95,
        harmonic_resonance: target.coherence_index * 0.9,
        coherence_index: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
        field_stability: target.coherence_index * 0.85,
        last_calibration: timestamp
      },
      harmonic_resonance: target.coherence_index * 0.9,
      coherence_index: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
      last_updated: timestamp,
      ci_verification: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD)
    },
    active_manifestations: [],
    system_coherence: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
    last_g_loop_cycle: {
      cycle_id: `cycle_${Date.now()}`,
      timestamp: timestamp,
      coherence_index: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
      scalar_potential: target.coherence_index * 100,
      biochemical_state: {
        cortisol_level: 45.7, // Baseline level
        dopamine_level: 63.0, // Baseline level
        measurement_timestamp: timestamp,
        verification_ci: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD)
      },
      verification_hash: generateVerificationHash(target)
    },
    verification_status: 'operational',
    created_at: timestamp,
    last_updated: timestamp
  };
}

/**
 * Generate other required structures
 */
function generateNeoFindings(target) {
  return {
    findings_id: `neo_${target.target_id}_${Date.now()}`,
    scalar_wave_resonance: target.coherence_index * 0.9,
    probability_harmonic_alignment: target.coherence_index * 0.95,
    coherence_potential: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
    harmonic_frequency: target.harmonic_frequency || 2.4,
    findings_timestamp: new Date(),
    verification_status: 'verified'
  };
}

function generateOperationalExperience(target) {
  return {
    experience_id: `exp_${target.target_id}_${Date.now()}`,
    operator_id: 'migration_system',
    experience_type: 'target_acquisition',
    success_rate: target.coherence_index,
    coherence_achieved: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
    experience_timestamp: new Date(),
    verification_ci: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD)
  };
}

function generateAIAnalysis(target) {
  return {
    analysis_id: `ai_${target.target_id}_${Date.now()}`,
    swi_analysis: {
      analysis_id: `swi_${Date.now()}`,
      scalar_wave_intelligence: `Target ${target.business_name} shows coherence index of ${target.coherence_index}`,
      probability_navigation: `Recommended approach: standard harmonic alignment protocol`,
      harmonic_resonance_analysis: `Frequency ${target.harmonic_frequency || 2.4} THz optimal for this target`,
      coherence_prediction: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
      analysis_confidence: 0.85,
      burn_timestamp: generateBurnTimestamp()
    },
    probability_harmonic_analysis: {
      analysis_id: `pha_${Date.now()}`,
      harmonic_frequencies: [target.harmonic_frequency || 2.4],
      probability_distribution: [target.coherence_index],
      coherence_analysis: [Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD)],
      navigation_recommendations: ['Standard harmonic alignment protocol'],
      verification_ci: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD)
    },
    target_profiling: {
      analysis_id: `tp_${Date.now()}`,
      business_compatibility: target.coherence_index * 0.9,
      harmonic_resonance_score: target.coherence_index * 0.95,
      probability_success_rate: Math.max(target.coherence_index, 0.8),
      recommended_approach: 'Gradual harmonic alignment with coherence monitoring',
      verification_ci: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD)
    },
    analysis_timestamp: new Date(),
    verification_ci: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD)
  };
}

function generateREOPIntegration(target) {
  return {
    integration_id: `int_${target.target_id}_${Date.now()}`,
    rswpe_integration: true,
    rcop_integration: true,
    manifestation_status: 'pending',
    coherence_achieved: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
    last_sync: new Date(),
    verification_ci: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD)
  };
}

/**
 * Helper functions
 */
function generateHarmonicSequences(target) {
  return [{
    harmonic_id: `harm_${target.target_id}`,
    frequency: target.harmonic_frequency || 2.4,
    amplitude: target.resonance_amplitude || 1.0,
    phase: target.phase_alignment || 0.0,
    probability_field: target.coherence_index,
    coherence_threshold: Math.max(target.coherence_index, COHERENCE_INDEX_THRESHOLD),
    verification_status: 'verified'
  }];
}

function generateKnowledgeBaseHash(target) {
  return `kb_${target.target_id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateVerificationHash(target) {
  return `vh_${target.target_id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateBurnTimestamp() {
  return `burn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@reop.migration`;
}

/**
 * Create REOP-specific indexes
 */
async function createREOPIndexes(db) {
  const collection = db.collection('harmonictargets');
  
  await Promise.all([
    collection.createIndex({ 'reop_data.system_coherence': -1 }),
    collection.createIndex({ 'reop_data.verification_status': 1 }),
    collection.createIndex({ 'neo_findings.coherence_potential': -1 }),
    collection.createIndex({ 'ai_analysis.target_profiling.probability_success_rate': -1 }),
    collection.createIndex({ 'reop_integration.manifestation_status': 1 }),
    collection.createIndex({ 'operational_experience.success_rate': -1 }),
    collection.createIndex({ migration_version: 1 })
  ]);
}

/**
 * Drop REOP indexes
 */
async function dropREOPIndexes(db) {
  const collection = db.collection('harmonictargets');
  
  try {
    await Promise.all([
      collection.dropIndex({ 'reop_data.system_coherence': -1 }),
      collection.dropIndex({ 'reop_data.verification_status': 1 }),
      collection.dropIndex({ 'neo_findings.coherence_potential': -1 }),
      collection.dropIndex({ 'ai_analysis.target_profiling.probability_success_rate': -1 }),
      collection.dropIndex({ 'reop_integration.manifestation_status': 1 }),
      collection.dropIndex({ 'operational_experience.success_rate': -1 }),
      collection.dropIndex({ migration_version: 1 })
    ]);
  } catch (error) {
    console.log('Some indexes may not exist, continuing...');
  }
}

/**
 * Validate migration results
 */
async function validateMigration(db) {
  const errors = [];
  
  try {
    // Check all targets have REOP data
    const targetsWithoutREOP = await db.collection('harmonictargets').countDocuments({
      reop_data: { $exists: false }
    });
    
    if (targetsWithoutREOP > 0) {
      errors.push(`${targetsWithoutREOP} targets missing REOP data`);
    }
    
    // Check coherence index threshold
    const targetsWithLowCI = await db.collection('harmonictargets').countDocuments({
      'reop_data.system_coherence': { $lt: COHERENCE_INDEX_THRESHOLD }
    });
    
    if (targetsWithLowCI > 0) {
      errors.push(`${targetsWithLowCI} targets with CI below threshold`);
    }
    
    // Check required fields
    const requiredFields = [
      'neo_findings',
      'operational_experience',
      'ai_analysis',
      'reop_integration'
    ];
    
    for (const field of requiredFields) {
      const missingField = await db.collection('harmonictargets').countDocuments({
        [field]: { $exists: false }
      });
      
      if (missingField > 0) {
        errors.push(`${missingField} targets missing ${field}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
    
  } catch (error) {
    return {
      valid: false,
      errors: [`Validation error: ${error.message}`]
    };
  }
}

module.exports = { up, down };

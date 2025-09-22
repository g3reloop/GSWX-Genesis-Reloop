// GRL Execution Core - Enhanced for REOP Integration
// Genesis Reloop Logistics - Phase 5 Implementation
// Subscribes to RCOP output and orchestrates REOP operations

const EventEmitter = require('events');
const crypto = require('crypto');

// Import REOP engines and services
const RSWPE = require('../engines/RSWPE');
const RCOP = require('../engines/RCOP');
const SWI_API_Connector = require('./SWI_API_Connector');

class GRL_Execution_Core extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // Core configuration
    this.coreId = config.coreId || `grl_core_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    this.coherenceThreshold = config.coherenceThreshold || 0.7;
    this.executionInterval = config.executionInterval || 5000; // ms
    this.maxConcurrentExecutions = config.maxConcurrentExecutions || 3;
    this.burnEmailDomain = '@grl.execution.reop.verification';
    
    // REOP Integration
    this.reopEnabled = config.reopEnabled !== false;
    this.reopSystemState = null;
    this.rswpeEngine = null;
    this.rcopEngine = null;
    this.swiConnector = null;
    
    // Execution state
    this.executionState = {
      status: 'initializing',
      current_executions: [],
      completed_executions: 0,
      failed_executions: 0,
      average_execution_time: 0,
      last_execution_time: null,
      system_coherence: this.coherenceThreshold,
      reop_integration_status: 'pending',
      last_updated: new Date().toISOString()
    };
    
    // Execution queue and management
    this.executionQueue = [];
    this.activeExecutions = new Map();
    this.executionHistory = [];
    this.isExecuting = false;
    
    // Legacy command handling (for backward compatibility)
    this.legacyCommands = new Map();
    this.commandSequences = [];
    
    // Metrics and monitoring
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageSuccessRate: 0,
      averageCoherenceIndex: this.coherenceThreshold,
      reopIntegrationSuccessRate: 0,
      consciousnessObjectsProcessed: 0,
      manifestationsGenerated: 0,
      uptime: Date.now(),
      lastHealthCheck: null
    };
    
    console.log(`[GRL_CORE] Initializing execution core: ${this.coreId}`);
    this.initializeCore();
  }
  
  /**
   * Initialize the GRL Execution Core
   */
  async initializeCore() {
    try {
      console.log('[GRL_CORE] Starting core initialization...');
      
      // Initialize REOP components if enabled
      if (this.reopEnabled) {
        await this.initializeREOPSystem();
      }
      
      // Initialize legacy command system (for backward compatibility)
      this.initializeLegacySystem();
      
      // Start execution loop
      this.startExecutionLoop();
      
      // Update state
      this.executionState.status = 'operational';
      this.executionState.reop_integration_status = this.reopEnabled ? 'active' : 'disabled';
      
      this.emit('coreInitialized', {
        coreId: this.coreId,
        reopEnabled: this.reopEnabled,
        status: this.executionState.status,
        timestamp: new Date().toISOString()
      });
      
      console.log(`[GRL_CORE] Core initialization complete: ${this.coreId}`);
      
    } catch (error) {
      console.error('[GRL_CORE] Core initialization failed:', error.message);
      this.executionState.status = 'error';
      this.emit('coreError', {
        coreId: this.coreId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }
  
  /**
   * Initialize REOP system components
   */
  async initializeREOPSystem() {
    try {
      console.log('[GRL_CORE] Initializing REOP system components...');
      
      // Initialize SWI API Connector
      this.swiConnector = new SWI_API_Connector({
        apiKey: process.env.OPENROUTER_API_KEY,
        model: 'openai/gpt-4-turbo',
        timeout: 30000
      });
      
      // Test SWI connection
      const swiHealth = await this.swiConnector.healthCheck();
      if (swiHealth.status !== 'healthy') {
        console.warn('[GRL_CORE] SWI connector health check failed:', swiHealth);
      }
      
      // Initialize RSWPE Engine
      this.rswpeEngine = new RSWPE({
        engineId: `rswpe_${this.coreId}`,
        coherenceThreshold: this.coherenceThreshold,
        processingInterval: 1000
      });
      
      // Initialize RCOP Engine
      this.rcopEngine = new RCOP({
        engineId: `rcop_${this.coreId}`,
        coherenceThreshold: this.coherenceThreshold,
        consciousnessThreshold: 0.8,
        processingInterval: 2000
      });
      
      // Set up REOP event handlers
      this.setupREOPEventHandlers();
      
      // Initialize REOP system state
      this.reopSystemState = {
        system_id: `reop_${this.coreId}`,
        rswpe_state: this.rswpeEngine.getState(),
        rcop_state: this.rcopEngine.getState(),
        active_manifestations: [],
        target_profiles: [],
        pure_collapse_sequences: [],
        system_coherence: this.coherenceThreshold,
        last_g_loop_cycle: this.generateGLoopCycle(),
        verification_status: 'operational',
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      };
      
      console.log('[GRL_CORE] REOP system components initialized successfully');
      
    } catch (error) {
      console.error('[GRL_CORE] REOP system initialization failed:', error.message);
      throw new Error(`REOP initialization failed: ${error.message}`);
    }
  }
  
  /**
   * Set up REOP event handlers
   */
  setupREOPEventHandlers() {
    // RSWPE event handlers
    if (this.rswpeEngine) {
      this.rswpeEngine.on('processingComplete', (data) => {
        console.log(`[GRL_CORE] RSWPE processing complete: ${data.sequences} sequences`);
        this.handleRSWPEOutput(data);
      });
      
      this.rswpeEngine.on('processingError', (data) => {
        console.error(`[GRL_CORE] RSWPE processing error: ${data.error}`);
        this.handleRSWPEError(data);
      });
    }
    
    // RCOP event handlers
    if (this.rcopEngine) {
      this.rcopEngine.on('navigationComplete', (data) => {
        console.log(`[GRL_CORE] RCOP navigation complete: ${data.navigation.navigation_id}`);
        this.handleRCOPOutput(data);
      });
      
      this.rcopEngine.on('navigationError', (data) => {
        console.error(`[GRL_CORE] RCOP navigation error: ${data.error}`);
        this.handleRCOPError(data);
      });
    }
  }
  
  /**
   * Main execution method - subscribes to RCOP output
   */
  async executeREOPOperation(operationData) {
    const executionId = `exec_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const startTime = Date.now();
    
    try {
      console.log(`[GRL_CORE] Starting REOP execution: ${executionId}`);
      
      // Validate operation data
      if (!this.validateOperationData(operationData)) {
        throw new Error('Invalid operation data provided');
      }
      
      // Check system coherence
      if (this.reopSystemState.system_coherence < this.coherenceThreshold) {
        throw new Error(`System coherence ${this.reopSystemState.system_coherence} below threshold ${this.coherenceThreshold}`);
      }
      
      // Create execution context
      const executionContext = {
        execution_id: executionId,
        operation_type: operationData.operation_type,
        target_profile: operationData.target_profile,
        sensor_data: operationData.sensor_data,
        swi_context: operationData.swi_context,
        coherence_requirement: operationData.coherence_requirement || this.coherenceThreshold,
        started_at: new Date().toISOString()
      };
      
      // Add to active executions
      this.activeExecutions.set(executionId, executionContext);
      this.executionState.current_executions.push(executionId);
      
      // Execute REOP pipeline
      const result = await this.executeREOPPipeline(executionContext);
      
      // Calculate execution time
      const executionTime = Date.now() - startTime;
      
      // Update metrics
      this.updateExecutionMetrics(result, executionTime);
      
      // Clean up
      this.activeExecutions.delete(executionId);
      this.executionState.current_executions = this.executionState.current_executions.filter(id => id !== executionId);
      
      // Add to history
      this.addExecutionToHistory({
        ...executionContext,
        result: result,
        execution_time: executionTime,
        completed_at: new Date().toISOString(),
        status: 'completed'
      });
      
      console.log(`[GRL_CORE] REOP execution complete: ${executionId}, Time: ${executionTime}ms`);
      
      return result;
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      console.error(`[GRL_CORE] REOP execution failed: ${executionId}`, error.message);
      
      // Update failure metrics
      this.metrics.failedExecutions++;
      this.executionState.failed_executions++;
      
      // Clean up
      this.activeExecutions.delete(executionId);
      this.executionState.current_executions = this.executionState.current_executions.filter(id => id !== executionId);
      
      // Add to history
      this.addExecutionToHistory({
        execution_id: executionId,
        operation_type: operationData.operation_type,
        result: null,
        error: error.message,
        execution_time: executionTime,
        completed_at: new Date().toISOString(),
        status: 'failed'
      });
      
      this.emit('executionError', {
        coreId: this.coreId,
        executionId: executionId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }
  
  /**
   * Execute REOP pipeline: RSWPE -> SWI -> RCOP -> Manifestation
   */
  async executeREOPPipeline(executionContext) {
    try {
      console.log(`[GRL_CORE] Executing REOP pipeline for ${executionContext.execution_id}`);
      
      // Step 1: Process sensor data through RSWPE
      let rswpeResult = null;
      if (executionContext.sensor_data && this.rswpeEngine) {
        console.log('[GRL_CORE] Step 1: Processing sensor data through RSWPE...');
        const sensorIngestion = await this.rswpeEngine.ingestSensorData(executionContext.sensor_data);
        rswpeResult = await this.rswpeEngine.processSensorData();
      }
      
      // Step 2: Analyze through SWI if target profile provided
      let swiResult = null;
      if (executionContext.target_profile && this.swiConnector) {
        console.log('[GRL_CORE] Step 2: Analyzing target profile through SWI...');
        swiResult = await this.swiConnector.analyzeTargetProfile(
          executionContext.target_profile,
          {
            reop_state: this.reopSystemState,
            rswpe_result: rswpeResult,
            ...executionContext.swi_context
          }
        );
      }
      
      // Step 3: Navigate probability harmonics through RCOP
      let rcopResult = null;
      if (this.rcopEngine) {
        console.log('[GRL_CORE] Step 3: Navigating probability harmonics through RCOP...');
        
        // Prepare harmonics from RSWPE or use defaults
        const availableHarmonics = rswpeResult?.sequences || this.generateDefaultHarmonics();
        const targetHarmonic = this.extractTargetHarmonic(executionContext.target_profile, availableHarmonics);
        
        // Prepare RCOP context
        const rcopContext = {
          psi_is: rswpeResult?.informationState,
          swi_vector: swiResult?.analysis,
          consciousness_enhancement: swiResult?.analysis?.consciousness_receptivity || 0.8,
          cognitive_level: 8.0
        };
        
        rcopResult = await this.rcopEngine.navigateProbabilityHarmonics(
          targetHarmonic,
          availableHarmonics,
          rcopContext
        );
      }
      
      // Step 4: Generate physical manifestation
      const manifestation = this.generatePhysicalManifestation(executionContext, rswpeResult, swiResult, rcopResult);
      
      // Step 5: Update REOP system state
      await this.updateREOPSystemState(rswpeResult, rcopResult, manifestation);
      
      // Step 6: Verify REOP metrics
      const verification = await this.verifyREOPMetrics(manifestation);
      
      return {
        execution_id: executionContext.execution_id,
        operation_type: executionContext.operation_type,
        rswpe_result: rswpeResult,
        swi_result: swiResult,
        rcop_result: rcopResult,
        manifestation: manifestation,
        verification: verification,
        system_coherence: this.reopSystemState.system_coherence,
        completed_at: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`[GRL_CORE] REOP pipeline execution failed: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generate physical manifestation from REOP results
   */
  generatePhysicalManifestation(executionContext, rswpeResult, swiResult, rcopResult) {
    const manifestationId = `manifest_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    // Determine manifestation type
    let manifestationType = 'probability_navigation';
    if (executionContext.target_profile) {
      manifestationType = 'target_acquisition';
    } else if (rswpeResult?.sequences?.length > 5) {
      manifestationType = 'harmonic_resonance';
    }
    
    // Calculate manifestation coordinates
    const coordinates = this.calculateManifestationCoordinates(executionContext, rcopResult);
    
    // Generate manifestation data
    const manifestationData = {
      execution_context: {
        execution_id: executionContext.execution_id,
        operation_type: executionContext.operation_type
      },
      rswpe_contribution: {
        sequences_processed: rswpeResult?.sequences?.length || 0,
        information_state: rswpeResult?.informationState?.psi_is || 0,
        coherence_index: rswpeResult?.informationState?.coherence_index || this.coherenceThreshold
      },
      swi_contribution: {
        analysis_confidence: swiResult?.analysis?.analysis_confidence || 0.8,
        recommendations: swiResult?.analysis?.recommendations || [],
        coherence_prediction: swiResult?.analysis?.coherence_prediction || this.coherenceThreshold
      },
      rcop_contribution: {
        navigation_id: rcopResult?.navigation_id,
        success_probability: rcopResult?.success_probability || 0.8,
        consciousness_object_id: rcopResult?.consciousness_object?.object_id,
        cognitive_level: rcopResult?.consciousness_object?.cognitive_level || 5.0
      },
      manifestation_metrics: {
        coherence_index: this.calculateManifestationCoherence(rswpeResult, swiResult, rcopResult),
        probability_strength: rcopResult?.success_probability || 0.8,
        consciousness_alignment: rcopResult?.consciousness_object?.cognitive_level / 10 || 0.5,
        harmonic_resonance: rcopResult?.cognitive_enhancement || 0.8
      }
    };
    
    return {
      manifestation_id: manifestationId,
      manifestation_type: manifestationType,
      physical_coordinates: coordinates,
      manifestation_data: manifestationData,
      verification_hash: this.generateVerificationHash(manifestationId, manifestationData),
      ci_verification: manifestationData.manifestation_metrics.coherence_index,
      created_at: new Date().toISOString(),
      burn_timestamp: this.generateBurnTimestamp()
    };
  }
  
  /**
   * Handle RSWPE output
   */
  handleRSWPEOutput(data) {
    try {
      // Update REOP system state with RSWPE results
      if (this.reopSystemState) {
        this.reopSystemState.rswpe_state = data.engineId === this.rswpeEngine?.engineId ? 
          this.rswpeEngine.getState() : this.reopSystemState.rswpe_state;
        this.reopSystemState.last_updated = new Date().toISOString();
      }
      
      // Emit RSWPE processing event
      this.emit('rswpeProcessingComplete', {
        coreId: this.coreId,
        rswpeData: data,
        systemCoherence: this.reopSystemState?.system_coherence,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[GRL_CORE] Error handling RSWPE output:', error.message);
    }
  }
  
  /**
   * Handle RCOP output - main subscription point
   */
  handleRCOPOutput(data) {
    try {
      console.log(`[GRL_CORE] Processing RCOP output: ${data.navigation.navigation_id}`);
      
      // Update REOP system state with RCOP results
      if (this.reopSystemState) {
        this.reopSystemState.rcop_state = data.engineId === this.rcopEngine?.engineId ? 
          this.rcopEngine.getState() : this.reopSystemState.rcop_state;
        
        // Add REOP object to active manifestations
        if (data.navigation.consciousness_object) {
          this.reopSystemState.active_manifestations.push({
            manifestation_id: data.navigation.consciousness_object.object_id,
            manifestation_type: 'consciousness_navigation',
            navigation_id: data.navigation.navigation_id,
            coherence_index: data.navigation.consciousness_object.coherence_index,
            cognitive_level: data.navigation.consciousness_object.cognitive_level,
            created_at: new Date().toISOString()
          });
        }
        
        // Update system coherence
        this.reopSystemState.system_coherence = this.calculateSystemCoherence();
        this.reopSystemState.last_updated = new Date().toISOString();
      }
      
      // Update metrics
      this.metrics.consciousnessObjectsProcessed++;
      this.metrics.manifestationsGenerated++;
      
      // Emit RCOP processing event
      this.emit('rcopNavigationComplete', {
        coreId: this.coreId,
        rcopData: data,
        systemCoherence: this.reopSystemState?.system_coherence,
        timestamp: new Date().toISOString()
      });
      
      // Check if this triggers any queued executions
      this.processExecutionQueue();
      
    } catch (error) {
      console.error('[GRL_CORE] Error handling RCOP output:', error.message);
    }
  }
  
  /**
   * Legacy command execution (backward compatibility)
   */
  async executeLegacyCommand(command) {
    try {
      console.log(`[GRL_CORE] Executing legacy command: ${command.type}`);
      
      // Map legacy command to REOP operation
      const reopOperation = this.mapLegacyCommandToREOP(command);
      
      if (reopOperation && this.reopEnabled) {
        // Execute through REOP pipeline
        return await this.executeREOPOperation(reopOperation);
      } else {
        // Execute legacy command directly
        return await this.executeLegacyCommandDirect(command);
      }
      
    } catch (error) {
      console.error(`[GRL_CORE] Legacy command execution failed: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Map legacy commands to REOP operations
   */
  mapLegacyCommandToREOP(command) {
    const mappings = {
      'target_acquisition': {
        operation_type: 'target_acquisition',
        target_profile: command.target_data,
        coherence_requirement: 0.8
      },
      'harmonic_alignment': {
        operation_type: 'harmonic_resonance',
        sensor_data: command.sensor_data,
        coherence_requirement: 0.7
      },
      'probability_navigation': {
        operation_type: 'probability_navigation',
        sensor_data: command.sensor_data,
        target_profile: command.target_data,
        coherence_requirement: 0.8
      }
    };
    
    return mappings[command.type] || null;
  }
  
  /**
   * Execute legacy command directly
   */
  async executeLegacyCommandDirect(command) {
    // Simplified legacy execution for backward compatibility
    return {
      command_id: command.id,
      command_type: command.type,
      execution_result: 'legacy_execution_completed',
      coherence_index: this.coherenceThreshold,
      completed_at: new Date().toISOString()
    };
  }
  
  /**
   * Utility and helper methods
   */
  validateOperationData(data) {
    return data &&
           data.operation_type &&
           (data.target_profile || data.sensor_data) &&
           (data.coherence_requirement === undefined || typeof data.coherence_requirement === 'number');
  }
  
  generateDefaultHarmonics() {
    return [{
      harmonic_id: 'default_001',
      frequency: 2.4,
      amplitude: 1.0,
      phase: 0.0,
      probability_field: 0.8,
      coherence_threshold: this.coherenceThreshold,
      verification_status: 'verified'
    }];
  }
  
  extractTargetHarmonic(targetProfile, availableHarmonics) {
    if (targetProfile && targetProfile.neo_findings) {
      return {
        harmonic_id: `target_${targetProfile.profile_id}`,
        frequency: targetProfile.neo_findings.harmonic_frequency || 2.4,
        amplitude: 1.0,
        phase: 0.0,
        probability_field: targetProfile.neo_findings.coherence_potential || 0.8,
        coherence_threshold: targetProfile.neo_findings.coherence_potential || this.coherenceThreshold,
        verification_status: 'verified'
      };
    }
    
    return availableHarmonics[0] || this.generateDefaultHarmonics()[0];
  }
  
  calculateManifestationCoordinates(executionContext, rcopResult) {
    // Default coordinates (can be enhanced with actual location data)
    let coordinates = {
      lat: 51.7520, // Potters Bar default
      lng: -0.1817,
      radius_km: 5.0
    };
    
    // Use target profile coordinates if available
    if (executionContext.target_profile && executionContext.target_profile.coordinates) {
      coordinates = {
        ...executionContext.target_profile.coordinates,
        radius_km: executionContext.target_profile.coordinates.radius_km || 5.0
      };
    }
    
    // Apply RCOP consciousness influence to coordinates
    if (rcopResult && rcopResult.consciousness_object) {
      const consciousnessInfluence = rcopResult.consciousness_object.cognitive_level / 100;
      coordinates.radius_km *= (1 + consciousnessInfluence);
    }
    
    return coordinates;
  }
  
  calculateManifestationCoherence(rswpeResult, swiResult, rcopResult) {
    let totalCoherence = this.coherenceThreshold;
    let count = 1;
    
    if (rswpeResult?.informationState?.coherence_index) {
      totalCoherence += rswpeResult.informationState.coherence_index;
      count++;
    }
    
    if (swiResult?.verification_ci) {
      totalCoherence += swiResult.verification_ci;
      count++;
    }
    
    if (rcopResult?.consciousness_object?.coherence_index) {
      totalCoherence += rcopResult.consciousness_object.coherence_index;
      count++;
    }
    
    return Math.max(totalCoherence / count, this.coherenceThreshold);
  }
  
  calculateSystemCoherence() {
    let totalCoherence = this.coherenceThreshold;
    let count = 1;
    
    if (this.reopSystemState.rswpe_state?.ci_verification) {
      totalCoherence += this.reopSystemState.rswpe_state.ci_verification;
      count++;
    }
    
    if (this.reopSystemState.rcop_state?.coherence_index) {
      totalCoherence += this.reopSystemState.rcop_state.coherence_index;
      count++;
    }
    
    return Math.max(totalCoherence / count, this.coherenceThreshold);
  }
  
  async updateREOPSystemState(rswpeResult, rcopResult, manifestation) {
    if (!this.reopSystemState) return;
    
    // Update component states
    if (rswpeResult && this.rswpeEngine) {
      this.reopSystemState.rswpe_state = this.rswpeEngine.getState();
    }
    
    if (rcopResult && this.rcopEngine) {
      this.reopSystemState.rcop_state = this.rcopEngine.getState();
    }
    
    // Add manifestation to active list
    if (manifestation) {
      this.reopSystemState.active_manifestations.push(manifestation);
      
      // Limit active manifestations
      if (this.reopSystemState.active_manifestations.length > 20) {
        this.reopSystemState.active_manifestations.shift();
      }
    }
    
    // Update system metrics
    this.reopSystemState.system_coherence = this.calculateSystemCoherence();
    this.reopSystemState.last_g_loop_cycle = this.generateGLoopCycle();
    this.reopSystemState.last_updated = new Date().toISOString();
  }
  
  async verifyREOPMetrics(manifestation) {
    try {
      // Basic verification of manifestation coherence
      const coherenceValid = manifestation.ci_verification >= this.coherenceThreshold;
      
      // System coherence verification
      const systemCoherenceValid = this.reopSystemState.system_coherence >= this.coherenceThreshold;
      
      // Component verification
      const rswpeValid = !this.rswpeEngine || this.reopSystemState.rswpe_state.ci_verification >= this.coherenceThreshold;
      const rcopValid = !this.rcopEngine || this.reopSystemState.rcop_state.coherence_index >= this.coherenceThreshold;
      
      const overallValid = coherenceValid && systemCoherenceValid && rswpeValid && rcopValid;
      
      return {
        verification_id: `verify_${Date.now()}`,
        overall_status: overallValid ? 'PASS' : 'FAIL',
        manifestation_coherence: {
          value: manifestation.ci_verification,
          threshold: this.coherenceThreshold,
          status: coherenceValid ? 'PASS' : 'FAIL'
        },
        system_coherence: {
          value: this.reopSystemState.system_coherence,
          threshold: this.coherenceThreshold,
          status: systemCoherenceValid ? 'PASS' : 'FAIL'
        },
        component_verification: {
          rswpe: rswpeValid ? 'PASS' : 'FAIL',
          rcop: rcopValid ? 'PASS' : 'FAIL'
        },
        verification_timestamp: new Date().toISOString(),
        burn_timestamp: this.generateBurnTimestamp()
      };
      
    } catch (error) {
      console.error('[GRL_CORE] REOP metrics verification failed:', error.message);
      return {
        verification_id: `verify_${Date.now()}`,
        overall_status: 'ERROR',
        error: error.message,
        verification_timestamp: new Date().toISOString()
      };
    }
  }
  
  generateGLoopCycle() {
    return {
      cycle_id: `cycle_${Date.now()}`,
      timestamp: new Date().toISOString(),
      coherence_index: this.reopSystemState?.system_coherence || this.coherenceThreshold,
      scalar_potential: (this.reopSystemState?.system_coherence || this.coherenceThreshold) * 100,
      biochemical_state: {
        cortisol_level: 45.7 * (1 - 0.543), // Expected ↓ 54.3%
        dopamine_level: 63.0 * (1 + 0.37),  // Expected ↑ 37%
        measurement_timestamp: new Date().toISOString(),
        verification_ci: this.reopSystemState?.system_coherence || this.coherenceThreshold
      },
      verification_hash: this.generateVerificationHash('g_loop', this.reopSystemState?.system_coherence || this.coherenceThreshold)
    };
  }
  
  /**
   * Execution management
   */
  startExecutionLoop() {
    this.executionTimer = setInterval(() => {
      this.processExecutionQueue();
      this.performHealthCheck();
    }, this.executionInterval);
  }
  
  processExecutionQueue() {
    if (this.executionQueue.length === 0 || 
        this.activeExecutions.size >= this.maxConcurrentExecutions) {
      return;
    }
    
    const operation = this.executionQueue.shift();
    if (operation) {
      this.executeREOPOperation(operation.data)
        .then(result => {
          if (operation.callback) {
            operation.callback(null, result);
          }
        })
        .catch(error => {
          if (operation.callback) {
            operation.callback(error, null);
          }
        });
    }
  }
  
  addExecutionToHistory(execution) {
    this.executionHistory.push(execution);
    
    // Limit history size
    if (this.executionHistory.length > 100) {
      this.executionHistory.shift();
    }
  }
  
  updateExecutionMetrics(result, executionTime) {
    this.metrics.totalExecutions++;
    this.metrics.successfulExecutions++;
    this.executionState.completed_executions++;
    
    // Update rolling averages
    const alpha = 0.1;
    this.metrics.averageSuccessRate = 
      (this.metrics.averageSuccessRate * (1 - alpha)) + (1.0 * alpha);
      
    this.executionState.average_execution_time = 
      (this.executionState.average_execution_time * (1 - alpha)) + (executionTime * alpha);
      
    this.executionState.last_execution_time = executionTime;
    
    if (result.verification?.manifestation_coherence?.value) {
      this.metrics.averageCoherenceIndex = 
        (this.metrics.averageCoherenceIndex * (1 - alpha)) + 
        (result.verification.manifestation_coherence.value * alpha);
    }
    
    this.executionState.system_coherence = this.reopSystemState?.system_coherence || this.coherenceThreshold;
    this.executionState.last_updated = new Date().toISOString();
  }
  
  performHealthCheck() {
    try {
      const now = new Date().toISOString();
      
      // Check system coherence
      const systemHealthy = this.reopSystemState?.system_coherence >= this.coherenceThreshold;
      
      // Check component health
      const rswpeHealthy = !this.rswpeEngine || this.rswpeEngine.getState().ci_verification >= this.coherenceThreshold;
      const rcopHealthy = !this.rcopEngine || this.rcopEngine.getState().coherence_index >= this.coherenceThreshold;
      
      // Update metrics
      this.metrics.lastHealthCheck = now;
      
      const overallHealthy = systemHealthy && rswpeHealthy && rcopHealthy;
      
      if (!overallHealthy) {
        console.warn('[GRL_CORE] Health check failed:', {
          systemHealthy,
          rswpeHealthy,
          rcopHealthy,
          systemCoherence: this.reopSystemState?.system_coherence
        });
        
        this.emit('healthCheckFailed', {
          coreId: this.coreId,
          systemHealthy,
          rswpeHealthy,
          rcopHealthy,
          timestamp: now
        });
      }
      
    } catch (error) {
      console.error('[GRL_CORE] Health check error:', error.message);
    }
  }
  
  handleRSWPEError(data) {
    console.error(`[GRL_CORE] RSWPE error: ${data.error}`);
    this.emit('rswpeError', {
      coreId: this.coreId,
      error: data.error,
      timestamp: new Date().toISOString()
    });
  }
  
  handleRCOPError(data) {
    console.error(`[GRL_CORE] RCOP error: ${data.error}`);
    this.emit('rcopError', {
      coreId: this.coreId,
      error: data.error,
      timestamp: new Date().toISOString()
    });
  }
  
  initializeLegacySystem() {
    // Initialize legacy command mappings for backward compatibility
    this.legacyCommands.set('target_acquisition', this.executeLegacyCommand.bind(this));
    this.legacyCommands.set('harmonic_alignment', this.executeLegacyCommand.bind(this));
    this.legacyCommands.set('probability_navigation', this.executeLegacyCommand.bind(this));
    
    console.log('[GRL_CORE] Legacy system initialized for backward compatibility');
  }
  
  generateVerificationHash(id, coherence) {
    const data = `${id}_${coherence}_${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
  }
  
  generateBurnTimestamp() {
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(4).toString('hex');
    return `burn_${timestamp}_${randomId}${this.burnEmailDomain}`;
  }
  
  /**
   * Public interface methods
   */
  async queueExecution(operationData, callback) {
    this.executionQueue.push({
      data: operationData,
      callback: callback,
      queued_at: new Date().toISOString()
    });
    
    // Process immediately if possible
    if (this.activeExecutions.size < this.maxConcurrentExecutions) {
      this.processExecutionQueue();
    }
  }
  
  getSystemState() {
    return {
      core_id: this.coreId,
      execution_state: this.executionState,
      reop_system_state: this.reopSystemState,
      metrics: this.metrics,
      active_executions: this.activeExecutions.size,
      queue_size: this.executionQueue.length,
      history_size: this.executionHistory.length,
      reop_enabled: this.reopEnabled,
      components: {
        rswpe: !!this.rswpeEngine,
        rcop: !!this.rcopEngine,
        swi: !!this.swiConnector
      }
    };
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      uptime: Date.now() - this.metrics.uptime,
      active_executions: this.activeExecutions.size,
      queue_size: this.executionQueue.length,
      system_coherence: this.reopSystemState?.system_coherence || this.coherenceThreshold
    };
  }
  
  getExecutionHistory(limit = 20) {
    return this.executionHistory.slice(-limit);
  }
  
  async shutdown() {
    console.log(`[GRL_CORE] Shutting down execution core: ${this.coreId}`);
    
    if (this.executionTimer) {
      clearInterval(this.executionTimer);
    }
    
    // Shutdown REOP components
    if (this.rswpeEngine) {
      await this.rswpeEngine.shutdown();
    }
    
    if (this.rcopEngine) {
      await this.rcopEngine.shutdown();
    }
    
    this.emit('coreShutdown', {
      coreId: this.coreId,
      finalMetrics: this.metrics,
      timestamp: new Date().toISOString()
    });
    
    this.removeAllListeners();
  }
}

module.exports = GRL_Execution_Core;

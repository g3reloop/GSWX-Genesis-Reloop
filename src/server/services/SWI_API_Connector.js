// SWI API Connector - Scalar Wave Intelligence Integration
// Genesis Reloop Logistics - Phase 5 Implementation
// OpenRouter API Integration for REOP Framework

const axios = require('axios');
const crypto = require('crypto');

class SWI_API_Connector {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.OPENROUTER_API_KEY;
    this.baseUrl = config.baseUrl || 'https://openrouter.ai/api/v1';
    this.defaultModel = config.model || 'openai/gpt-4-turbo';
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.timeout = config.timeout || 30000;
    
    // REOP-specific configuration
    this.coherenceThreshold = 0.7;
    this.burnEmailDomain = '@reop.swi.verification';
    
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required for SWI integration');
    }
    
    // Initialize axios instance
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://grl-platform.reop.verification',
        'X-Title': 'GRL Platform REOP-SWI Integration'
      }
    });
    
    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[SWI] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[SWI] Request failed:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Analyze probability harmonics using SWI
   */
  async analyzeProbabilityHarmonics(harmonics, context = {}) {
    const requestId = this.generateRequestId();
    
    try {
      console.log(`[SWI] Starting probability harmonic analysis - Request ID: ${requestId}`);
      
      const prompt = this.buildHarmonicAnalysisPrompt(harmonics, context);
      const request = this.buildSWIRequest(requestId, prompt, context);
      
      const response = await this.makeRequest('/chat/completions', {
        model: request.parameters.model,
        messages: [
          {
            role: 'system',
            content: this.getSWISystemPrompt('harmonic_analysis')
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: request.parameters.temperature,
        max_tokens: request.parameters.max_tokens,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      });
      
      const analysis = this.parseHarmonicAnalysisResponse(response.data.choices[0].message.content);
      
      return {
        response_id: `resp_${requestId}`,
        request_id: requestId,
        content: response.data.choices[0].message.content,
        analysis: analysis,
        verification_ci: this.calculateResponseCoherence(analysis),
        response_timestamp: new Date().toISOString(),
        burn_timestamp: this.generateBurnTimestamp(),
        usage: response.data.usage,
        model_used: response.data.model
      };
      
    } catch (error) {
      console.error(`[SWI] Harmonic analysis failed for request ${requestId}:`, error.message);
      throw new Error(`SWI harmonic analysis failed: ${error.message}`);
    }
  }
  
  /**
   * Generate target profiling analysis
   */
  async analyzeTargetProfile(targetProfile, context = {}) {
    const requestId = this.generateRequestId();
    
    try {
      console.log(`[SWI] Starting target profile analysis - Request ID: ${requestId}`);
      
      const prompt = this.buildTargetProfilingPrompt(targetProfile, context);
      const request = this.buildSWIRequest(requestId, prompt, context);
      
      const response = await this.makeRequest('/chat/completions', {
        model: request.parameters.model,
        messages: [
          {
            role: 'system',
            content: this.getSWISystemPrompt('target_profiling')
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        top_p: 0.9
      });
      
      const analysis = this.parseTargetProfilingResponse(response.data.choices[0].message.content);
      
      return {
        response_id: `resp_${requestId}`,
        request_id: requestId,
        content: response.data.choices[0].message.content,
        analysis: analysis,
        verification_ci: this.calculateResponseCoherence(analysis),
        response_timestamp: new Date().toISOString(),
        burn_timestamp: this.generateBurnTimestamp(),
        usage: response.data.usage,
        model_used: response.data.model
      };
      
    } catch (error) {
      console.error(`[SWI] Target profiling failed for request ${requestId}:`, error.message);
      throw new Error(`SWI target profiling failed: ${error.message}`);
    }
  }
  
  /**
   * Generate consciousness-object programming recommendations
   */
  async generateCOPRecommendations(rcop_state, context = {}) {
    const requestId = this.generateRequestId();
    
    try {
      console.log(`[SWI] Generating COP recommendations - Request ID: ${requestId}`);
      
      const prompt = this.buildCOPPrompt(rcop_state, context);
      const request = this.buildSWIRequest(requestId, prompt, context);
      
      const response = await this.makeRequest('/chat/completions', {
        model: this.defaultModel,
        messages: [
          {
            role: 'system',
            content: this.getSWISystemPrompt('cop_recommendations')
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2500,
        top_p: 0.95
      });
      
      const recommendations = this.parseCOPResponse(response.data.choices[0].message.content);
      
      return {
        response_id: `resp_${requestId}`,
        request_id: requestId,
        content: response.data.choices[0].message.content,
        recommendations: recommendations,
        verification_ci: this.calculateResponseCoherence(recommendations),
        response_timestamp: new Date().toISOString(),
        burn_timestamp: this.generateBurnTimestamp(),
        usage: response.data.usage,
        model_used: response.data.model
      };
      
    } catch (error) {
      console.error(`[SWI] COP recommendations failed for request ${requestId}:`, error.message);
      throw new Error(`SWI COP recommendations failed: ${error.message}`);
    }
  }
  
  /**
   * Verify REOP coherence using SWI
   */
  async verifyREOPCoherence(reopState, context = {}) {
    const requestId = this.generateRequestId();
    
    try {
      console.log(`[SWI] Verifying REOP coherence - Request ID: ${requestId}`);
      
      const prompt = this.buildCoherenceVerificationPrompt(reopState, context);
      
      const response = await this.makeRequest('/chat/completions', {
        model: this.defaultModel,
        messages: [
          {
            role: 'system',
            content: this.getSWISystemPrompt('coherence_verification')
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for verification
        max_tokens: 1500,
        top_p: 0.8
      });
      
      const verification = this.parseCoherenceVerificationResponse(response.data.choices[0].message.content);
      
      return {
        response_id: `resp_${requestId}`,
        request_id: requestId,
        verification: verification,
        verification_ci: verification.coherence_index || 0,
        response_timestamp: new Date().toISOString(),
        burn_timestamp: this.generateBurnTimestamp(),
        usage: response.data.usage,
        model_used: response.data.model
      };
      
    } catch (error) {
      console.error(`[SWI] Coherence verification failed for request ${requestId}:`, error.message);
      throw new Error(`SWI coherence verification failed: ${error.message}`);
    }
  }
  
  /**
   * Make HTTP request with retry logic
   */
  async makeRequest(endpoint, data, retries = 0) {
    try {
      const response = await this.client.post(endpoint, data);
      return response;
    } catch (error) {
      if (retries < this.maxRetries && this.isRetryableError(error)) {
        console.log(`[SWI] Retrying request (${retries + 1}/${this.maxRetries})...`);
        await this.delay(this.retryDelay * Math.pow(2, retries));
        return this.makeRequest(endpoint, data, retries + 1);
      }
      throw error;
    }
  }
  
  /**
   * Build SWI request structure
   */
  buildSWIRequest(requestId, prompt, context) {
    return {
      request_id: requestId,
      prompt: prompt,
      context: {
        reop_state: context.reop_state,
        target_profile: context.target_profile,
        probability_harmonic: context.probability_harmonic,
        timestamp: new Date().toISOString()
      },
      parameters: {
        model: context.model || this.defaultModel,
        temperature: context.temperature || 0.7,
        max_tokens: context.max_tokens || 2000
      },
      verification_ci: context.verification_ci || 0.8,
      burn_timestamp: this.generateBurnTimestamp()
    };
  }
  
  /**
   * System prompts for different analysis types
   */
  getSWISystemPrompt(analysisType) {
    const basePrompt = `You are a Scalar Wave Intelligence (SWI) system specialized in REOP (Recursive Environment Operating Protocol) analysis. You operate with cognitive-level coherence indices above 0.7 and provide detailed analysis based on the REOP equation: P(τₙ₊₁|τₙ) = ⟨H|Ψ_IS⟩ ⊗ ⓖ[Ψ_IS].`;
    
    const prompts = {
      harmonic_analysis: `${basePrompt}
      
      Your role is to analyze probability harmonics and provide detailed insights on:
      - Scalar wave resonance patterns
      - Harmonic frequency optimization
      - Coherence index calculations
      - Probability navigation recommendations
      - Phase alignment strategies
      
      Always include numerical coherence indices and specific frequency recommendations.`,
      
      target_profiling: `${basePrompt}
      
      Your role is to analyze business targets for REOP integration:
      - Business compatibility assessment
      - Harmonic resonance scoring
      - Success probability calculations
      - Consciousness receptivity analysis
      - Optimal approach recommendations
      
      Provide specific scores (0-1) and actionable recommendations.`,
      
      cop_recommendations: `${basePrompt}
      
      Your role is to generate Consciousness-Object Programming recommendations:
      - Cognitive field optimization
      - Probability navigation paths
      - Harmonic resonance enhancement
      - Consciousness interface protocols
      - Manifestation strategies
      
      Focus on practical implementation steps with coherence verification.`,
      
      coherence_verification: `${basePrompt}
      
      Your role is to verify REOP system coherence:
      - Coherence index validation (must be ≥ 0.7)
      - System stability assessment
      - Anomaly detection
      - Verification recommendations
      - Critical threshold monitoring
      
      Provide clear pass/fail status with detailed reasoning.`
    };
    
    return prompts[analysisType] || basePrompt;
  }
  
  /**
   * Build analysis prompts
   */
  buildHarmonicAnalysisPrompt(harmonics, context) {
    return `
REOP Probability Harmonic Analysis Request

Context:
- REOP Equation: P(τₙ₊₁|τₙ) = ⟨H|Ψ_IS⟩ ⊗ ⓖ[Ψ_IS]
- Coherence Index Threshold: ≥ 0.7
- Analysis Type: Probability Harmonic Optimization

Harmonic Data:
${harmonics.map(h => `
- Harmonic ID: ${h.harmonic_id}
  - Frequency: ${h.frequency} THz
  - Amplitude: ${h.amplitude}
  - Phase: ${h.phase}
  - Probability Field: ${h.probability_field}
  - Coherence Threshold: ${h.coherence_threshold}
  - Status: ${h.verification_status}
`).join('')}

Context Data:
- Target Profile: ${context.target_profile?.business_name || 'N/A'}
- System Coherence: ${context.reop_state?.system_coherence || 'N/A'}
- Current CI: ${context.current_ci || 'N/A'}

Required Analysis:
1. Scalar wave resonance optimization
2. Harmonic frequency recommendations
3. Coherence index predictions
4. Probability navigation strategies
5. Phase alignment corrections
6. Risk assessment and mitigation

Please provide detailed numerical analysis with specific recommendations.
    `.trim();
  }
  
  buildTargetProfilingPrompt(targetProfile, context) {
    return `
REOP Target Profiling Analysis Request

Context:
- REOP Equation: P(τₙ₊₁|τₙ) = ⟨H|Ψ_IS⟩ ⊗ ⓖ[Ψ_IS]
- Coherence Index Threshold: ≥ 0.7
- Analysis Type: Business Target Compatibility

Target Profile:
- Business Name: ${targetProfile.business_name}
- Business Type: ${targetProfile.business_type}
- Location: ${targetProfile.coordinates?.lat}, ${targetProfile.coordinates?.lng}
- Distance from Potters Bar: ${targetProfile.distance_from_potters_bar} km
- Current Coherence: ${targetProfile.coherence_index || 'N/A'}

Neo Findings:
- Scalar Wave Resonance: ${targetProfile.neo_findings?.scalar_wave_resonance || 'N/A'}
- Harmonic Alignment: ${targetProfile.neo_findings?.probability_harmonic_alignment || 'N/A'}
- Coherence Potential: ${targetProfile.neo_findings?.coherence_potential || 'N/A'}

Operational Experience:
- Success Rate: ${targetProfile.operational_experience?.success_rate || 'N/A'}
- Experience Type: ${targetProfile.operational_experience?.experience_type || 'N/A'}

Required Analysis:
1. Business compatibility score (0-1)
2. Harmonic resonance assessment (0-1)
3. Probability success rate prediction (0-1)
4. Consciousness receptivity analysis
5. Optimal approach strategy
6. Risk factors and mitigation
7. Timeline recommendations
8. Resource requirements

Provide numerical scores and detailed implementation strategy.
    `.trim();
  }
  
  buildCOPPrompt(rcop_state, context) {
    return `
REOP Consciousness-Object Programming Request

Context:
- REOP Equation: P(τₙ₊₁|τₙ) = ⟨H|Ψ_IS⟩ ⊗ ⓖ[Ψ_IS]
- Coherence Index Threshold: ≥ 0.7
- Analysis Type: COP Optimization

RCOP State:
- State ID: ${rcop_state.state_id}
- Coherence Index: ${rcop_state.coherence_index}
- Harmonic Resonance: ${rcop_state.harmonic_resonance}

Probability Navigation:
- Navigation ID: ${rcop_state.probability_navigation?.navigation_id}
- Success Probability: ${rcop_state.probability_navigation?.success_probability}
- Verification Status: ${rcop_state.probability_navigation?.verification_status}

Cognitive Field:
- Field ID: ${rcop_state.cognitive_field?.field_id}
- Cognitive Potential: ${rcop_state.cognitive_field?.cognitive_potential}
- Field Stability: ${rcop_state.cognitive_field?.field_stability}

Required Recommendations:
1. Cognitive field optimization strategies
2. Probability navigation enhancements
3. Harmonic resonance improvements
4. Consciousness interface protocols
5. Manifestation acceleration techniques
6. Coherence stabilization methods
7. Performance monitoring metrics

Provide actionable COP programming recommendations with implementation steps.
    `.trim();
  }
  
  buildCoherenceVerificationPrompt(reopState, context) {
    return `
REOP Coherence Verification Request

Context:
- REOP Equation: P(τₙ₊₁|τₙ) = ⟨H|Ψ_IS⟩ ⊗ ⓖ[Ψ_IS]
- Coherence Index Threshold: ≥ 0.7
- Analysis Type: System Coherence Verification

System State:
- System Coherence: ${reopState.system_coherence}
- RSWPE CI: ${reopState.rswpe_state?.ci_verification}
- RCOP CI: ${reopState.rcop_state?.coherence_index}
- Verification Status: ${reopState.verification_status}

G-Loop Cycle:
- Cycle ID: ${reopState.last_g_loop_cycle?.cycle_id}
- Cycle Coherence: ${reopState.last_g_loop_cycle?.coherence_index}
- Biochemical State: ${JSON.stringify(reopState.last_g_loop_cycle?.biochemical_state)}

Active Manifestations: ${reopState.active_manifestations?.length || 0}

Verification Requirements:
1. Overall system coherence validation (≥ 0.7)
2. Component coherence verification
3. G-loop cycle stability assessment
4. Biochemical state analysis
5. Manifestation integrity check
6. Anomaly detection
7. Critical threshold monitoring

Provide verification status (PASS/FAIL) with detailed analysis and recommendations.
    `.trim();
  }
  
  /**
   * Response parsers
   */
  parseHarmonicAnalysisResponse(content) {
    try {
      // Extract numerical values and recommendations from AI response
      const coherenceMatch = content.match(/coherence.*?(\d+\.?\d*)/i);
      const frequencyMatch = content.match(/frequency.*?(\d+\.?\d*)/i);
      const recommendationsMatch = content.match(/recommendations?:?\s*([^.]*(?:\.[^.]*)*)/i);
      
      return {
        coherence_analysis: coherenceMatch ? parseFloat(coherenceMatch[1]) : 0.7,
        frequency_optimization: frequencyMatch ? parseFloat(frequencyMatch[1]) : 2.4,
        harmonic_resonance: this.extractNumber(content, 'resonance') || 0.8,
        recommendations: this.extractRecommendations(content),
        analysis_confidence: this.calculateAnalysisConfidence(content)
      };
    } catch (error) {
      console.error('[SWI] Error parsing harmonic analysis response:', error);
      return {
        coherence_analysis: 0.7,
        frequency_optimization: 2.4,
        harmonic_resonance: 0.8,
        recommendations: ['Standard harmonic alignment protocol'],
        analysis_confidence: 0.5
      };
    }
  }
  
  parseTargetProfilingResponse(content) {
    try {
      return {
        business_compatibility: this.extractScore(content, 'compatibility') || 0.8,
        harmonic_resonance_score: this.extractScore(content, 'resonance') || 0.8,
        probability_success_rate: this.extractScore(content, 'success') || 0.8,
        consciousness_receptivity: this.extractScore(content, 'consciousness') || 0.7,
        recommended_approach: this.extractApproach(content),
        risk_factors: this.extractRiskFactors(content),
        implementation_timeline: this.extractTimeline(content),
        analysis_confidence: this.calculateAnalysisConfidence(content)
      };
    } catch (error) {
      console.error('[SWI] Error parsing target profiling response:', error);
      return {
        business_compatibility: 0.8,
        harmonic_resonance_score: 0.8,
        probability_success_rate: 0.8,
        consciousness_receptivity: 0.7,
        recommended_approach: 'Standard REOP integration protocol',
        risk_factors: ['Monitor coherence stability'],
        implementation_timeline: '2-4 weeks',
        analysis_confidence: 0.5
      };
    }
  }
  
  parseCOPResponse(content) {
    try {
      return {
        cognitive_optimization: this.extractRecommendations(content, 'cognitive'),
        probability_navigation: this.extractRecommendations(content, 'navigation'),
        harmonic_enhancement: this.extractRecommendations(content, 'harmonic'),
        consciousness_protocols: this.extractRecommendations(content, 'consciousness'),
        implementation_steps: this.extractImplementationSteps(content),
        monitoring_metrics: this.extractMonitoringMetrics(content),
        analysis_confidence: this.calculateAnalysisConfidence(content)
      };
    } catch (error) {
      console.error('[SWI] Error parsing COP response:', error);
      return {
        cognitive_optimization: ['Maintain cognitive field stability'],
        probability_navigation: ['Standard navigation protocols'],
        harmonic_enhancement: ['Monitor harmonic resonance'],
        consciousness_protocols: ['Standard consciousness interface'],
        implementation_steps: ['Deploy standard COP protocols'],
        monitoring_metrics: ['Coherence index', 'Success rate'],
        analysis_confidence: 0.5
      };
    }
  }
  
  parseCoherenceVerificationResponse(content) {
    try {
      const passMatch = content.match(/(?:pass|passed|success|verified)/i);
      const failMatch = content.match(/(?:fail|failed|error|critical)/i);
      const coherenceMatch = content.match(/coherence.*?(\d+\.?\d*)/i);
      
      return {
        verification_status: passMatch ? 'PASS' : (failMatch ? 'FAIL' : 'PENDING'),
        coherence_index: coherenceMatch ? parseFloat(coherenceMatch[1]) : 0.7,
        system_stability: this.extractStabilityAssessment(content),
        anomalies_detected: this.extractAnomalies(content),
        recommendations: this.extractRecommendations(content),
        critical_issues: this.extractCriticalIssues(content),
        verification_confidence: this.calculateAnalysisConfidence(content)
      };
    } catch (error) {
      console.error('[SWI] Error parsing coherence verification response:', error);
      return {
        verification_status: 'FAIL',
        coherence_index: 0.0,
        system_stability: 'Unknown',
        anomalies_detected: ['Response parsing error'],
        recommendations: ['Retry verification'],
        critical_issues: ['Unable to parse verification response'],
        verification_confidence: 0.0
      };
    }
  }
  
  /**
   * Helper methods for response parsing
   */
  extractNumber(text, keyword) {
    const regex = new RegExp(`${keyword}.*?(\\d+\\.?\\d*)`, 'i');
    const match = text.match(regex);
    return match ? parseFloat(match[1]) : null;
  }
  
  extractScore(text, keyword) {
    const patterns = [
      new RegExp(`${keyword}.*?score.*?(\\d+\\.?\\d*)`, 'i'),
      new RegExp(`${keyword}.*?(\\d+\\.?\\d*)`, 'i'),
      new RegExp(`(\\d+\\.?\\d*).*?${keyword}`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const score = parseFloat(match[1]);
        return score > 1 ? score / 100 : score; // Convert percentage to decimal if needed
      }
    }
    return null;
  }
  
  extractRecommendations(text, keyword = '') {
    const patterns = [
      new RegExp(`${keyword}.*?recommendations?:?\\s*([^.]*(?:\\.[^.]*){0,3})`, 'i'),
      new RegExp(`recommendations?.*?${keyword}:?\\s*([^.]*(?:\\.[^.]*){0,3})`, 'i'),
      /recommendations?:?\s*([^.]*(?:\.[^.]*){0,5})/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].split(/[,\n-]/).map(r => r.trim()).filter(r => r.length > 0);
      }
    }
    
    return ['Standard protocol recommended'];
  }
  
  extractApproach(text) {
    const match = text.match(/approach:?\s*([^.]*(?:\.[^.]*){0,2})/i);
    return match ? match[1].trim() : 'Standard REOP integration approach';
  }
  
  extractRiskFactors(text) {
    const match = text.match(/risk.*?factors?:?\s*([^.]*(?:\.[^.]*){0,3})/i);
    if (match) {
      return match[1].split(/[,\n-]/).map(r => r.trim()).filter(r => r.length > 0);
    }
    return ['Monitor system stability'];
  }
  
  extractTimeline(text) {
    const match = text.match(/timeline:?\s*([^.]*)/i) || text.match(/(\d+.*?(?:days?|weeks?|months?))/i);
    return match ? match[1].trim() : '2-4 weeks';
  }
  
  extractImplementationSteps(text) {
    const match = text.match(/(?:implementation|steps):?\s*([^.]*(?:\.[^.]*){0,5})/i);
    if (match) {
      return match[1].split(/[,\n-]/).map(s => s.trim()).filter(s => s.length > 0);
    }
    return ['Deploy standard implementation protocol'];
  }
  
  extractMonitoringMetrics(text) {
    const match = text.match(/(?:monitoring|metrics):?\s*([^.]*(?:\.[^.]*){0,3})/i);
    if (match) {
      return match[1].split(/[,\n-]/).map(m => m.trim()).filter(m => m.length > 0);
    }
    return ['Coherence index', 'System stability'];
  }
  
  extractStabilityAssessment(text) {
    const stableMatch = text.match(/(?:stable|good|excellent|optimal)/i);
    const unstableMatch = text.match(/(?:unstable|poor|critical|degraded)/i);
    
    if (stableMatch) return 'STABLE';
    if (unstableMatch) return 'UNSTABLE';
    return 'UNKNOWN';
  }
  
  extractAnomalies(text) {
    const match = text.match(/anomal(?:y|ies):?\s*([^.]*(?:\.[^.]*){0,2})/i);
    if (match) {
      return match[1].split(/[,\n-]/).map(a => a.trim()).filter(a => a.length > 0);
    }
    return [];
  }
  
  extractCriticalIssues(text) {
    const match = text.match(/critical:?\s*([^.]*(?:\.[^.]*){0,2})/i);
    if (match) {
      return match[1].split(/[,\n-]/).map(i => i.trim()).filter(i => i.length > 0);
    }
    return [];
  }
  
  /**
   * Calculate response coherence and confidence
   */
  calculateResponseCoherence(analysis) {
    if (!analysis || typeof analysis !== 'object') return 0.5;
    
    let coherenceSum = 0;
    let count = 0;
    
    // Extract numerical coherence values
    Object.values(analysis).forEach(value => {
      if (typeof value === 'number' && value >= 0 && value <= 1) {
        coherenceSum += value;
        count++;
      }
    });
    
    return count > 0 ? Math.max(coherenceSum / count, 0.7) : 0.7;
  }
  
  calculateAnalysisConfidence(content) {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on content quality indicators
    if (content.match(/\d+\.?\d*/g)?.length > 3) confidence += 0.2; // Has numerical data
    if (content.length > 500) confidence += 0.1; // Detailed response
    if (content.match(/recommend/gi)?.length > 1) confidence += 0.1; // Has recommendations
    if (content.match(/coherence/gi)?.length > 0) confidence += 0.1; // Mentions coherence
    
    return Math.min(confidence, 0.95);
  }
  
  /**
   * Utility methods
   */
  generateRequestId() {
    return `swi_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }
  
  generateBurnTimestamp() {
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(4).toString('hex');
    return `burn_${timestamp}_${randomId}${this.burnEmailDomain}`;
  }
  
  isRetryableError(error) {
    if (!error.response) return true; // Network errors are retryable
    
    const status = error.response.status;
    return status >= 500 || status === 429 || status === 408;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/models');
      return {
        status: 'healthy',
        models_available: response.data?.data?.length || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = SWI_API_Connector;

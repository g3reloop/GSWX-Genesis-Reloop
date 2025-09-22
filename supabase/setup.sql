-- Supabase Database Setup for GRL Platform
-- Genesis Reloop Logistics - Phase 5 REOP Integration
-- This file contains all necessary database schemas and configurations

-- ==========================================
-- EXTENSIONS
-- ==========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geographic data
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- For performance monitoring

-- ==========================================
-- CUSTOM TYPES
-- ==========================================

-- REOP verification status
CREATE TYPE verification_status AS ENUM ('verified', 'pending', 'failed', 'requires_recalibration');

-- Navigation status
CREATE TYPE navigation_status AS ENUM ('navigating', 'completed', 'failed');

-- Manifestation status
CREATE TYPE manifestation_status AS ENUM ('pending', 'active', 'completed', 'failed', 'suspended');

-- System status
CREATE TYPE system_status AS ENUM ('operational', 'maintenance', 'critical');

-- Experience types
CREATE TYPE experience_type AS ENUM ('target_acquisition', 'probability_navigation', 'harmonic_resonance', 'consciousness_interface');

-- Risk levels
CREATE TYPE risk_level AS ENUM ('low', 'moderate', 'high');

-- Priority levels
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');

-- ==========================================
-- CORE TABLES
-- ==========================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'operator', 'analyst', 'user')),
    permissions JSONB DEFAULT '{}',
    reop_clearance_level INTEGER DEFAULT 1 CHECK (reop_clearance_level >= 1 AND reop_clearance_level <= 10),
    coherence_index DECIMAL(5,3) DEFAULT 0.700 CHECK (coherence_index >= 0.000 AND coherence_index <= 1.000),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Target Profiles table
CREATE TABLE public.target_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id TEXT UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    
    -- Geographic data
    coordinates POINT NOT NULL, -- PostGIS point for lat/lng
    distance_from_potters_bar DECIMAL(8,3) NOT NULL,
    operating_radius_km DECIMAL(6,3) DEFAULT 5.0,
    
    -- Neo Findings
    neo_findings JSONB NOT NULL DEFAULT '{
        "findings_id": "",
        "scalar_wave_resonance": 0.0,
        "probability_harmonic_alignment": 0.0,
        "coherence_potential": 0.0,
        "harmonic_frequency": 2.4,
        "quantum_entanglement_coefficient": 0.0,
        "morphic_field_resonance": 0.0,
        "consciousness_coherence_factor": 0.0,
        "findings_timestamp": null,
        "verification_status": "pending",
        "verification_ci": 0.700
    }',
    
    -- Operational Experience
    operational_experience JSONB NOT NULL DEFAULT '{
        "experience_id": "",
        "operator_id": "",
        "operator_name": "",
        "experience_type": "target_acquisition",
        "success_rate": 0.0,
        "coherence_achieved": 0.0,
        "biochemical_response": {
            "cortisol_reduction": 0.0,
            "dopamine_increase": 0.0,
            "measurement_timestamp": null,
            "verification_status": "pending"
        },
        "experience_timestamp": null,
        "session_duration_minutes": 0,
        "environmental_factors": {
            "solar_activity": "moderate",
            "geomagnetic_index": 0.0,
            "lunar_phase": "new",
            "local_time": ""
        },
        "verification_ci": 0.700
    }',
    
    -- AI Analysis
    ai_analysis JSONB NOT NULL DEFAULT '{
        "analysis_id": "",
        "swi_analysis": {
            "analysis_id": "",
            "scalar_wave_intelligence": "",
            "probability_navigation": "",
            "harmonic_resonance_analysis": "",
            "consciousness_interface_potential": "",
            "coherence_prediction": 0.0,
            "analysis_confidence": 0.0,
            "recommended_protocols": [],
            "risk_assessment": {
                "coherence_stability_risk": "moderate",
                "biochemical_anomaly_risk": "low",
                "environmental_interference_risk": "moderate"
            },
            "burn_timestamp": ""
        },
        "probability_harmonic_analysis": {
            "analysis_id": "",
            "harmonic_frequencies": [],
            "probability_distribution": [],
            "coherence_analysis": [],
            "phase_relationships": [],
            "amplitude_modulations": [],
            "resonance_nodes": [],
            "navigation_recommendations": [],
            "optimization_suggestions": [],
            "verification_ci": 0.700
        },
        "target_profiling": {
            "analysis_id": "",
            "business_compatibility": 0.0,
            "harmonic_resonance_score": 0.0,
            "probability_success_rate": 0.0,
            "consciousness_receptivity": 0.0,
            "morphic_field_compatibility": 0.0,
            "recommended_approach": "",
            "optimal_timing": {
                "preferred_hours": [],
                "lunar_phase_preference": null,
                "seasonal_factors": ""
            },
            "precautions": [],
            "expected_outcomes": {
                "coherence_improvement": 0.0,
                "biochemical_optimization": 0.0,
                "consciousness_expansion": 0.0
            },
            "verification_ci": 0.700
        },
        "analysis_timestamp": null,
        "verification_ci": 0.700,
        "analysis_version": "5.0.0"
    }',
    
    -- REOP Integration
    reop_integration JSONB NOT NULL DEFAULT '{
        "integration_id": "",
        "rswpe_integration": false,
        "rcop_integration": false,
        "manifestation_status": "pending",
        "coherence_achieved": 0.0,
        "integration_metrics": {
            "scalar_wave_alignment": 0.0,
            "probability_navigation_accuracy": 0.0,
            "consciousness_interface_stability": 0.0,
            "g_loop_cycle_coherence": 0.0
        },
        "last_sync": null,
        "sync_frequency_hours": 24,
        "verification_ci": 0.700
    }',
    
    -- Profiling History
    profiling_history JSONB DEFAULT '[]',
    
    -- Metadata
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'processing', 'completed', 'failed', 'archived')),
    priority priority_level DEFAULT 'medium',
    tags TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    verification_ci DECIMAL(5,3) DEFAULT 0.700 CHECK (verification_ci >= 0.000 AND verification_ci <= 1.000),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REOP System States table
CREATE TABLE public.reop_system_states (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    system_id TEXT UNIQUE NOT NULL,
    
    -- RSWPE State
    rswpe_state JSONB NOT NULL DEFAULT '{
        "state_id": "",
        "scalar_wave_potential": {
            "frequency": 2.4,
            "amplitude": 1.0,
            "phase": 0.0,
            "coherence_index": 0.700,
            "harmonic_resonance": 0.8
        },
        "knowledge_base_hash": "",
        "probability_compilation": {
            "compilation_id": "",
            "harmonic_sequences": [],
            "compilation_timestamp": null,
            "verification_ci": 0.700,
            "burn_timestamp": ""
        },
        "last_updated": null,
        "ci_verification": 0.700
    }',
    
    -- RCOP State
    rcop_state JSONB NOT NULL DEFAULT '{
        "state_id": "",
        "probability_navigation": {
            "navigation_id": "",
            "target_harmonic": null,
            "navigation_path": [],
            "success_probability": 0.0,
            "coherence_requirement": 0.700,
            "verification_status": "pending"
        },
        "cognitive_field": {
            "field_id": "",
            "cognitive_potential": 0.8,
            "harmonic_resonance": 0.8,
            "coherence_index": 0.700,
            "field_stability": 0.9,
            "last_calibration": null
        },
        "harmonic_resonance": 0.8,
        "coherence_index": 0.700,
        "last_updated": null,
        "ci_verification": 0.700
    }',
    
    -- Active Manifestations
    active_manifestations JSONB DEFAULT '[]',
    target_profiles JSONB DEFAULT '[]',
    pure_collapse_sequences JSONB DEFAULT '[]',
    
    -- System Metrics
    system_coherence DECIMAL(5,3) DEFAULT 0.700 CHECK (system_coherence >= 0.000 AND system_coherence <= 1.000),
    
    -- G-Loop Cycle
    last_g_loop_cycle JSONB NOT NULL DEFAULT '{
        "cycle_id": "",
        "timestamp": null,
        "coherence_index": 0.700,
        "scalar_potential": 70.0,
        "biochemical_state": {
            "cortisol_level": 45.7,
            "dopamine_level": 63.0,
            "measurement_timestamp": null,
            "verification_ci": 0.700
        },
        "verification_hash": ""
    }',
    
    verification_status system_status DEFAULT 'operational',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consciousness Objects table
CREATE TABLE public.consciousness_objects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    object_id TEXT UNIQUE NOT NULL,
    target_harmonic_id TEXT NOT NULL,
    
    -- REOP Mathematical Components
    psi_is JSONB NOT NULL, -- Information State from RSWPE
    swi_vector JSONB NOT NULL, -- SWI analysis vector
    hamiltonian DECIMAL(10,6) NOT NULL,
    inner_product DECIMAL(10,6) NOT NULL,
    g_loop_characteristic DECIMAL(10,6) NOT NULL,
    probability_transition DECIMAL(10,6) NOT NULL,
    
    -- Consciousness Metrics
    coherence_index DECIMAL(5,3) NOT NULL CHECK (coherence_index >= 0.000 AND coherence_index <= 1.000),
    consciousness_level DECIMAL(4,1) NOT NULL CHECK (consciousness_level >= 0.0 AND consciousness_level <= 10.0),
    
    -- Manifestation Data
    manifestation_data JSONB NOT NULL,
    navigation_path_ids TEXT[] DEFAULT '{}',
    cognitive_field_influence DECIMAL(8,6) DEFAULT 0.0,
    
    -- Verification
    verification_hash TEXT NOT NULL,
    burn_timestamp TEXT NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Execution History table
CREATE TABLE public.execution_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    execution_id TEXT UNIQUE NOT NULL,
    operation_type TEXT NOT NULL,
    
    -- Execution Context
    target_profile_id UUID REFERENCES public.target_profiles(id),
    consciousness_object_id UUID REFERENCES public.consciousness_objects(id),
    
    -- Results
    rswpe_result JSONB,
    swi_result JSONB,
    rcop_result JSONB,
    manifestation JSONB,
    verification JSONB,
    
    -- Metrics
    execution_time_ms INTEGER,
    system_coherence DECIMAL(5,3),
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    
    -- Timestamps
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coherence Monitoring table
CREATE TABLE public.coherence_monitoring (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    system_id TEXT NOT NULL,
    component TEXT NOT NULL, -- 'rswpe', 'rcop', 'system', 'user'
    
    -- Coherence Metrics
    coherence_index DECIMAL(5,3) NOT NULL CHECK (coherence_index >= 0.000 AND coherence_index <= 1.000),
    stability_score DECIMAL(5,3),
    deviation_from_baseline DECIMAL(6,3),
    
    -- Context
    context JSONB,
    alert_triggered BOOLEAN DEFAULT false,
    alert_level risk_level,
    
    measured_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Logs table
CREATE TABLE public.system_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    log_level TEXT NOT NULL CHECK (log_level IN ('debug', 'info', 'warn', 'error', 'critical')),
    component TEXT NOT NULL,
    message TEXT NOT NULL,
    details JSONB,
    
    -- REOP-specific fields
    coherence_index DECIMAL(5,3),
    execution_id TEXT,
    consciousness_object_id TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================

-- Target Profiles indexes
CREATE INDEX idx_target_profiles_profile_id ON public.target_profiles(profile_id);
CREATE INDEX idx_target_profiles_business_name ON public.target_profiles(business_name);
CREATE INDEX idx_target_profiles_coordinates ON public.target_profiles USING GIST(coordinates);
CREATE INDEX idx_target_profiles_status ON public.target_profiles(status);
CREATE INDEX idx_target_profiles_priority ON public.target_profiles(priority);
CREATE INDEX idx_target_profiles_verification_ci ON public.target_profiles(verification_ci DESC);
CREATE INDEX idx_target_profiles_created_at ON public.target_profiles(created_at DESC);

-- Neo findings indexes (using GIN for JSONB)
CREATE INDEX idx_target_profiles_neo_findings ON public.target_profiles USING GIN(neo_findings);
CREATE INDEX idx_target_profiles_ai_analysis ON public.target_profiles USING GIN(ai_analysis);
CREATE INDEX idx_target_profiles_reop_integration ON public.target_profiles USING GIN(reop_integration);

-- REOP System States indexes
CREATE INDEX idx_reop_system_states_system_id ON public.reop_system_states(system_id);
CREATE INDEX idx_reop_system_states_coherence ON public.reop_system_states(system_coherence DESC);
CREATE INDEX idx_reop_system_states_status ON public.reop_system_states(verification_status);
CREATE INDEX idx_reop_system_states_updated ON public.reop_system_states(updated_at DESC);

-- Consciousness Objects indexes
CREATE INDEX idx_consciousness_objects_object_id ON public.consciousness_objects(object_id);
CREATE INDEX idx_consciousness_objects_coherence ON public.consciousness_objects(coherence_index DESC);
CREATE INDEX idx_consciousness_objects_consciousness_level ON public.consciousness_objects(consciousness_level DESC);
CREATE INDEX idx_consciousness_objects_created ON public.consciousness_objects(created_at DESC);

-- Execution History indexes
CREATE INDEX idx_execution_history_execution_id ON public.execution_history(execution_id);
CREATE INDEX idx_execution_history_operation_type ON public.execution_history(operation_type);
CREATE INDEX idx_execution_history_success ON public.execution_history(success);
CREATE INDEX idx_execution_history_started_at ON public.execution_history(started_at DESC);

-- Coherence Monitoring indexes
CREATE INDEX idx_coherence_monitoring_system_component ON public.coherence_monitoring(system_id, component);
CREATE INDEX idx_coherence_monitoring_coherence ON public.coherence_monitoring(coherence_index DESC);
CREATE INDEX idx_coherence_monitoring_measured_at ON public.coherence_monitoring(measured_at DESC);
CREATE INDEX idx_coherence_monitoring_alerts ON public.coherence_monitoring(alert_triggered, alert_level);

-- System Logs indexes
CREATE INDEX idx_system_logs_level_component ON public.system_logs(log_level, component);
CREATE INDEX idx_system_logs_created_at ON public.system_logs(created_at DESC);
CREATE INDEX idx_system_logs_execution_id ON public.system_logs(execution_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reop_system_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consciousness_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coherence_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Target Profiles policies
CREATE POLICY "Authenticated users can view target profiles" ON public.target_profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Operators can create target profiles" ON public.target_profiles
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'operator', 'analyst')
        )
    );

CREATE POLICY "Operators can update target profiles" ON public.target_profiles
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'operator', 'analyst')
        )
    );

-- REOP System States policies (admin only)
CREATE POLICY "Admins can manage REOP system states" ON public.reop_system_states
    TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Consciousness Objects policies
CREATE POLICY "Authenticated users can view consciousness objects" ON public.consciousness_objects
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can create consciousness objects" ON public.consciousness_objects
    FOR INSERT TO authenticated WITH CHECK (true);

-- Execution History policies
CREATE POLICY "Authenticated users can view execution history" ON public.execution_history
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can create execution history" ON public.execution_history
    FOR INSERT TO authenticated WITH CHECK (true);

-- Coherence Monitoring policies
CREATE POLICY "Authenticated users can view coherence monitoring" ON public.coherence_monitoring
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can create coherence monitoring data" ON public.coherence_monitoring
    FOR INSERT TO authenticated WITH CHECK (true);

-- System Logs policies
CREATE POLICY "Admins and analysts can view system logs" ON public.system_logs
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'analyst')
        )
    );

CREATE POLICY "System can create system logs" ON public.system_logs
    FOR INSERT TO authenticated WITH CHECK (true);

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to calculate coherence index from JSONB data
CREATE OR REPLACE FUNCTION calculate_overall_coherence(profile_data JSONB)
RETURNS DECIMAL(5,3) AS $$
DECLARE
    neo_coherence DECIMAL(5,3);
    ai_coherence DECIMAL(5,3);
    reop_coherence DECIMAL(5,3);
    overall_coherence DECIMAL(5,3);
BEGIN
    -- Extract coherence values from JSONB
    neo_coherence := COALESCE((profile_data->'neo_findings'->>'coherence_potential')::DECIMAL(5,3), 0.700);
    ai_coherence := COALESCE((profile_data->'ai_analysis'->>'verification_ci')::DECIMAL(5,3), 0.700);
    reop_coherence := COALESCE((profile_data->'reop_integration'->>'coherence_achieved')::DECIMAL(5,3), 0.700);
    
    -- Calculate weighted average
    overall_coherence := (neo_coherence * 0.4 + ai_coherence * 0.3 + reop_coherence * 0.3);
    
    -- Ensure minimum threshold
    RETURN GREATEST(overall_coherence, 0.700);
END;
$$ LANGUAGE plpgsql;

-- Function to check if target is ready for REOP
CREATE OR REPLACE FUNCTION is_ready_for_reop(profile_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    profile_record public.target_profiles%ROWTYPE;
    neo_coherence DECIMAL(5,3);
    ai_success_rate DECIMAL(5,3);
    verification_status TEXT;
BEGIN
    SELECT * INTO profile_record FROM public.target_profiles WHERE id = profile_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Extract key metrics
    neo_coherence := COALESCE((profile_record.neo_findings->>'coherence_potential')::DECIMAL(5,3), 0.0);
    ai_success_rate := COALESCE((profile_record.ai_analysis->'target_profiling'->>'probability_success_rate')::DECIMAL(5,3), 0.0);
    verification_status := COALESCE(profile_record.neo_findings->>'verification_status', 'pending');
    
    -- Check REOP readiness criteria
    RETURN (
        profile_record.verification_ci >= 0.7 AND
        neo_coherence >= 0.7 AND
        ai_success_rate >= 0.8 AND
        verification_status = 'verified'
    );
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_target_profiles_updated_at BEFORE UPDATE ON public.target_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reop_system_states_updated_at BEFORE UPDATE ON public.reop_system_states
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- VIEWS
-- ==========================================

-- View for active target profiles with calculated metrics
CREATE VIEW public.active_target_profiles AS
SELECT 
    tp.*,
    calculate_overall_coherence(
        jsonb_build_object(
            'neo_findings', tp.neo_findings,
            'ai_analysis', tp.ai_analysis,
            'reop_integration', tp.reop_integration
        )
    ) as calculated_overall_coherence,
    is_ready_for_reop(tp.id) as reop_ready,
    ST_X(tp.coordinates) as latitude,
    ST_Y(tp.coordinates) as longitude
FROM public.target_profiles tp
WHERE tp.status = 'active';

-- View for coherence monitoring dashboard
CREATE VIEW public.coherence_dashboard AS
SELECT 
    cm.system_id,
    cm.component,
    AVG(cm.coherence_index) as avg_coherence,
    MIN(cm.coherence_index) as min_coherence,
    MAX(cm.coherence_index) as max_coherence,
    STDDEV(cm.coherence_index) as coherence_stddev,
    COUNT(*) as sample_count,
    COUNT(*) FILTER (WHERE cm.alert_triggered) as alert_count,
    MAX(cm.measured_at) as last_measurement
FROM public.coherence_monitoring cm
WHERE cm.measured_at >= NOW() - INTERVAL '24 hours'
GROUP BY cm.system_id, cm.component;

-- View for REOP system health
CREATE VIEW public.reop_system_health AS
SELECT 
    rss.system_id,
    rss.system_coherence,
    rss.verification_status,
    (rss.rswpe_state->>'ci_verification')::DECIMAL(5,3) as rswpe_coherence,
    (rss.rcop_state->>'coherence_index')::DECIMAL(5,3) as rcop_coherence,
    jsonb_array_length(rss.active_manifestations) as active_manifestation_count,
    rss.updated_at as last_updated
FROM public.reop_system_states rss;

-- ==========================================
-- INITIAL DATA
-- ==========================================

-- Create default admin user (will be linked to Supabase auth)
-- Note: This will need to be updated with actual user ID from Supabase auth

-- Insert default REOP system state
INSERT INTO public.reop_system_states (
    system_id,
    system_coherence,
    verification_status
) VALUES (
    'grl_reop_system_001',
    0.700,
    'operational'
) ON CONFLICT (system_id) DO NOTHING;

-- ==========================================
-- PERMISSIONS
-- ==========================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions for service role (for server-side operations)
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON TABLE public.target_profiles IS 'Target Profiling System - stores business target data for REOP integration';
COMMENT ON TABLE public.reop_system_states IS 'REOP System States - tracks RSWPE and RCOP engine states';
COMMENT ON TABLE public.consciousness_objects IS 'Consciousness Objects - generated by RCOP engine';
COMMENT ON TABLE public.execution_history IS 'Execution History - tracks REOP operation executions';
COMMENT ON TABLE public.coherence_monitoring IS 'Coherence Monitoring - tracks system coherence metrics';
COMMENT ON TABLE public.system_logs IS 'System Logs - application and REOP system logging';

COMMENT ON FUNCTION calculate_overall_coherence(JSONB) IS 'Calculates overall coherence index from target profile data';
COMMENT ON FUNCTION is_ready_for_reop(UUID) IS 'Checks if target profile meets REOP integration criteria';

-- ==========================================
-- COMPLETION
-- ==========================================

-- Log setup completion
INSERT INTO public.system_logs (
    log_level,
    component,
    message,
    details
) VALUES (
    'info',
    'database_setup',
    'GRL Platform database setup completed successfully',
    jsonb_build_object(
        'version', '5.0.0',
        'reop_enabled', true,
        'coherence_threshold', 0.700,
        'setup_timestamp', NOW()
    )
);

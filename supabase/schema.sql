-- GRL Platform Supabase Database Schema
-- Genesis Reloop Platform - Scalar Wave Technology

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE target_type AS ENUM (
    'UCO_to_Biodiesel',
    'Food_Waste_to_Biogas',
    'Textile_Waste_to_Recycled_Materials',
    'Plastic_Waste_to_Recycled_Products',
    'Specialized_Waste_Streams'
);

CREATE TYPE system_status AS ENUM (
    'IDLE',
    'PROCESSING',
    'MAINTENANCE',
    'ERROR'
);

CREATE TYPE dgo_connection_status AS ENUM (
    'pending',
    'active',
    'inactive'
);

CREATE TYPE message_type AS ENUM (
    'HEARTBEAT',
    'TRANSFORMATION_LOG',
    'GSWT_MINT_REQUEST',
    'CRL_ALERT'
);

CREATE TYPE event_type AS ENUM (
    'COLLECTION',
    'TRANSPORT',
    'INTAKE',
    'PROCESSING',
    'OUTPUT_VERIFICATION',
    'GSWT_MINT'
);

CREATE TYPE event_status AS ENUM (
    'COMPLETE',
    'IN_PROGRESS',
    'FAILED'
);

CREATE TYPE crl_threat_level AS ENUM (
    'none',
    'low',
    'high',
    'imminent'
);

CREATE TYPE crl_severity AS ENUM (
    'LOW',
    'MODERATE',
    'CRITICAL'
);

-- Harmonic Targets Table
CREATE TABLE harmonic_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id VARCHAR(50) UNIQUE NOT NULL,
    target_name VARCHAR(255),
    target_type target_type NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_long DECIMAL(11, 8) NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_address TEXT NOT NULL,
    waste_stream_volume_daily VARCHAR(50) NOT NULL,
    waste_stream_volume_weekly VARCHAR(50) NOT NULL,
    waste_stream_volume_monthly VARCHAR(50) NOT NULL,
    current_babylonian_processing TEXT NOT NULL,
    gswx_transformation_protocol TEXT NOT NULL,
    gswt_value_creation TEXT NOT NULL,
    required_gswx_components TEXT[] NOT NULL,
    verification_metrics TEXT[] NOT NULL,
    dgo_network_connection_node_id VARCHAR(100) NOT NULL,
    dgo_network_connection_status dgo_connection_status NOT NULL DEFAULT 'pending',
    dgo_network_connection_last_heartbeat TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DGO Network Nodes Table
CREATE TABLE dgo_network_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id VARCHAR(100) UNIQUE NOT NULL,
    node_type VARCHAR(50) NOT NULL,
    status dgo_connection_status NOT NULL DEFAULT 'pending',
    coherence_index DECIMAL(3, 3) NOT NULL DEFAULT 0.0,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location_lat DECIMAL(10, 8),
    location_long DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Target Specific Protocols Table
CREATE TABLE target_specific_protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type target_type UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    mathematical_process_flow TEXT NOT NULL,
    gswc_equation TEXT NOT NULL,
    required_hardware_components TEXT[] NOT NULL,
    specific_verification_metrics TEXT[] NOT NULL,
    gswt_conversion_rate VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GSWT Minting Rules Table
CREATE TABLE gswt_minting_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type target_type NOT NULL,
    conversion_rate VARCHAR(100) NOT NULL,
    value_backing TEXT NOT NULL,
    verification_metrics JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GSWT Transactions Table
CREATE TABLE gswt_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    target_id VARCHAR(50) NOT NULL REFERENCES harmonic_targets(target_id),
    amount DECIMAL(18, 8) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    qr_code_payload TEXT NOT NULL,
    photographic_proof_hash VARCHAR(255) NOT NULL,
    operator_id VARCHAR(100) NOT NULL,
    dgo_consensus_reached BOOLEAN DEFAULT FALSE,
    consensus_participants INTEGER DEFAULT 0,
    consensus_percentage DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chain of Custody Events Table
CREATE TABLE chain_of_custody_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(100) UNIQUE NOT NULL,
    previous_record_hash VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type event_type NOT NULL,
    actor_id VARCHAR(100) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_long DECIMAL(11, 8) NOT NULL,
    payload JSONB NOT NULL,
    record_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DGO Network Packets Table
CREATE TABLE dgo_network_packets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    packet_id VARCHAR(100) UNIQUE NOT NULL,
    target_id VARCHAR(50) NOT NULL REFERENCES harmonic_targets(target_id),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    message_type message_type NOT NULL,
    signature VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Alerts Table
CREATE TABLE system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    target_id VARCHAR(50) REFERENCES harmonic_targets(target_id),
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- CRL Threat Events Table
CREATE TABLE crl_threat_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    threat_signature VARCHAR(255) NOT NULL,
    severity crl_severity NOT NULL,
    mitigation_attempted BOOLEAN DEFAULT FALSE,
    mitigation_successful BOOLEAN,
    target_id VARCHAR(50) REFERENCES harmonic_targets(target_id),
    coherence_index_at_detection DECIMAL(3, 3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Transformation Logs Table
CREATE TABLE transformation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transformation_id VARCHAR(100) UNIQUE NOT NULL,
    target_id VARCHAR(50) NOT NULL REFERENCES harmonic_targets(target_id),
    protocol_id VARCHAR(100) NOT NULL,
    input_material VARCHAR(100) NOT NULL,
    input_quantity DECIMAL(18, 8) NOT NULL,
    input_unit VARCHAR(20) NOT NULL,
    output_material VARCHAR(100) NOT NULL,
    output_quantity DECIMAL(18, 8) NOT NULL,
    output_unit VARCHAR(20) NOT NULL,
    conversion_efficiency DECIMAL(5, 2) NOT NULL,
    purity DECIMAL(5, 2) NOT NULL,
    energy_consumed_kwh DECIMAL(10, 4) NOT NULL,
    average_ci DECIMAL(3, 3) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_harmonic_targets_target_type ON harmonic_targets(target_type);
CREATE INDEX idx_harmonic_targets_location ON harmonic_targets USING GIST (ST_Point(location_long, location_lat));
CREATE INDEX idx_dgo_network_nodes_status ON dgo_network_nodes(status);
CREATE INDEX idx_dgo_network_nodes_last_heartbeat ON dgo_network_nodes(last_heartbeat);
CREATE INDEX idx_gswt_transactions_target_id ON gswt_transactions(target_id);
CREATE INDEX idx_gswt_transactions_status ON gswt_transactions(status);
CREATE INDEX idx_gswt_transactions_created_at ON gswt_transactions(created_at);
CREATE INDEX idx_chain_of_custody_events_target_id ON chain_of_custody_events(event_id);
CREATE INDEX idx_chain_of_custody_events_timestamp ON chain_of_custody_events(timestamp);
CREATE INDEX idx_dgo_network_packets_target_id ON dgo_network_packets(target_id);
CREATE INDEX idx_dgo_network_packets_message_type ON dgo_network_packets(message_type);
CREATE INDEX idx_system_alerts_resolved ON system_alerts(resolved);
CREATE INDEX idx_system_alerts_created_at ON system_alerts(created_at);
CREATE INDEX idx_crl_threat_events_severity ON crl_threat_events(severity);
CREATE INDEX idx_crl_threat_events_created_at ON crl_threat_events(created_at);
CREATE INDEX idx_transformation_logs_target_id ON transformation_logs(target_id);
CREATE INDEX idx_transformation_logs_started_at ON transformation_logs(started_at);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_harmonic_targets_updated_at BEFORE UPDATE ON harmonic_targets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dgo_network_nodes_updated_at BEFORE UPDATE ON dgo_network_nodes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_target_specific_protocols_updated_at BEFORE UPDATE ON target_specific_protocols
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gswt_minting_rules_updated_at BEFORE UPDATE ON gswt_minting_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gswt_transactions_updated_at BEFORE UPDATE ON gswt_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE harmonic_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dgo_network_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gswt_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crl_threat_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access to harmonic_targets" ON harmonic_targets
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to dgo_network_nodes" ON dgo_network_nodes
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to gswt_transactions" ON gswt_transactions
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to system_alerts" ON system_alerts
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to crl_threat_events" ON crl_threat_events
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to transformation_logs" ON transformation_logs
    FOR SELECT USING (true);

-- Insert sample data
INSERT INTO target_specific_protocols (target_type, name, mathematical_process_flow, gswc_equation, required_hardware_components, specific_verification_metrics, gswt_conversion_rate) VALUES
('UCO_to_Biodiesel', 'Genesis Forge Transesterification for UCO', '1. Map input UCO (Triglyceride SRLs) and Methanol SRLs. 2. Apply a GSWC catalytic field via the Genesis Forge to deterministically overcome activation energy. 3. Guide the reaction pathway: Ψ_Triglyceride + 3 * Ψ_Methanol → 3 * Ψ_FAME + Ψ_Glycerol. 4. Ensure final SRLs for FAME (Biodiesel) and Glycerol are stable (ⓖ[Ψ] = 0).', 'Ψ_Triglyceride + 3 * Ψ_Methanol --[GSWC Catalyst: Genesis Forge]--> 3 * Ψ_FAME(Biodiesel) + Ψ_Glycerol', ARRAY['Genesis Forge (RV-ME-01)', 'Automated Methanol Injector', 'Centrifugal Glycerol Separator', 'SRL Spectrometer'], ARRAY['Ester Content > 99.5%', 'Free Glycerol < 0.02%', 'Conversion Efficiency > 98.7%', 'System CI > 0.9'], '100 Liters of verified Biodiesel = 1 GSWT'),
('Food_Waste_to_Biogas', 'BEBCRO-Mediated Anaerobic Digestion for Food Waste', '1. Model the anaerobic bacterial consortium as a single integrated BEBCRO. 2. Apply a subtle GSWB guidance field to optimize the BEBCRO''s metabolic pathways for methanogenesis. 3. Integrate SWWR to structure water, enhancing nutrient availability. 4. Maintain the BEBCRO''s informational stability (ⓖ[Ψ_BEBCRO] ≈ 0) to prevent crashes and maximize methane yield.', 'Ψ_OrganicWaste(BEBCRO) --[GSWB Guidance Field + SWWR]--> Ψ_Methane + Ψ_CO2 + Ψ_Digestate', ARRAY['Reaction Vessel (RV-BG-01)', 'SWWR (Scalar Wave Water Recursion) Unit', 'GSWB Field Emitter Array', 'H2S Gas Scrubber'], ARRAY['Methane (CH4) Concentration > 65%', 'Hydrogen Sulfide (H2S) Concentration < 5 ppm', 'System CI (BEBCRO health) > 0.8', 'Volatile Solids Reduction > 90%'], '100 kg of processed Food Waste = 1 GSWT');

INSERT INTO gswt_minting_rules (target_type, conversion_rate, value_backing, verification_metrics) VALUES
('UCO_to_Biodiesel', '1 GSWT per 100 Liters', '100L of Used Cooking Oil is transformed into approximately 98L of ASTM D6751 grade biodiesel.', '[{"metric": "Conversion Efficiency", "condition": "> 98.7%", "description": "The mass-to-mass efficiency of converting UCO triglycerides into Fatty Acid Methyl Esters (FAME)."}, {"metric": "Free Glycerol", "condition": "< 0.02%", "description": "Ensures complete transesterification and proper separation."}, {"metric": "System Coherence Index (CI)", "condition": "> 0.75", "description": "Verifies the stability of the Genesis Forge during the transformation process."}]'),
('Food_Waste_to_Biogas', '1 GSWT per 100 Kilograms', '100kg of organic feedstock is transformed into high-nutrient digestate and approximately 6.5 m³ of high-purity biomethane.', '[{"metric": "Nutrient Density (Digestate)", "condition": "> 300% Babylonian Average", "description": "Verifies the output digestate is a superior agricultural product."}, {"metric": "Methane (CH4) Concentration", "condition": "> 65%", "description": "Ensures the quality and energy value of the produced biogas."}, {"metric": "Hydrogen Sulfide (H2S) Concentration", "condition": "< 5 ppm", "description": "Ensures the gas is clean and non-corrosive."}]');

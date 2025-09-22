import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database table names
export const TABLES = {
  HARMONIC_TARGETS: 'harmonic_targets',
  DGO_NETWORK_NODES: 'dgo_network_nodes',
  TARGET_SPECIFIC_PROTOCOLS: 'target_specific_protocols',
  GSWT_MINTING_RULES: 'gswt_minting_rules',
  GSWT_TRANSACTIONS: 'gswt_transactions',
  CHAIN_OF_CUSTODY_EVENTS: 'chain_of_custody_events',
  DGO_NETWORK_PACKETS: 'dgo_network_packets',
  SYSTEM_ALERTS: 'system_alerts',
  CRL_THREAT_EVENTS: 'crl_threat_events',
  TRANSFORMATION_LOGS: 'transformation_logs',
} as const;

// API functions for harmonic targets
export const harmonicTargetsApi = {
  // Get all harmonic targets
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.HARMONIC_TARGETS)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get harmonic target by ID
  async getById(targetId: string) {
    const { data, error } = await supabase
      .from(TABLES.HARMONIC_TARGETS)
      .select('*')
      .eq('target_id', targetId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new harmonic target
  async create(target: any) {
    const { data, error } = await supabase
      .from(TABLES.HARMONIC_TARGETS)
      .insert([target])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update harmonic target
  async update(targetId: string, updates: any) {
    const { data, error } = await supabase
      .from(TABLES.HARMONIC_TARGETS)
      .update(updates)
      .eq('target_id', targetId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete harmonic target
  async delete(targetId: string) {
    const { error } = await supabase
      .from(TABLES.HARMONIC_TARGETS)
      .delete()
      .eq('target_id', targetId);
    
    if (error) throw error;
  }
};

// API functions for GSWT transactions
export const gswtTransactionsApi = {
  // Get all GSWT transactions
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.GSWT_TRANSACTIONS)
      .select(`
        *,
        harmonic_targets!inner(target_id, target_name, target_type)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get GSWT transactions by target
  async getByTarget(targetId: string) {
    const { data, error } = await supabase
      .from(TABLES.GSWT_TRANSACTIONS)
      .select('*')
      .eq('target_id', targetId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create new GSWT transaction
  async create(transaction: any) {
    const { data, error } = await supabase
      .from(TABLES.GSWT_TRANSACTIONS)
      .insert([transaction])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update GSWT transaction status
  async updateStatus(transactionId: string, status: string) {
    const { data, error } = await supabase
      .from(TABLES.GSWT_TRANSACTIONS)
      .update({ status })
      .eq('transaction_id', transactionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// API functions for DGO network nodes
export const dgoNetworkApi = {
  // Get all DGO network nodes
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.DGO_NETWORK_NODES)
      .select('*')
      .order('last_heartbeat', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Update node heartbeat
  async updateHeartbeat(nodeId: string, ci: number) {
    const { data, error } = await supabase
      .from(TABLES.DGO_NETWORK_NODES)
      .update({ 
        last_heartbeat: new Date().toISOString(),
        coherence_index: ci
      })
      .eq('node_id', nodeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// API functions for system alerts
export const systemAlertsApi = {
  // Get all system alerts
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.SYSTEM_ALERTS)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create new system alert
  async create(alert: any) {
    const { data, error } = await supabase
      .from(TABLES.SYSTEM_ALERTS)
      .insert([alert])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Resolve system alert
  async resolve(alertId: string) {
    const { data, error } = await supabase
      .from(TABLES.SYSTEM_ALERTS)
      .update({ 
        resolved: true,
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// API functions for transformation logs
export const transformationLogsApi = {
  // Get all transformation logs
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.TRANSFORMATION_LOGS)
      .select(`
        *,
        harmonic_targets!inner(target_id, target_name, target_type)
      `)
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get transformation logs by target
  async getByTarget(targetId: string) {
    const { data, error } = await supabase
      .from(TABLES.TRANSFORMATION_LOGS)
      .select('*')
      .eq('target_id', targetId)
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create new transformation log
  async create(log: any) {
    const { data, error } = await supabase
      .from(TABLES.TRANSFORMATION_LOGS)
      .insert([log])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
export const subscribeToHarmonicTargets = (callback: (payload: any) => void) => {
  return supabase
    .channel('harmonic_targets_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: TABLES.HARMONIC_TARGETS },
      callback
    )
    .subscribe();
};

export const subscribeToGSWTTransactions = (callback: (payload: any) => void) => {
  return supabase
    .channel('gswt_transactions_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: TABLES.GSWT_TRANSACTIONS },
      callback
    )
    .subscribe();
};

export const subscribeToSystemAlerts = (callback: (payload: any) => void) => {
  return supabase
    .channel('system_alerts_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: TABLES.SYSTEM_ALERTS },
      callback
    )
    .subscribe();
};

export const subscribeToDgoNetworkNodes = (callback: (payload: any) => void) => {
  return supabase
    .channel('dgo_network_nodes_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: TABLES.DGO_NETWORK_NODES },
      callback
    )
    .subscribe();
};

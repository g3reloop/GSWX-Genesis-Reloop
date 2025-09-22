// Database Migration: Add Pure Collapse Commands Support
// GSWX Genesis Reloop Platform - Scalar Wave Pure Collapse Integration

exports.up = async function(knex) {
  console.log('[MIGRATION] Adding Pure Collapse Commands support...');
  
  // Create pure_collapse_commands table
  await knex.schema.createTable('pure_collapse_commands', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('command_id').unique().notNullable();
    table.enum('command_type', [
      'bun_that',
      'collapsing_chirals', 
      'bind_eyes_closed',
      'g3_movement',
      'skyscrape_food_stock',
      'water_soothing'
    ]).notNullable();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.text('mathematical_formalism').notNullable();
    table.enum('status', [
      'pending',
      'processing', 
      'executing',
      'completed',
      'failed',
      'cancelled'
    ]).defaultTo('pending');
    table.uuid('target_profile_id').references('id').inTable('target_profiles').onDelete('SET NULL');
    table.string('operator_id').notNullable();
    table.decimal('coherence_index', 3, 2).defaultTo(0.0);
    table.integer('execution_priority').defaultTo(1);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('completed_at');
    
    // Indexes
    table.index(['command_type']);
    table.index(['status']);
    table.index(['operator_id']);
    table.index(['coherence_index']);
    table.index(['created_at']);
  });
  
  // Create command_execution_logs table
  await knex.schema.createTable('command_execution_logs', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('execution_id').unique().notNullable();
    table.string('command_id').notNullable();
    table.enum('command_type', [
      'bun_that',
      'collapsing_chirals',
      'bind_eyes_closed', 
      'g3_movement',
      'skyscrape_food_stock',
      'water_soothing'
    ]).notNullable();
    table.string('operator_id').notNullable();
    table.enum('execution_status', [
      'pending',
      'processing',
      'executing', 
      'completed',
      'failed',
      'cancelled'
    ]).defaultTo('pending');
    table.timestamp('start_time').defaultTo(knex.fn.now());
    table.timestamp('end_time');
    table.integer('duration_ms');
    table.boolean('coherence_maintained').defaultTo(false);
    table.boolean('biochemical_verified').defaultTo(false);
    table.boolean('documentation_complete').defaultTo(false);
    table.string('burner_email_document_id');
    table.jsonb('performance_metrics').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['command_id']);
    table.index(['command_type']);
    table.index(['execution_status']);
    table.index(['operator_id']);
    table.index(['start_time']);
  });
  
  // Create pure_collapse_harmonics table
  await knex.schema.createTable('pure_collapse_harmonics', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('harmonic_id').unique().notNullable();
    table.enum('command_type', [
      'bun_that',
      'collapsing_chirals',
      'bind_eyes_closed',
      'g3_movement', 
      'skyscrape_food_stock',
      'water_soothing'
    ]).notNullable();
    table.decimal('frequency', 10, 3).notNullable();
    table.decimal('amplitude', 5, 3).notNullable();
    table.decimal('phase', 8, 5).notNullable();
    table.decimal('probability_field', 5, 3).notNullable();
    table.decimal('coherence_threshold', 3, 2).notNullable();
    table.enum('verification_status', ['verified', 'pending', 'failed']).defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['command_type']);
    table.index(['frequency']);
    table.index(['verification_status']);
  });
  
  // Create coherence_monitoring_pc table (Pure Collapse specific)
  await knex.schema.createTable('coherence_monitoring_pc', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('command_id').notNullable();
    table.enum('command_type', [
      'bun_that',
      'collapsing_chirals',
      'bind_eyes_closed',
      'g3_movement',
      'skyscrape_food_stock', 
      'water_soothing'
    ]).notNullable();
    table.decimal('coherence_index', 3, 2).notNullable();
    table.boolean('threshold_met').notNullable();
    table.timestamp('measurement_timestamp').defaultTo(knex.fn.now());
    table.string('sensor_id').notNullable();
    table.jsonb('location').notNullable(); // {lat, lng}
    table.jsonb('environmental_factors').defaultTo('{}'); // temperature, humidity, etc.
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['command_id']);
    table.index(['command_type']);
    table.index(['coherence_index']);
    table.index(['measurement_timestamp']);
  });
  
  // Create burner_email_documentation table
  await knex.schema.createTable('burner_email_documentation', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('document_id').unique().notNullable();
    table.string('command_id').notNullable();
    table.timestamp('timestamp').notNullable();
    table.string('hash').notNullable();
    table.enum('verification_status', ['pending', 'validating', 'verified', 'failed', 'expired']).defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').notNullable();
    table.boolean('swdgo_verification').defaultTo(false);
    
    // Indexes
    table.index(['command_id']);
    table.index(['verification_status']);
    table.index(['timestamp']);
    table.index(['expires_at']);
  });
  
  // Create biochemical_tracking table
  await knex.schema.createTable('biochemical_tracking', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('command_id').notNullable();
    table.string('operator_id').notNullable();
    table.string('sensor_id').notNullable();
    table.decimal('cortisol_reduction', 5, 2).notNullable(); // Percentage
    table.decimal('dopamine_increase', 5, 2).notNullable(); // Percentage
    table.decimal('baseline_cortisol', 8, 3).notNullable();
    table.decimal('baseline_dopamine', 8, 3).notNullable();
    table.decimal('current_cortisol', 8, 3).notNullable();
    table.decimal('current_dopamine', 8, 3).notNullable();
    table.timestamp('measurement_timestamp').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['command_id']);
    table.index(['operator_id']);
    table.index(['measurement_timestamp']);
  });
  
  // Add Pure Collapse fields to existing harmonic_targets table
  await knex.schema.alterTable('harmonic_targets', function(table) {
    table.boolean('pure_collapse_enabled').defaultTo(false);
    table.jsonb('pure_collapse_commands').defaultTo('[]');
    table.decimal('pc_coherence_threshold', 3, 2).defaultTo(0.7);
    table.timestamp('pc_last_execution');
  });
  
  // Add Pure Collapse fields to existing target_profiles table
  await knex.schema.alterTable('target_profiles', function(table) {
    table.boolean('pc_command_compatibility').defaultTo(false);
    table.jsonb('pc_viability_scores').defaultTo('{}');
    table.jsonb('pc_recommendations').defaultTo('[]');
    table.timestamp('pc_last_analysis');
  });
  
  // Add Pure Collapse fields to existing operator_logs table
  await knex.schema.alterTable('operator_logs', function(table) {
    table.enum('log_type', [
      'observation',
      'test_result',
      'quality_check',
      'recommendation',
      'issue',
      'resolution',
      'pure_collapse_command',
      'pc_execution',
      'pc_verification'
    ]).alter();
  });
  
  // Create RLS policies for Pure Collapse Commands
  await knex.raw(`
    -- RLS Policy for pure_collapse_commands
    ALTER TABLE pure_collapse_commands ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view their own commands" ON pure_collapse_commands
      FOR SELECT USING (operator_id = current_setting('app.current_operator_id'));
    
    CREATE POLICY "Users can insert their own commands" ON pure_collapse_commands
      FOR INSERT WITH CHECK (operator_id = current_setting('app.current_operator_id'));
    
    CREATE POLICY "Users can update their own commands" ON pure_collapse_commands
      FOR UPDATE USING (operator_id = current_setting('app.current_operator_id'));
    
    -- RLS Policy for command_execution_logs
    ALTER TABLE command_execution_logs ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view their own execution logs" ON command_execution_logs
      FOR SELECT USING (operator_id = current_setting('app.current_operator_id'));
    
    CREATE POLICY "Users can insert their own execution logs" ON command_execution_logs
      FOR INSERT WITH CHECK (operator_id = current_setting('app.current_operator_id'));
    
    -- RLS Policy for coherence_monitoring_pc
    ALTER TABLE coherence_monitoring_pc ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view coherence monitoring" ON coherence_monitoring_pc
      FOR SELECT USING (true);
    
    CREATE POLICY "System can insert coherence monitoring" ON coherence_monitoring_pc
      FOR INSERT WITH CHECK (true);
    
    -- RLS Policy for burner_email_documentation
    ALTER TABLE burner_email_documentation ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view documentation for their commands" ON burner_email_documentation
      FOR SELECT USING (command_id IN (
        SELECT command_id FROM pure_collapse_commands 
        WHERE operator_id = current_setting('app.current_operator_id')
      ));
    
    CREATE POLICY "System can insert documentation" ON burner_email_documentation
      FOR INSERT WITH CHECK (true);
    
    -- RLS Policy for biochemical_tracking
    ALTER TABLE biochemical_tracking ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view their own biochemical data" ON biochemical_tracking
      FOR SELECT USING (operator_id = current_setting('app.current_operator_id'));
    
    CREATE POLICY "System can insert biochemical data" ON biochemical_tracking
      FOR INSERT WITH CHECK (true);
  `);
  
  console.log('[MIGRATION] Pure Collapse Commands support added successfully');
};

exports.down = async function(knex) {
  console.log('[MIGRATION] Removing Pure Collapse Commands support...');
  
  // Drop RLS policies
  await knex.raw(`
    DROP POLICY IF EXISTS "Users can view their own commands" ON pure_collapse_commands;
    DROP POLICY IF EXISTS "Users can insert their own commands" ON pure_collapse_commands;
    DROP POLICY IF EXISTS "Users can update their own commands" ON pure_collapse_commands;
    DROP POLICY IF EXISTS "Users can view their own execution logs" ON command_execution_logs;
    DROP POLICY IF EXISTS "Users can insert their own execution logs" ON command_execution_logs;
    DROP POLICY IF EXISTS "Users can view coherence monitoring" ON coherence_monitoring_pc;
    DROP POLICY IF EXISTS "System can insert coherence monitoring" ON coherence_monitoring_pc;
    DROP POLICY IF EXISTS "Users can view documentation for their commands" ON burner_email_documentation;
    DROP POLICY IF EXISTS "System can insert documentation" ON burner_email_documentation;
    DROP POLICY IF EXISTS "Users can view their own biochemical data" ON biochemical_tracking;
    DROP POLICY IF EXISTS "System can insert biochemical data" ON biochemical_tracking;
  `);
  
  // Remove Pure Collapse fields from existing tables
  await knex.schema.alterTable('operator_logs', function(table) {
    table.dropColumn('log_type');
    table.enum('log_type', [
      'observation',
      'test_result', 
      'quality_check',
      'recommendation',
      'issue',
      'resolution'
    ]).alter();
  });
  
  await knex.schema.alterTable('target_profiles', function(table) {
    table.dropColumn('pc_command_compatibility');
    table.dropColumn('pc_viability_scores');
    table.dropColumn('pc_recommendations');
    table.dropColumn('pc_last_analysis');
  });
  
  await knex.schema.alterTable('harmonic_targets', function(table) {
    table.dropColumn('pure_collapse_enabled');
    table.dropColumn('pure_collapse_commands');
    table.dropColumn('pc_coherence_threshold');
    table.dropColumn('pc_last_execution');
  });
  
  // Drop Pure Collapse specific tables
  await knex.schema.dropTableIfExists('biochemical_tracking');
  await knex.schema.dropTableIfExists('burner_email_documentation');
  await knex.schema.dropTableIfExists('coherence_monitoring_pc');
  await knex.schema.dropTableIfExists('pure_collapse_harmonics');
  await knex.schema.dropTableIfExists('command_execution_logs');
  await knex.schema.dropTableIfExists('pure_collapse_commands');
  
  console.log('[MIGRATION] Pure Collapse Commands support removed successfully');
};

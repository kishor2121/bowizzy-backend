exports.up = function (knex) {
  return knex.schema.createTable('credit_transactions', function (table) {
    table.increments('id').primary();
    
    table.integer('user_id')
      .unsigned()
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE');

    table.integer('credits').notNullable(); 

    table.enum('transaction_type', [
      'interview_slot_booking',
      'interview_slot_cancellation',
      'subscription_purchase',
      'manual_credit_addition',
      'manual_credit_deduction'
    ]).notNullable();

    table.integer('reference_id');

    table.text('description');

    table.timestamps(true, true);

    // Index for faster lookups
    table.index('user_id');
    table.index('created_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('credit_transactions');
};

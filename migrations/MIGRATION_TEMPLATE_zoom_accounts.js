exports.up = function(knex) {
  return knex.schema.table('interview_schedules', function(table) {
    // Add column to track which Zoom account was used
    // Default to 0 (primary account)
    table.integer('zoom_account_index')
      .defaultTo(0)
      .comment('Index of the Zoom account used for this meeting');
    
    // Also add zoom_meeting_id if not already present
    // This is useful for canceling/updating meetings
    if (!knex.schema.hasColumn('interview_schedules', 'zoom_meeting_id')) {
      table.string('zoom_meeting_id')
        .nullable()
        .comment('Zoom meeting ID from Zoom API');
    }
  });
};

exports.down = function(knex) {
  return knex.schema.table('interview_schedules', function(table) {
    table.dropColumn('zoom_account_index');
    // Only drop zoom_meeting_id if you want to rollback it as well
    // table.dropColumn('zoom_meeting_id');
  });
};

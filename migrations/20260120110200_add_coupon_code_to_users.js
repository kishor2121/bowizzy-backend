exports.up = function (knex) {
  return knex.schema.table('users', function (table) {
    table.string('coupon_code').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('coupon_code');
  });
};

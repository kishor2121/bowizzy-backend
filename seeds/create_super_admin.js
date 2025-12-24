exports.seed = async function (knex) {
  await knex('users').insert({
    email: 'admin@wizzy.com',
    password_hash: 'admin123',
    user_type: 'admin',
    is_interviewer_verified: true
  });
};

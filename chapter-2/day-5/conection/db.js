const {Pool} = require('pg');
const { password } = require('pg/lib/defaults');

const pool = new Pool({
    database : 'postgres', 
    user : 'postgres',
    port : 5432,
    password : 'asdawp'
});

module.exports = pool; 
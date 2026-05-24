import pg from 'pg'

const client = new pg.Client({
  host: process.env.DB_HOST || 'db.njsorwokkbqdhnnidppe.supabase.co',
  port: 5432,
  user: 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
})

await client.connect()

const tables = ['profiles', 'workouts', 'exercises', 'meals', 'meal_items', 'exam_results']
for (const t of tables) {
  const { rows } = await client.query(`SELECT COUNT(*) FROM ${t}`)
  console.log(`${t}: ${rows[0].count} registros`)
}

const { rows: profiles } = await client.query('SELECT name, protein_goal_g, color_primary FROM profiles')
console.log('\nPerfis:')
profiles.forEach(p => console.log(`  - ${p.name} | meta proteína: ${p.protein_goal_g}g | cor: ${p.color_primary}`))

const { rows: exams } = await client.query('SELECT exam_name, value, unit, goal FROM exam_results')
console.log('\nExames do Mizael:')
exams.forEach(e => console.log(`  - ${e.exam_name}: ${e.value}${e.unit} (meta: ${e.goal}${e.unit})`))

await client.end()

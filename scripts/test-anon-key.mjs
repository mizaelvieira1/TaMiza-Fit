import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://njsorwokkbqdhnnidppe.supabase.co',
  'sb_publishable_5Avpx1GvqoQce6RadWCfWg_Gk4E4nbC'
)

console.log('Testando chave anon...')
const { data, error } = await supabase.from('profiles').select('id, name').limit(2)

if (error) {
  console.log('ERRO:', error.message)
  console.log('Detalhes:', JSON.stringify(error))
} else {
  console.log('Sucesso! Perfis encontrados:', data)
}

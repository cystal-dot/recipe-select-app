import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../utils/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query

	if(req.method === 'GET'){
		// id に合致するレシピを1件取得
		const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single()
		if(error){
			return res.status(500).json({ error: error.message })
		}
		return res.status(200).json(data)
	}else if(req.method === 'PUT'){
		// id に合致するレシピを更新
		const recipe = req.body
		const { error } = await supabase.from('recipes').update(recipe).eq('id', id)
		if(error){
			return res.status(500).json({ error: error.message })
		}
		return res.status(200).json({ message: 'Recipe updated' })
	}else if(req.method === 'DELETE'){
		// id に合致するレシピを削除
		const { error } = await supabase.from('recipes').delete().eq('id', id)
		if(error){
			return res.status(500).json({ error: error.message })
		}
		return res.status(200).json({ message: 'Recipe deleted' })
	}else{
		res.setHeader('Allow', ['GET','PUT','DELETE'])
		return res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('recipes').select('*');
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        const { error } = await supabase.from('recipes').delete().eq('id', id);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Recipe deleted' });
    } else if (req.method === 'PUT') {
        const { id } = req.query;
        const recipe = req.body; // リクエストボディからレシピデータを取得
        const { error } = await supabase.from('recipes').update(recipe).eq('id', id);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Recipe updated' });
    } else {
        res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
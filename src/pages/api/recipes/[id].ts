import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import { STATUS_CODES } from '../../../common/consts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if(req.method === 'GET'){
        // id に合致するレシピを1件取得
        const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single();
        if(error){
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
        return res.status(STATUS_CODES.OK).json(data);
    }else if(req.method === 'PUT'){
        // id に合致するレシピを更新
        const recipe = req.body;
        const { error } = await supabase.from('recipes').update(recipe).eq('id', id);
        if(error){
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
        return res.status(STATUS_CODES.OK).json({ message: 'Recipe updated' });
    }else if(req.method === 'DELETE'){
        // id に合致するレシピを削除
        const { error } = await supabase.from('recipes').delete().eq('id', id);
        if(error){
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
        return res.status(STATUS_CODES.OK).json({ message: 'Recipe deleted' });
    }else{
        res.setHeader('Allow', ['GET','PUT','DELETE']);
        return res.status(STATUS_CODES.METHOD_NOT_ALLOWED).end(`Method ${req.method} Not Allowed`);
    }
}

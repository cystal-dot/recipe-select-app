import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import { STATUS_CODES } from '@/common/consts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'GET'){
        // 全レシピ取得
        const { data, error } = await supabase.from('recipes').select('*');
        if(error){
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
        return res.status(STATUS_CODES.OK).json(data);
    }else if(req.method === 'POST'){
        // レシピ新規作成
        const recipe = req.body;
        const { error } = await supabase.from('recipes').insert(recipe);
        if(error){
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
        return res.status(STATUS_CODES.OK).json({ message: 'Recipe inserted' });
    }else{
        res.setHeader('Allow', ['GET','POST']);
        return res.status(STATUS_CODES.METHOD_NOT_ALLOWED).end(`Method ${req.method} Not Allowed`);
    }
}

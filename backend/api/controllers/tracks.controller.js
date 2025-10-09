import supabase from "../../config/db.js";

export const searchTracks = async (req, res) => {
   
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');

    
    if (!searchTerm) {
        return res.status(400).json({ message: 'O termo de busca (query parameter "q") é obrigatório.' });
    }

    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
        
        const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .ilike('track_name', `%${searchTerm}%`)
            .range(from, to); 

        if (error) {
            console.error('Erro ao buscar dados:', error);
            return res.status(500).json({ message: 'Erro Interno do Server' });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).json({ message: 'Erro Interno do Server' });
    }
}

export default searchTracks;
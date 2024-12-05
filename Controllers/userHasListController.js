import User_has_List from "../models/user_has_lists.js"; 

// Função para obter uma relação pelo ID
export const getUserHasList = async (req, res) => {
    try {
        const { ID } = req.params;

        // Busca a relação pelo ID no banco de dados
        const relation = await User_has_List.findByPk(ID);

        // Se a relação não for encontrada, retorna erro 404
        if (!relation) {
            return res.status(404).json({ error: "Relation not found", details: null });
        }

        // Retorna os dados da relação encontrada
        return res.status(200).json({
            message: "Relation retrieved successfully",
            data: relation,
        });
    } catch (error) {
        console.error("Error fetching user_has_list relation:", error);
        return res.status(500).json({ error: "Failed to get relation", details: error.message });
    }
};

// Função para obter todas as listas de um usuário
export const getListsByUser = async (req, res) => {
    try {
        const { user_id } = req.params; 

        // Busca todas as associações do usuário na tabela user_has_lists
        const userLists = await User_has_List.findAll({
            where: { user_id_user: user_id }
        });

        // Verifica se o usuário participa de alguma lista
        if (!userLists || userLists.length === 0) {
            return res.status(404).json({
                error: "No lists found",
                details: `No lists found for user with ID: ${user_id}`,
            });
        }

        // Retorna as listas associadas ao usuário
        return res.status(200).json({
            message: "Lists retrieved successfully",
            data: userLists,
        });
    } catch (error) {
        console.error("Error fetching user's lists:", error);
        return res.status(500).json({ error: "Failed to fetch user's lists", details: error.message });
    }
};
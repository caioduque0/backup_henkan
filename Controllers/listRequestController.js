import List_Request from "../models/list_requests.js";
import User from "../models/user.js";
import List from "../models/list.js";
import User_has_List from "../models/user_has_lists.js";

// Função para criar uma nova solicitação de lista
export const createListRequest = async (req, res) => {
    try {
        const { user_id_user, list_id_list } = req.body;

        // Validação simples para garantir que ambos os campos foram fornecidos
        if (!user_id_user || !list_id_list) {
            return res.status(400).json({
                error: "Both user_id_user and list_id_list are required",
                details: null,
            });
        }

        // Verifica se o usuário existe
        const userExists = await User.findByPk(user_id_user);
        if (!userExists) {
            return res.status(404).json({
                error: "User not found",
                details: `No user found with ID: ${user_id_user}`,
            });
        }

        // Verifica se a lista existe
        const listExists = await List.findByPk(list_id_list);
        if (!listExists) {
            return res.status(404).json({
                error: "List not found",
                details: `No list found with ID: ${list_id_list}`,
            });
        }

        // Cria uma nova solicitação no banco de dados
        const newRequest = await List_Request.create({ user_id_user, list_id_list });

        // Retorna a resposta com sucesso e os dados da nova solicitação
        return res.status(201).json({
            message: "Successfully created a new list request",
            data: newRequest,
        });
    } catch (error) {
        console.error("Error creating list request:", error);
        return res.status(500).json({ error: "Failed to create list request", details: error.message });
    }
};

// Função para alterar a situação de uma solicitação (somente o dono da lista)
export const updateSituation = async (req, res) => {
    try {
        const { ID } = req.params;
        const { situation, owner_id } = req.body;

        if (!['A', 'R', 'P'].includes(situation)) {
            return res.status(400).json({
                error: "Invalid situation value",
                details: "Situation must be 'P', 'A', or 'R'.",
            });
        }

        // Busca a solicitação pelo ID no banco de dados
        const request = await List_Request.findByPk(ID);

        if (!request) {
            return res.status(404).json({ error: "Request not found", details: null });
        }

        // Verifica se o usuário é o dono da lista
        const list = await List.findByPk(request.list_id_list);
        if (list.id_owner !== owner_id) {
            return res.status(403).json({
                error: "Permission denied",
                details: "Only the owner of the list can change the situation.",
            });
        }

        // Atualiza a situação
        request.situation = situation;
        await request.save();

        // Se a situação for aprovada, cria uma entidade User_has_List
        if (situation === 'A') {
            await User_has_List.create({
                user_id_user: request.user_id_user,
                list_id_list: request.list_id_list,
            });
        }

        return res.status(200).json({
            message: "Situation updated successfully",
            data: request,
        });
    } catch (error) {
        console.error("Error updating situation:", error);
        return res.status(500).json({ error: "Failed to update situation", details: error.message });
    }
};

// Função para deletar uma solicitação (somente se estiver Pendente e pelo solicitante)
export const deleteListRequest = async (req, res) => {
    try {
        const { ID } = req.params;
        const { user_id } = req.body;

        // Busca a solicitação pelo ID no banco de dados
        const request = await List_Request.findByPk(ID);

        if (!request) {
            return res.status(404).json({ error: "Request not found", details: null });
        }

        // Verifica se a situação é "Pendente"
        if (request.situation !== 'P') {
            return res.status(400).json({
                error: "Cannot delete",
                details: "Only requests with situation 'P' can be deleted.",
            });
        }

        // Verifica se o usuário autenticado é o solicitante
        if (request.user_id_user !== user_id) {
            return res.status(403).json({
                error: "Permission denied",
                details: "Only the request owner can delete the request.",
            });
        }

        // Exclui a solicitação do banco de dados
        await request.destroy();

        return res.status(200).json({
            message: "Request deleted successfully",
            data: null,
        });
    } catch (error) {
        console.error("Error deleting list request:", error);
        return res.status(500).json({ error: "Failed to delete request", details: error.message });
    }
};

// Função para buscar uma requisição específica pelo ID
export const getListRequestById = async (req, res) => {
    try {
        const { ID } = req.params;
        const { user_id } = req.body;

        // Busca a solicitação pelo ID no banco de dados
        const request = await List_Request.findByPk(ID);

        if (!request) {
            return res.status(404).json({ error: "Request not found", details: null });
        }

        // Verifica se o usuário autenticado é o solicitante
        if (request.user_id_user !== user_id) {
            return res.status(403).json({
                error: "Permission denied",
                details: "Only the request owner can view this request.",
            });
        }

        return res.status(200).json({
            message: "Request retrieved successfully",
            data: request,
        });
    } catch (error) {
        console.error("Error fetching list request:", error);
        return res.status(500).json({ error: "Failed to fetch list request", details: error.message });
    }
};

// Função para listar todas as requisições de uma lista (somente para o dono da lista)
export const getListRequestsByList = async (req, res) => {
    try {
        const { ID } = req.params;
        const { owner_id } = req.body;

        // Verifica se a lista existe
        const list = await List.findByPk(ID);
        if (!list) {
            return res.status(404).json({ error: "List not found", details: null });
        }

        // Verifica se o usuário autenticado é o dono da lista
        if (list.id_owner !== owner_id) {
            return res.status(403).json({
                error: "Permission denied",
                details: "Only the list owner can view its requests.",
            });
        }

        // Busca todas as requisições associadas à lista
        const requests = await List_Request.findAll({
            where: { list_id_list: ID },
        });

        return res.status(200).json({
            message: "Requests retrieved successfully",
            data: requests,
        });
    } catch (error) {
        console.error("Error fetching list requests:", error);
        return res.status(500).json({ error: "Failed to fetch list requests", details: error.message });
    }
};
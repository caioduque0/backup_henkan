import User from "../models/user.js";

// Função para criar um novo usuário
export const createUser = async (req, res) => {
    try {
        const { name, mac } = req.body;

        // Validação para garantir que o nome tenha no máximo 200 caracteres
        if (!name || name.length > 200) {
            return res.status(400).json({
                error: "Name is required and should be less than 200 characters",
                details: null
            });
        }

        // Remover os dois pontos do MAC para garantir que tenha 12 caracteres
        const macSemPontos = mac.replace(/:/g, '');

        // Validar se o MAC tem exatamente 12 caracteres
        if (macSemPontos.length !== 12) {
            return res.status(400).json({
                error: "MAC address should have exactly 12 characters (after removing ':' characters)",
                details: null
            });
        }

        // Verifica se o MAC já existe no banco de dados
        const existingUser = await User.findOne({ where: { mac: macSemPontos } });
        if (existingUser) {
            return res.status(400).json({
                error: "MAC address already exists",
                details: `A user with MAC address ${macSemPontos} already exists.`
            });
        }

        // Cria um novo usuário no banco de dados
        const newUser = await User.create({ name, mac: macSemPontos });

        // Retorna a resposta com sucesso e os dados do novo usuário
        return res.status(201)
            .location(`/user/${newUser.id_user}`)
            .json({
                message: "Successfully created a new user",
                data: newUser
            });
    } catch (error) {
        // Em caso de erro, retorna um erro genérico com detalhes
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Failed to create a user", details: error.message });
    }
};

// Função para obter um usuário pelo ID
export const getUser = async (req, res) => {
    try {
        const { ID } = req.params;
        const cleanedID = ID.trim();

        // Busca o usuário pelo ID no banco de dados
        const user = await User.findByPk(cleanedID);

        // Se o usuário não for encontrado, retorna um erro 404
        if (!user) {
            return res.status(404).json({ error: "User not found", details: null });
        }

        // Retorna os dados do usuário encontrado
        return res.status(200).json({
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        // Em caso de erro, retorna um erro genérico com detalhes
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "Failed to get user", details: error.message });
    }
};

// Função para atualizar os dados de um usuário
export const updateUser = async (req, res) => {
    try {
        const { ID } = req.params;
        const { name } = req.body;

        // Busca o usuário pelo ID no banco de dados
        let user = await User.findByPk(ID);

        // Se o usuário não for encontrado, retorna erro 404
        if (!user) {
            return res.status(404).json({ error: "User not found", details: null });
        }

        // Atualiza os dados do usuário
        user.name = name || user.name;

        // Salva as alterações no banco de dados
        user = await user.save();

        // Retorna uma resposta de sucesso com os dados atualizados
        return res.status(200).json({
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        // Em caso de erro, retorna um erro genérico com detalhes
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Failed to update user", details: error.message });
    }
};

import Product from "../models/product.js";
import User from "../models/user.js";
import List from "../models/list.js";
import User_has_List from "../models/user_has_lists.js";

// Função para criar um novo produto
export const createProduct = async (req, res) => {
    try {
        const { name, quantity, price, user_id_user, list_id_list } = req.body;

        // Validação simples para garantir que todos os campos obrigatórios foram fornecidos
        if (!name || quantity === undefined || !price || !user_id_user || !list_id_list) {
            return res.status(400).json({
                error: "All fields are required",
                details: "name, quantity, price, user_id_user, and list_id_list are mandatory."
            });
        }

        // Verificar se o ID do usuário existe
        const userExists = await User.findByPk(user_id_user);
        if (!userExists) {
            return res.status(404).json({
                error: "User not found",
                details: `No user found with ID: ${user_id_user}`
            });
        }

        // Verificar se o ID da lista existe
        const listExists = await List.findByPk(list_id_list);
        if (!listExists) {
            return res.status(404).json({
                error: "List not found",
                details: `No list found with ID: ${list_id_list}`
            });
        }

        // Verificar se há uma relação válida entre o usuário e a lista na tabela user_has_list
        const userHasList = await User_has_List.findOne({
            where: { user_id_user, list_id_list },
        });

        if (!userHasList) {
            return res.status(403).json({
                error: "Access denied",
                details: `The user with ID: ${user_id_user} does not have access to the list with ID: ${list_id_list}`,
            });
        }

        // Cria um novo produto no banco de dados
        const newProduct = await Product.create({ name, quantity, price, user_id_user, list_id_list });

        // Retorna a resposta com sucesso e os dados do novo produto
        return res.status(201)
            .location(`/product/${newProduct.id_product}`)
            .json({
                message: "Successfully created a new product",
                data: newProduct,
            });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: "Failed to create product", details: error.message });
    }
};

// Função para obter um produto pelo ID
export const getProduct = async (req, res) => {
    try {
        const { ID } = req.params;
        const { user_id_user } = req.body;

        // Valida se o ID do usuário foi fornecido
        if (!user_id_user) {
            return res.status(400).json({
                error: "User ID is required",
                details: "You must provide the user_id_user in the request body.",
            });
        }

        // Busca o produto pelo ID no banco de dados
        const product = await Product.findByPk(ID);

        // Se o produto não for encontrado, retorna erro 404
        if (!product) {
            return res.status(404).json({ error: "Product not found", details: null });
        }

        // Verifica a relação na tabela user_has_list
        const userHasList = await User_has_List.findOne({
            where: { user_id_user, list_id_list: product.list_id_list },
        });

        if (!userHasList) {
            return res.status(403).json({
                error: "Access denied",
                details: `The user with ID: ${user_id_user} does not have access to the list with ID: ${product.list_id_list}`,
            });
        }

        // Retorna os dados do produto encontrado
        return res.status(200).json({
            message: "Product retrieved successfully",
            data: product,
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ error: "Failed to get product", details: error.message });
    }
};

// Função para atualizar um produto pelo ID
export const updateProduct = async (req, res) => {
    try {
        const { ID } = req.params;
        const { user_id_user, name, quantity, price } = req.body;

        // Verifica se pelo menos um campo foi fornecido para atualização
        if (name === undefined && quantity === undefined && price === undefined && user_id_user === undefined) {
            return res.status(400).json({
                error: "At least one field is required to update the product",
                details: "You must provide at least one of the following: user_id_user, name, quantity, or price.",
            });
        }

        // Busca o produto pelo ID no banco de dados
        let product = await Product.findByPk(ID);

        // Se o produto não for encontrado, retorna erro 404
        if (!product) {
            return res.status(404).json({ error: "Product not found", details: null });
        }

        // Verifica a relação na tabela user_has_list
        const userHasList = await User_has_List.findOne({
            where: { user_id_user, list_id_list: product.list_id_list },
        });

        if (!userHasList) {
            return res.status(403).json({
                error: "Access denied",
                details: `The user with ID: ${user_id_user} does not have access to the list with ID: ${product.list_id_list}`,
            });
        }

        // Atualiza os dados do produto
        if (name !== undefined) product.name = name;
        if (quantity !== undefined) product.quantity = quantity;
        if (price !== undefined) product.price = price;

        // Salva as alterações no banco de dados
        product = await product.save();

        // Retorna a resposta de sucesso com os dados atualizados
        return res.status(200).json({
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ error: "Failed to update product", details: error.message });
    }
};

// Função para deletar um produto pelo ID
export const deleteProduct = async (req, res) => {
    try {
        const { ID } = req.params;
        const { user_id_user } = req.body;

        // Valida se o ID do usuário foi fornecido
        if (!user_id_user) {
            return res.status(400).json({
                error: "User ID is required",
                details: "You must provide the user_id_user in the request body.",
            });
        }

        // Busca o produto pelo ID no banco de dados
        const product = await Product.findByPk(ID);

        // Se o produto não for encontrado, retorna erro 404
        if (!product) {
            return res.status(404).json({ error: "Product not found", details: null });
        }

        // Verifica a relação na tabela user_has_list
        const userHasList = await User_has_List.findOne({
            where: { user_id_user, list_id_list: product.list_id_list },
        });

        if (!userHasList) {
            return res.status(403).json({
                error: "Access denied",
                details: `The user with ID: ${user_id_user} does not have access to the list with ID: ${product.list_id_list}`,
            });
        }

        // Exclui o produto do banco de dados
        await product.destroy();

        // Retorna a resposta de sucesso
        return res.status(200).json({ message: "Product deleted successfully", data: null });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: "Failed to delete product", details: error.message });
    }
};
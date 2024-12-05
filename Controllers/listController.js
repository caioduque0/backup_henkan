// listController.js
import User from "../models/user.js";
import List from "../models/list.js";
import { io } from "../server.js";

// Function to create a new list
export const createList = async (req, res) => {
  try {
    const { name, id_owner, conteudo } = req.body;

    if (!name || !id_owner) {
      return res.status(400).json({ error: "Name and owner ID are required", details: null });
    }

    const user = await User.findByPk(id_owner);
    if (!user) {
      return res.status(404).json({ error: "Owner ID not found", details: null });
    }

    const newList = await List.create({ name, id_owner, conteudo });

    io.emit('listCreated', newList);

    return res.status(201)
      .location(`/list/${newList.id_list}`)
      .json({
        message: "Successfully created a new list",
        data: newList
      });
  } catch (error) {
    console.error("Error creating list:", error);
    return res.status(500).json({ error: "Failed to create a list", details: error.message });
  }
};

// **Function to get a list by ID**
export const getList = async (req, res) => {
  try {
    const { ID } = req.params;

    // Fetch the list by ID from the database
    const list = await List.findByPk(ID);

    // If the list is not found, return a 404 error
    if (!list) {
      return res.status(404).json({ error: "List not found", details: null });
    }

    return res.status(200).json({
      message: "List retrieved successfully",
      data: list
    });
  } catch (error) {
    console.error("Error fetching list:", error);
    return res.status(500).json({ error: "Failed to get list", details: error.message });
  }
};

// Function to update a list
export const updateList = async (req, res) => {
  try {
    const { ID } = req.params;
    const { name, id_owner, id_requester, conteudo } = req.body;

    let list = await List.findByPk(ID);

    if (!list) {
      return res.status(404).json({ error: "List not found", details: null });
    }

    if (id_requester !== list.id_owner) {
      return res.status(403).json({
        error: "Forbidden",
        details: "You do not have permission to update this list."
      });
    }

    if (name) list.name = name;
    if (conteudo) list.conteudo = conteudo;

    list.data_modificacao = new Date();

    list = await list.save();

    io.emit('listUpdated', list);

    return res.status(200).json({
      message: "List updated successfully",
      data: list
    });
  } catch (error) {
    console.error("Error updating list:", error);
    return res.status(500).json({ error: "Failed to update list", details: error.message });
  }
};

// Function to delete a list
export const deleteList = async (req, res) => {
  try {
    const { ID } = req.params;
    const { id_requester } = req.body;

    const list = await List.findByPk(ID);

    if (!list) {
      return res.status(404).json({ error: "List not found", details: null });
    }

    if (id_requester !== list.id_owner) {
      return res.status(403).json({
        error: "Forbidden",
        details: "You do not have permission to delete this list."
      });
    }

    await list.destroy();

    io.emit('listDeleted', { id_list: ID });

    return res.status(200).json({
      message: "List deleted successfully",
      data: null
    });

  } catch (error) {
    console.error("Error deleting list:", error);
    return res.status(500).json({ error: "Failed to delete list", details: error.message });
  }
};

import {Model, DataTypes, Sequelize} from 'sequelize';
import sequelize from '../dbConfig.js';

class List_Request extends Model {}

List_Request.init({
    id_lists_requests: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
    },
    situation: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: "P"
    },
    user_id_user: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users', // Nome da tabela relacionada
            key: 'id_user', // Coluna alvo na tabela relacionada
        },
        unique: true, // Relacionamento 1:1
    },
    list_id_list: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'lists', // Nome da tabela relacionada
            key: 'id_list', // Coluna alvo na tabela relacionada
        },
        unique: true, // Relacionamento 1:1
    }
}, {
    sequelize,
    timestamps: true,
    confirmedAt: 'confirmation_date',
    updatedAt: 'update_date',
    createdAt: 'create_date',
    tableName: 'list_requests'
});

export default List_Request;
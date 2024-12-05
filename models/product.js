import {Model, DataTypes, Sequelize} from 'sequelize';
import sequelize from '../dbConfig.js';

class Product extends Model {}

Product.init({
    id_product: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    quantity: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
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
    createdAt: 'create_date',
    updatedAt: 'update_date',
    modelName: 'product',
    tableName: 'products'
});

export default Product;
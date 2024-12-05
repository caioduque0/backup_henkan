import {Model, DataTypes, Sequelize} from 'sequelize';
import sequelize from '../dbConfig.js';

class User_has_List extends Model {}

User_has_List.init({
    id_user_lists: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
    },
    user_id_user: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'id_user', 
        },
        unique: true, 
    },
    list_id_list: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'lists', 
            key: 'id_list', 
        },
        unique: true, 
    }
}, {
    sequelize,
    timestamps: true,
    createdAt: 'create_date',
    updatedAt: 'update_date',
    tableName: 'user_has_lists'
});

export default User_has_List;
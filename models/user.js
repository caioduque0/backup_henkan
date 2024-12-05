import {Model, DataTypes, Sequelize} from 'sequelize';
import sequelize from '../dbConfig.js';

class User extends Model { };

User.init({
    id_user: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    mac: {
        type: DataTypes.CHAR(12),
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'create_date',
    updatedAt: 'update_date',
},
{tableName: 'users'});

export default User;
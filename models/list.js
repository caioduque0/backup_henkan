// list.js
import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../dbConfig.js';

class List extends Model {};

List.init({
  id_list: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  data_criacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  data_modificacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  id_owner: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'data_criacao',
  updatedAt: 'data_modificacao',
  modelName: 'list',
  tableName: 'lists',
});

export default List;

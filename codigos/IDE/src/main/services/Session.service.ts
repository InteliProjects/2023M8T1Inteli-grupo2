/**
 * Este arquivo define o modelo de dados para a tabela 'Session'.
 * A classe 'Session' estende o 'Model' do Sequelize, e representa uma sessão de terapia, no banco de dados.
 * Cada instância da classe 'Session' corresponde a uma linha na tabela 'Session'.
 * O método 'init' é usado para definir os campos da tabela e suas características.
 */

import { Sequelize, DataTypes, Model } from 'sequelize'
import { Database as sequelize } from './Database.service'

export class Session extends Model {
  public id?: number
  public projectId!: number
  public userId!: number
  public patientId!: number
  public logPath!: string
  public createdAt!: string
  public duration!: number
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    projectId: {
      type: new DataTypes.INTEGER(),
      allowNull: false
    },
    userId: {
      type: new DataTypes.INTEGER(),
      allowNull: false
    },
    patientId: {
      type: new DataTypes.INTEGER(),
      allowNull: false
    },
    logPath: {
      type: new DataTypes.STRING(),
      allowNull: false
    },
    createdAt: {
      type: new DataTypes.DATE(),
      allowNull: false
    },
    duration: {
      type: new DataTypes.REAL(),
      allowNull: false
    }
  },
  {
    tableName: 'sessions',
    sequelize: sequelize // this bit is important
  }
)

export const sessions = {
  async insert(session: Session) {
    return await Session.create(session)
  },

  async update(session: Session) {
    return await Session.update(session, { where: { id: session.id } })
  },

  async delete(id: string) {
    return await Session.destroy({ where: { id: id } })
  },

  async get(id: string) {
    return await Session.findByPk(id)
  },

  async getByUserId(userId: string) {
    return await Session.findAll({ where: { patientId: userId } })
  },

  async getAll() {
    return await Session.findAll()
  }
}

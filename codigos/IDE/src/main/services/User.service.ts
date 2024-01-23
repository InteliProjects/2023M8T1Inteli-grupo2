// Este serviço tem como objetivo gerenciar os usuários do sistema
// Inclui:
// - Tipo `User` para modelar a estrutura de dados de um usuário.
// - Objeto `users` com funções CRUD para usuários.
// - Uma função adicional `getByUsername` para buscar usuários pelo nome de usuário.
// - Cada função utiliza a função `connect` do módulo `Database.service` para interagir com o banco de dados.

import { Database as sequelize } from './Database.service'
import Sequelize from 'sequelize'
export type User = {
  id?: number
  username: string
  password: string
  role: number
  createdAt: string
}

export const users = {
  async insert(user: User) {
    const { username, password, role, createdAt } = user
    const query = 'INSERT INTO users (username, password, role, createdAt) VALUES (?, ?, ?, ?)'
    await sequelize.query(query, { replacements: [username, password, role, createdAt] })
  },

  async update(user: User) {
    const { id, username, password, role, createdAt } = user
    const query =
      'UPDATE users SET username = ?, password = ?, role = ?, createdAt = ? WHERE id = ?'
    await sequelize.query(query, { replacements: [username, password, role, createdAt, id] })
  },

  async delete(id: string) {
    const query = 'DELETE FROM users WHERE id = ?'
    await sequelize.query(query, { replacements: [id] })
  },

  async get(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ?'
    const users = await sequelize.query(query, {
      replacements: [id],
      type: Sequelize.QueryTypes.SELECT
    })
    return users[0] || null
  },

  async getAll(): Promise<User[]> {
    const query = 'SELECT * FROM users'
    const users = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT })
    return users
  },

  async getByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE username = ?'
    const users = await sequelize.query(query, {
      replacements: [username],
      type: Sequelize.QueryTypes.SELECT
    })
    return users[0] || null
  }
}

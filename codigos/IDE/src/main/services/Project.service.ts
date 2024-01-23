// Este serviço define um módulo para gerenciar projetos no banco de dados.
// Inclui:
// - Tipo `Project` para modelar a estrutura de dados de um projeto.
// - Objeto `projects` com funções CRUD para projetos.
// - Cada função utiliza a função `connect` do módulo `Database.service` para interagir com o banco de dados.

import { Database as sequelize } from './Database.service'
import Sequelize from 'sequelize'

export type Project = {
  id?: number
  name: string
  filePath: string
  authorId: number
  createdAt: string
  updatedAt: string
}

export const projects = {
  async insert(project: Project) {
    const { name, filePath, authorId, createdAt, updatedAt } = project
    const query =
      'INSERT INTO projects (name, filePath, authorId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)'
    await sequelize.query(query, { replacements: [name, filePath, authorId, createdAt, updatedAt] })
  },

  async update(project: Project) {
    const { id, name, filePath, authorId, createdAt, updatedAt } = project
    const query =
      'UPDATE projects SET name = ?, filePath = ?, authorId = ?, createdAt = ?, updatedAt = ? WHERE id = ?'
    await sequelize.query(query, {
      replacements: [name, filePath, authorId, createdAt, updatedAt, id]
    })
  },

  async delete(id: string) {
    const query = 'DELETE FROM projects WHERE id = ?'
    await sequelize.query(query, { replacements: [id] })
  },

  async get(id: string): Promise<Project | null> {
    const query = 'SELECT * FROM projects WHERE id = ?'
    const projects = await sequelize.query(query, {
      replacements: [id],
      type: Sequelize.QueryTypes.SELECT
    })
    return projects[0] || null
  },

  async getAll(): Promise<Project[]> {
    const query = 'SELECT * FROM projects'
    const projects = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT })
    return projects
  }
}

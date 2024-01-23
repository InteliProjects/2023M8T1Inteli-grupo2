import { Database as sequelize } from './Database.service'
import Sequelize from 'sequelize'

export type Patient = {
  id?: number
  name: string
  surname: string
  birthdate: string
  observations: string
  createdAt: string
  updatedAt: string
}

export const patients = {
  async insert(patient: Patient) {
    const { name, surname, birthdate, observations, createdAt, updatedAt } = patient
    const query =
      'INSERT INTO patients (name, surname, birthdate, observations, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
    await sequelize.query(query, {
      replacements: [name, surname, birthdate, observations, createdAt, updatedAt]
    })
  },

  async update(patient: Patient) {
    const { id, name, surname, birthdate, observations, createdAt, updatedAt } = patient
    const query =
      'UPDATE patients SET name = ?, surname = ?, birthdate = ?, observations = ?, createdAt = ?, updatedAt = ? WHERE id = ?'
    await sequelize.query(query, {
      replacements: [name, surname, birthdate, observations, createdAt, updatedAt, id]
    })
  },

  async delete(id: string) {
    const query = 'DELETE FROM patients WHERE id = ?'
    await sequelize.query(query, { replacements: [id] })
  },

  async get(id: string): Promise<Patient | null> {
    const query = 'SELECT * FROM patients WHERE id = ?'
    const patients = await sequelize.query(query, {
      replacements: [id],
      type: Sequelize.QueryTypes.SELECT
    })
    return patients[0] || null
  },

  async getAll(): Promise<Patient[]> {
    const query = 'SELECT * FROM patients'
    const patients = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT })
    return patients
  }
}

// Este arquivo TypeScript define um módulo que fornece funcionalidades de ponte para processamento de código.
// Inclui:
// - Importação do módulo axios para fazer requisições HTTP.
// - Objeto `codeBridge` com a função `processCode` para processar código.
// - A função `processCode` faz uma requisição POST para um endpoint de compilação, enviando o código e retornando a resposta.

import path from 'path'
import axios from 'axios'
const fs = require('fs')

const compilerPath = path.join(__dirname, '../../resources/compiler/', 'compiler.exe')

export const codeBridge = {
  async compileCode(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.writeFileSync('temp.qal', code)
      const execFile = require('child_process').execFile
      const compileProcess = execFile(compilerPath, ['temp.qal'])
      let data = ''
      let errorData = ''

      compileProcess.stdout.on('data', (chunk: any) => {
        data += chunk.toString()
      })

      compileProcess.stderr.on('data', (chunk: any) => {
        errorData += chunk.toString()
      })

      compileProcess.on('error', (error: any) => {
        fs.unlinkSync('temp.qal')
        reject(`Error occurred: ${error.message}`)
      })

      compileProcess.stdout.on('end', () => {
        fs.unlinkSync('temp.qal')
        if (errorData) {
          reject(`Error output: ${errorData}`)
        } else {
          resolve(data)
        }
      })
    })
  },
  async saveCompiledCodeAndRun(code: string, filepath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      fs.writeFileSync(filepath + '/main.py', code)
      const spawn = require('child_process').spawn
      const compileProcess = spawn('python', [filepath + '/main.py'])
      let errorData = ''
      const startTime = Date.now()
      let endTime = Date.now()

      compileProcess.stderr.on('data', (chunk: any) => {
        errorData += chunk.toString()
      })

      compileProcess.on('error', (error: any) => {
        reject(`Error occurred: ${error.message}`)
      })

      compileProcess.stdout.on('end', () => {
        endTime = Date.now()
        const elapsedMinutes = (endTime - startTime) / 1000 / 60
        if (errorData) {
          reject(`Error output: ${errorData}`)
        } else {
          resolve(elapsedMinutes)
        }
      })
    })
  }
}

import { IBlockRow } from '@renderer/pages/BlockEditor'
import { IBaseButton } from '@renderer/staticButtons'

export interface IProject {
  name: string
  globalCounter: number
  blockRows: IBlockRow[]
}

export class SceneProcessor {
  _processBlockRow(blockRow: IBlockRow): string {
    let code = ''
    const conditionBtn = blockRow.blocks[0]
    code += `  press_quadrante_${conditionBtn.id} = ${conditionBtn.correspondingCompileCode}\n`
    code += `  se press_quadrante_${conditionBtn.id} == verdade entao\n  inicio\n`

    for (let i = 1; i < blockRow.blocks.length; i++) {
      const block = blockRow.blocks[i]
      if (block.type === 'else') {
        code += '  fim senao\n  inicio\n'
        for (let j = i + 1; j < blockRow.blocks.length; j++) {
          const block = blockRow.blocks[j]
          code += `    ${block.correspondingCompileCode}\n`
        }
        break
      }
      code += `    ${block.correspondingCompileCode}\n`
    }

    code += '  fim\n'
    return code
  }

  _processBlockRows(blockRows: IBlockRow[]): string {
    let code = ''
    for (const blockRow of blockRows) {
      code += this._processBlockRow(blockRow)
    }
    return code
  }

  process(project: IProject): string {
    const header = `programa "${project.name}":\n`
    const code = `inicio\n${this._processBlockRows(project.blockRows)}fim.`
    return header + code
  }
}

export class BlockUtil {
  static remapBlockCompiledCode(
    newBlock: IBaseButton,
    rowIdx: number,
    globalCounter: number,
    setGlobalCounter: React.Dispatch<React.SetStateAction<number>>
  ): void {
    switch (newBlock.type) {
      case 'scene':
        newBlock.id = `${globalCounter}`
        newBlock.correspondingCompileCode = `mostrar(${newBlock.id})`
        setGlobalCounter(globalCounter + 1)
        break
      case 'sound':
        newBlock.id = `${globalCounter}`
        newBlock.correspondingCompileCode = `tocar(${newBlock.id})`
        setGlobalCounter(globalCounter + 1)
        break
      case 'wait':
        newBlock.id = `${globalCounter}`
        newBlock.correspondingCompileCode = `esperar(${newBlock.src})`
        setGlobalCounter(globalCounter + 1)
        break
      case 'else':
        newBlock.correspondingCompileCode = ''
        break
      case 'input':
        newBlock.id = rowIdx.toString()
        break
      default:
        console.log('setNewBlockCompileCode: type not found')
    }
  }
}

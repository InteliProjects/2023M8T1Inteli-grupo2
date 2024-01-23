import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faWalking,
  faImage,
  faMusic,
  faHourglassHalf,
  faUserXmark,
  faHandSparkles
} from '@fortawesome/free-solid-svg-icons'

export interface IBaseButton {
  id?: string
  name: string
  icon: IconDefinition
  category: 'input' | 'resource' | 'action' | 'logical'
  type: 'scene' | 'sound' | 'input' | 'wait' | 'else'
  src?: string
  correspondingCompileCode: string
  onClick?: () => void
}
self.code +=
  'keys = {6 : pygame.K_KP_ENTER, 2: pygame.K_SPACE, 4: pygame.K_UP, 1: pygame.K_DOWN, 3: pygame.K_RIGHT, 5: pygame.K_LEFT}\n'

export const inputButtons: IBaseButton[] = [
  {
    name: 'Quadrante 1 (Seta ↓)',
    type: 'input',
    category: 'input',
    icon: faHandSparkles,
    correspondingCompileCode: 'ler_varios(1,1,0)',
    src: ''
  },
  {
    name: 'Quadrante 2 (Espaço)',
    type: 'input',
    category: 'input',
    icon: faHandSparkles,
    correspondingCompileCode: 'ler_varios(2,1,0)',
    src: ''
  },
  {
    name: 'Quadrante 3 (Seta →)',
    type: 'input',
    category: 'input',
    icon: faHandSparkles,
    correspondingCompileCode: 'ler_varios(3,1,0)',
    src: ''
  },
  {
    name: 'Quadrante 4 (Seta ↑)',
    type: 'input',
    category: 'input',
    icon: faHandSparkles,
    correspondingCompileCode: 'ler_varios(4,1,0)',
    src: ''
  },
  {
    name: 'Quadrante 5 (Seta ←)',
    type: 'input',
    category: 'input',
    icon: faHandSparkles,
    correspondingCompileCode: 'ler_varios(5,1,0)',
    src: ''
  },
  {
    name: 'Quadrante 6 (Enter)',
    type: 'input',
    category: 'input',
    icon: faHandSparkles,
    correspondingCompileCode: 'ler_varios(6,1,0)',
    src: ''
  }
]

export const genericButtons: IBaseButton[] = [
  {
    name: 'Mostrar Cena',
    icon: faImage,
    correspondingCompileCode: '',
    type: 'scene',
    category: 'resource',
    src: '0'
  },
  {
    name: 'Tocar Som',
    icon: faMusic,
    correspondingCompileCode: 'music',
    type: 'sound',
    category: 'resource',
    src: '0'
  },
  {
    name: 'Esperar Segundos',
    icon: faHourglassHalf,
    correspondingCompileCode: '',
    type: 'wait',
    category: 'action',
    src: '5000'
  },
  {
    name: 'Caso errado',
    icon: faUserXmark,
    correspondingCompileCode: '',
    type: 'else',
    category: 'logical',
    src: ''
  }
]

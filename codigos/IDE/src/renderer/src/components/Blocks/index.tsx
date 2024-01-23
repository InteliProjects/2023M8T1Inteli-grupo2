/**
 * This file defines a GenericBlock component for React that is used to display a block with a specific color and icon.
 * It includes:
 * - Importing necessary libraries and styles.
 * - The DefinedBlockProps interface to define properties such as 'color' and 'icon'.
 * - The BlockProps interface extends DefinedBlockProps and adds 'type' and 'onClick' properties.
 * - The 'type' can be 'start', 'middle', or 'end'.
 * - The 'onClick' is a callback function to be called when the block is clicked.
 * - The GenericBlock component which renders a block with a specific color and icon and handles the click event.
 */

import './styles.css'
import { ReactElement } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface DefinedBlockProps {
  color?: string
  icon: IconDefinition
}

/**
 * Props for the Block component.
 */
interface BlockProps extends DefinedBlockProps {
  /**
   * The type of the block.
   * Can be 'start', 'middle', or 'end'.
   */
  type: 'start' | 'middle' | 'end'

  /**
   * Callback function to be called when the block is clicked.
   */
  onClick?: () => void
}
interface BlockProps extends DefinedBlockProps {
  type: 'start' | 'middle' | 'end'
  onClick?: () => void
}

export function GenericBlock({
  type,
  color,
  icon,
  onClick
}: BlockProps & { onClick?: () => void }): ReactElement {
  switch (type) {
    case 'start':
      return (
        <div
          onClick={onClick}
          style={{
            flexShrink: 0
          }}
        >
          <StartBlock color={color} icon={icon} />
        </div>
      )
    case 'middle':
      return (
        <div style={{ marginLeft: '-70px', flexShrink: 0 }} onClick={onClick}>
          <MiddleBlock color={color} icon={icon} />
        </div>
      )
    case 'end':
      return (
        <>
          <div
            style={{
              marginLeft: '-70px',
              display: 'flex',
              flexDirection: 'row',
              flexShrink: 0
            }}
            onClick={onClick}
          >
            <EndBlock color={color} icon={icon} />
          </div>
          <div style={{ flexGrow: 1, backgroundColor: color }}></div>
        </>
      )
    default:
      return (
        <div onClick={onClick}>
          <StartBlock color={color} icon={icon} />
        </div>
      )
  }
}

export function StartBlock({ color, icon }: DefinedBlockProps): ReactElement {
  const iconSize = 50
  const viewBoxSize = 100

  return (
    <svg
      height="100%"
      version="1.1"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize / 2}`} // Adjusted for a square aspect ratio
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <defs />
      <g id="Layer-1">
        <path
          d="M0 0L0 50L80 50L80 35L100 35L100 15L80 15L80 0L0 0Z"
          fill={color || '#3395ff'}
          fillRule="nonzero"
          opacity="1"
          stroke="none"
        />
      </g>
      <foreignObject width={viewBoxSize - iconSize / 2} height={viewBoxSize / 2} x="0" y="0">
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FontAwesomeIcon icon={icon} size="xl" />
        </div>
      </foreignObject>
    </svg>
  )
}

export function MiddleBlock({ color, icon }: DefinedBlockProps): ReactElement {
  const iconSize = 50
  const viewBoxSize = 100

  return (
    <svg
      height="100%"
      strokeMiterlimit="10"
      style={{
        fillRule: 'nonzero',
        clipRule: 'evenodd',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }}
      version="1.1"
      viewBox="0 0 100 50"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs />
      <g id="Layer1">
        <path
          d="M0 0L0 15L20 15L20 35L0 35L0 50L80 50L80 35L100 35L100 15L80 15L80 0L0 0Z"
          fill={color || '#3395ff'}
          fillRule="nonzero"
          opacity="1"
          stroke="none"
        />
      </g>
      <foreignObject width={viewBoxSize - iconSize / 4} height={viewBoxSize / 2} x="0" y="0">
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FontAwesomeIcon icon={icon} size="xl" />
        </div>
      </foreignObject>
    </svg>
  )
}

export function EndBlock({ color, icon }: DefinedBlockProps): ReactElement {
  const iconSize = 50
  const viewBoxSize = 100

  return (
    <svg
      height="100%"
      strokeMiterlimit="10"
      style={{
        fillRule: 'nonzero',
        clipRule: 'evenodd',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }}
      version="1.1"
      viewBox="0 0 100 50"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs />
      <clipPath id="ArtboardFrame">
        <rect height="50" width="100" x="0" y="0" />
      </clipPath>
      <g clipPath="url(#ArtboardFrame)" id="Layer1">
        <path
          d="M0 0L0 15L20 15L20 35L0 35L0 50L100 50L100 0L0 0Z"
          fill={color || '#3395ff'}
          fillRule="nonzero"
          opacity="1"
          stroke="none"
        />
      </g>
      <foreignObject width={viewBoxSize - iconSize / 2} height={viewBoxSize / 2} x="0" y="0">
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FontAwesomeIcon icon={icon} size="xl" />
        </div>
      </foreignObject>
    </svg>
  )
}

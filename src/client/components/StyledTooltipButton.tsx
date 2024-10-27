import { PlacesType, Tooltip } from 'react-tooltip'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuid } from 'uuid'

import { getSettings } from '@/selectors'

interface StyledTooltipButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  place?: PlacesType
  content: string
}

function StyledTooltipButton({
  place = 'top',
  content,
  children,
  ...props
}: StyledTooltipButtonProps) {
  const id = React.useRef(uuid())
  const { darkTheme } = useSelector(getSettings)

  return (
    <div className="tooltip-container">
      <button
        {...props}
        data-tooltip-id={id.current}
        data-tooltip-place={place}
        data-tooltip-content={content}
      >
        {children}
      </button>
      <Tooltip id={id.current} className={`${darkTheme ? 'dark' : ''} tooltip`} />
    </div>
  )
}

export { StyledTooltipButton }

import React from 'react'

export const Overlay = (props) => {
  const className = props.overlay ? 'overlay overlay--visible' : 'overlay'
  return (
    <div className={className} onClick={props.onClickOverlay}>
      <h2 className="overlay__text">
        You <span className="overlay__textspan1">solved</span>{' '}
        <span className="overlay__textspan2">it!</span>
      </h2>
    </div>
  )
}

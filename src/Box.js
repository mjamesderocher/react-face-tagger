import { useMachine } from '@xstate/react';
import { createMachine, assign, interpret } from 'xstate'
import { useEffect } from 'react' 

const assignPoint = assign({
  px: (context, event) => event.clientX,
  py: (context, event) => event.clientY,
});

const assignPosition = assign({
  x: (context, event) => {
    return (context.x + (context.dx / event.containerSize.x))
  },
  y: (context, event) => {
    return (context.y + (context.dy / event.containerSize.y))
  },
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const assignDelta = assign({
  dx: (context, event) => {
    return event.clientX - context.px
  },
  dy: (context, event) => {
    return event.clientY - context.py
  },
});

const showDelta = (context) => {
  //elBox.dataset.delta = `delta: ${context.dx}, ${context.dy}`
};

const resetPosition = assign({
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const machine = createMachine({
  initial: 'idle',
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0
  },
  states: {
    idle: {
      on: {
        mousedown: {
          actions: assignPoint,
          target: 'dragging',
        },
        touchstart: {
          actions: assignPoint,
          target: 'dragging',
        },
      },
    },
    dragging: {
      on: {
        mousemove: {
          actions: [assignDelta, showDelta],
          // no target!
        },
        touchmove: {
          actions: [assignDelta, showDelta],
          // no target!
        },
        mouseup: {
          actions: assignPosition,
          target: 'idle',
        },
        'keyup.escape': {
          target: 'idle',
          actions: resetPosition,
        },
      },
    },
  },
});

const service = interpret(machine);

service.start()

const Box = (props) => {
  const { mouseStatus, x, y, title, containerSize } = props

  const [state, send] = useMachine(machine, { 
    context: {
      x: x,
      y: y,
      dx: 0,
      dy: 0,
      px: 0,
      py: 0
    }
  })

  useEffect(() => {
    if (mouseStatus) {
      send({...mouseStatus, containerSize: containerSize})
    }
  }, [mouseStatus])

  let boxStyle = {
    '--dx': state.context.dx,
    '--dy': state.context.dy,
    '--x': state.context.x,
    '--y': state.context.y,
    '--size': props.size
  }

  return (
    <div 
      style={boxStyle}
      className="box-wrapper"
      onMouseDown={(event) => send(event)}
      onTouchStart={(event) => send(event)}
      onTouchMove={(event) => send(event)}
      onTouchEnd={(event) => send(event)}
      data-state={state.value}
    >
      <div className="box">
        <p className="box-label">{title}</p>
      </div>
    </div>
  )
}

export default Box


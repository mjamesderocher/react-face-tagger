
import React from 'react' 
import { useMachine } from '@xstate/react';
import { createMachine, assign, interpret } from 'xstate'

const assignPoint = assign({
  px: (context, event) => event.clientX,
  py: (context, event) => event.clientY,
});

const assignPosition = assign({
  x: (context, event) => {
    return context.x + context.dx;
  },
  y: (context, event) => {
    return context.y + context.dy;
  },
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const assignDelta = assign({
  dx: (context, event) => {
    return event.clientX - context.px;
  },
  dy: (context, event) => {
    return event.clientY - context.py;
  },
});

const showDelta = (context) => {
  //elBox.dataset.delta = `delta: ${context.dx}, ${context.dy}`;
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
    py: 0,
  },
  states: {
    idle: {
      on: {
        mousedown: {
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

// service.onTransition((state) => {
//   if (state.changed) {
//     console.log(state.context)
//   }
// })

function App() {
  const [state, send] = useMachine(machine);
  //    elBox.dataset.state = state.value;

  let boxStyle = {
    '--dx': state.context.dx,
    '--dy': state.context.dy,
    '--x': state.context.x,
    '--y': state.context.y
  }
  
  // elBody.addEventListener('keyup', (e) => {
  //   if (e.key === 'Escape') {
  //     send('keyup.escape');
  //   }
  // });

  return (
    <div 
      className="Container"
      onMouseMove={(event) => send(event)}
      onMouseUp={(event) => send(event)}
    >
      <div 
        style={boxStyle}
        className="box"
        onMouseDown={(event) => send(event)}
        data-state={state.value}
      >
        <div
          className="resize"
        ></div>
      </div>
    </div>
  );
}

export default App;

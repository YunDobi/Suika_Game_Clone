let engine = Matter.Engine.create();
let render = Matter.Render.create({
  element: document.getElementById('container'),
  engine: engine,
  options: { wireframes: false, width: 430, height: 754 },
});
const World = Matter.World;
let current = null;
let isClicking = false;
let falling = false;

//mouse move
let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  // mouse: mouse,
  constraint: {
    render: { visible: false },
  },
});
// render.mouse = mouse;

const wall = (x, y, width, height) => {
  return Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: { visible: true, fillStyle: 'orange' },
  });
};

const topLine = Matter.Bodies.rectangle(300, 0, 600, 20, {
  isStatic: true,
  isSensor: true,
  render: { visible: true, fillStyle: '#E6B143' },
});

World.add(engine.world, [
  mouseConstraint,
  //ground
  wall(300, 754, 600, 20),
  //left wall
  wall(-10, 370, 20, 754),
  //right wall
  wall(440, 370, 20, 754),
  topLine,
]);

// eslint-disable-next-line func-style
function addCurrentFruit() {
  console.log(current);
  // if (!current) {
  //   console.log("somthing is working right now");
  //   return;
  // }
  current = Matter.Bodies.circle(300, 50, Math.floor(Math.random() * 50) + 15, {
    // isStatic: true,
    isSleeping: true,
    render: { fillStyle: 'white' },
    restitution: 0.2,
  });
  console.log(current)
  World.add(engine.world, current);
}

addCurrentFruit();

Matter.Events.on(mouseConstraint, 'mousedown', () => {
  if (!falling) {
    isClicking = true;
    try {
      Matter.Body.setPosition(current, {
        x: mouse.position.x,
        y: current.position.y,
      });
    } catch (error) {
      console.log('already falling');
    }
  }
});

Matter.Events.on(mouseConstraint, 'mousemove', () => {
  // console.log(current)
  if (isClicking === true) {
    try {
      Matter.Body.setPosition(current, {
        x: mouse.position.x,
        y: current.position.y,
      });
    } catch (error) {
      console.log('already falling');
    }
  }
});

Matter.Events.on(mouseConstraint, 'mouseup', () => {
  if (falling) return;

  isClicking = false;
  falling = true;
  // Matter.Body.setStatic(current, false);
  Matter.Sleeping.set(current, false);
  current = null;

  console.log('c', isClicking, falling);

  setTimeout(() => {
    addCurrentFruit();
    falling = false;
  }, 1800);
});

Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
  // console.log("dd", pairs);
  falling = false;
  pairs.forEach(({ bodyA, bodyB }) => {
    // console.log(bodyA.label.includes('Circle'), bodyB);
    if (
      bodyA.label.includes('Circle') &&
      bodyB.label.includes('Circle') &&
      bodyA.circleRadius === bodyB.circleRadius
    ) {
      World.remove(engine.world, bodyA);
      World.remove(engine.world, bodyB);
      World.add(engine.world, [
        Matter.Bodies.circle(
          bodyA.position.x,
          bodyA.position.y,
          bodyA.circleRadius + 10,
          60
        ),
      ]);
    }
  });
});

Matter.Runner.run(engine);
// Matter.Engine.run(engine);
Matter.Render.run(render);

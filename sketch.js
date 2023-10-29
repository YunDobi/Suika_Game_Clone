let engine = Matter.Engine.create();
let render = Matter.Render.create({
  element: document.getElementById('container'),
  engine: engine,
  options: { wireframes: false, width: 620, height: 850 },
});

const World = Matter.World;
let current = null;
let isClicking = false;

//mouse move
let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: { visible: false },
  },
});
render.mouse = mouse;

const wall = (x, y, width, height) => {
  return Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: { visible: true, fillStyle: 'orange' },
  });
};

// const topLine = Matter.Bodies.rectangle(300, 0, 600, 20, {
//   isStatic: true,
//   render: {visible: true}
// });

World.add(engine.world, [
  mouseConstraint,
  //ground
  wall(300, 700, 600, 20),
  //left wall
  wall(-10, 360, 20, 700),
  //right wall
  wall(610, 360, 20, 700),
]);


// eslint-disable-next-line func-style
function addCurrentFruit() {
  current = Matter.Bodies.circle(300, 50, 15, { isStatic: true, render: {fillStyle: 'white'} });
  World.add(engine.world, current);
}

addCurrentFruit();

Matter.Events.on(mouseConstraint, 'mousedown', () => {
  isClicking = true;
})

Matter.Events.on(mouseConstraint, 'mousemove', () => {
  // console.log(current)
  if (isClicking) {
    try {
      Matter.Body.setPosition(current, {x: mouse.position.x, y: current.position.y});
    } catch (error) {
      console.log("already falling")
    }
  }
});

Matter.Events.on(mouseConstraint, 'mouseup', () => {
  isClicking = false;
  if (current !== null) {
    Matter.Body.setStatic(current, false);
  }
  current = null;
  if (!isClicking) {
    setTimeout(() => {
      addCurrentFruit();
    }, 3000);
  }
});

Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
  // console.log("dd", pairs);
  pairs.forEach(({ bodyA, bodyB }) => {
    console.log(bodyA.label.includes('Circle'), bodyB);
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

Matter.Engine.run(engine);
Matter.Render.run(render);

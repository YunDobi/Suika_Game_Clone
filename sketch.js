let engine = Matter.Engine.create();

let render = Matter.Render.create({
  element: document.getElementById('container'),
  engine: engine,
  options: { wireframes: true, width:600, height: 700 },
});

const wall = (x, y, width, height) => {
  return Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: { visible: true },
  });
};

//mouse move
let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: { visible: true },
  },
});
render.mouse = mouse;

const topLine = Matter.Bodies.rectangle(300, 0, 600, 20, {
  isStatic: true,
  render: {visible: true}
})
Matter.World.add(engine.world, [
  mouseConstraint,
  //ground
  wall(300, 700, 600, 20),
  //left wall
  wall(-10, 360, 20, 700),
  //right wall
  wall(610, 360, 20, 700),
  topLine,
]);

let temp = wall(300,50, 600, 5);

Matter.Events.on(mouseConstraint, 'mousedown', (event) => {
  console.log('clicked', mouse.position);
  Matter.World.add(engine.world, [
    Matter.Bodies.circle(mouse.position.x, mouse.position.y, 15, {isStatic: true})

  //after creat dragble the circle
  ]);
});

// Matter.Events.on(mouseConstraint, 'mousemove', () => {
//   console.log(mouse.position);

// })


Matter.Events.on(mouseConstraint, 'mouseup', (event) => {
  // console.log('clicked', mouse.position);
  // Matter.World.add(engine.world, [
  //   Matter.Bodies.circle(mouse.position.x, mouse.position.y, 15, 60),
  // ]);
  Matter.World.remove(engine.world, temp);
});

Matter.Events.on(engine,"collisionStart", ({pairs}) => {
  // console.log("dd", pairs);
  pairs.forEach(({bodyA, bodyB}) => {
    console.log(bodyA.label.includes("Circle"), bodyB)
    if (bodyA.label.includes("Circle") && bodyB.label.includes("Circle") && bodyA.circleRadius === bodyB.circleRadius) {
      Matter.World.remove(engine.world, bodyA);
      Matter.World.remove(engine.world, bodyB);
      Matter.World.add(engine.world, [
        Matter.Bodies.circle(bodyA.position.x, bodyA.position.y, bodyA.circleRadius + 10, 60)
      ]);
    }
  });
})


Matter.Engine.run(engine);
Matter.Render.run(render);

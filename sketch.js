
let engine = Matter.Engine.create();

let render = Matter.Render.create({
  element: document.body,
  engine: engine
});

let ground = Matter.Bodies.rectangle(400,600, 810, 60,{isStatic: true})
let boxA = Matter.Bodies.rectangle(400,200, 80, 60)
// let boxB = Matter.Bodies.rectangle(450,50, 80, 60)

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine,{
  mouse: mouse,
  constraint: {
    render: {visible: true}
  }
});
render.mouse = mouse;

Matter.World.add(engine.world,[ground,boxA, mouseConstraint]);

Matter.Events.on(mouseConstraint,"mousemove", function() {
  // console.log(mouse.position);

  // --this is the one way to show mouse location--
  // let foundPhysics = Matter.Query.point(engine.world, mouse.position);
})

Matter.Events.on(mouseConstraint, 'mousedown', event => {
  console.log("clicked", mouse.position);
})

Matter.Engine.run(engine);
Matter.Render.run(render);
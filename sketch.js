let engine = Matter.Engine.create();
engine.gravity.y = 1.5;
let render = Matter.Render.create({
  element: document.getElementById('container'),
  engine: engine,
  options: {
    wireframes: false,
    width: 430,
    height: 754,
    background: '#F7F4C8',
  },
});

const Friuts = [
  {
    label: 'cherry',
    radius: 40 / 2,
    color: '#F20306',
  },
  {
    label: 'strawberry',
    radius: 50 / 2,
    color: '#FF624C',
  },
  {
    label: 'grape',
    radius: 72 / 2,
    color: '#A969FF',
  },
  {
    label: 'kumkwat',
    radius: 85 / 2,
    color: '#FFAF02',
  },
  {
    label: 'orange',
    radius: 106 / 2,
    color: '#FC8611',
  },
  {
    label: 'apple',
    radius: 140 / 2,
    color: '#F41615',
  },
  {
    label: 'pear',
    radius: 160 / 2,
    color: '#FDF176',
  },
  {
    label: 'peach',
    radius: 196 / 2,
    color: '#FEB6AC',
  },
  {
    label: 'pineapple',
    radius: 220 / 2,
    color: '#F7E608',
  },
  {
    label: 'melon',
    radius: 270 / 2,
    color: '#89CE13',
  },
  {
    label: 'watermelon',
    radius: 300 / 2,
    color: '#26AA1E',
  },
];
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

const getRandomFruit = () => {
  const randomIndex = Math.floor(Math.random() * 5);
  const fruit = Friuts[randomIndex];

  if (current && current.label === fruit.label) return getRandomFruit();

  return fruit;
};

const wall = (x, y, width, height) => {
  return Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: { visible: true, fillStyle: 'orange' },
  });
};

const topLine = Matter.Bodies.rectangle(300, 120, 600, 2, {
  isStatic: true,
  isSensor: true,
  label: 'top',
  render: { visible: true, fillStyle: '#E6B143' },
});

World.add(engine.world, [
  mouseConstraint,
  //ground
  wall(300, 754, 600, 30),
  //left wall
  wall(-10, 370, 50, 754),
  //right wall
  wall(440, 370, 50, 754),
  topLine,
]);

const addCurrentFruit = () => {
  const randomFruit = getRandomFruit();

  current = Matter.Bodies.circle(300, 50, randomFruit.radius, {
    // isStatic: true,
    isSleeping: true,
    render: { fillStyle: randomFruit.color },
    friction: 0.05,
    density: 0.001,
    restitution: 0.2,
    label: randomFruit.label,
  });
  World.add(engine.world, current);
};

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
  if (falling || current === 'loading') return;

  isClicking = false;
  falling = true;
  Matter.Sleeping.set(current, false);
  current = 'loading';

  setTimeout(() => {
    addCurrentFruit();
    falling = false;
  }, 1800);
});

Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
  pairs.forEach(({ bodyA, bodyB }) => {
    if (bodyA.isStatic || bodyB.isStatic) return;
    const aY = bodyA.position.y + bodyA.circleRadius;
    const bY = bodyB.position.y + bodyB.circleRadius;
    // console.log('ay', aY, 'by', bY);

    if (aY < 140 || bY < 140) {
      alert('You over the line!');
      // console.log('falling:', falling, 'current:', current);
      Matter.Engine.clear(engine);
    }

    if (bodyA.label === bodyB.label) {
      const newFruit =
        Friuts[Friuts.findIndex((fruit) => fruit.label === bodyA.label) + 1];

      World.remove(engine.world, [bodyA, bodyB]);
      World.add(engine.world, [
        Matter.Bodies.circle(
          pairs[0].collision.supports[0].x,
          pairs[0].collision.supports[0].y,
          newFruit.radius,
          {
            render: {
              fillStyle: newFruit.color,
            },
            label: newFruit.label,
          }
        ),
      ]);
    }
  });
});

Matter.Runner.run(engine);
// Matter.Engine.run(engine);
Matter.Render.run(render);

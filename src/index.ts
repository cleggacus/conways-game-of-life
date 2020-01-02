import {Game} from './game';
import {getQueryVariable, copyString} from './utils';

const canvas: HTMLCanvasElement = document.querySelector("#canvas");
const startButton = document.querySelector("#start");
const resetButton = document.querySelector("#reset");
const exportButton = document.querySelector("#export");

const types = [
  {
    
  }
]

const fps = 50;
const width = getQueryVariable('width') ? getQueryVariable('width') : 100;
const height = getQueryVariable('height') ? getQueryVariable('height') : 100;
const grid = getQueryVariable('export') ? getQueryVariable('export') : '';

let running = false;

let fpsInterval, startTime, now, then, elapsed, ctx, game;

const animate = () => {
  requestAnimationFrame(animate);

  now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval) {
    update();
    then = now - (elapsed % fpsInterval);
    draw();
  }
}

const update = () => {
  if(running){
    game.update();
  }
}

const draw = () => {
  if(canvas.height/game.height > canvas.width/game.width){
    let h = canvas.width*(game.height/game.width);
    game.draw(ctx, 0, (canvas.height/2)-(h/2), canvas.width, h);
  }else{
    let w = canvas.height*(game.width/game.height);
    game.draw(ctx, (canvas.width/2)-(w/2), 0, w, canvas.height);
  }
}

const start = () => {
  if (canvas.getContext('2d')) {
    setCanvasSize();

    game = new Game(width, height);

    if(grid != ''){
      game.import(grid);
    }

    ctx = canvas.getContext('2d');
    
    window.addEventListener('resize', () => {
      setCanvasSize();
    });

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      if(canvas.height/game.height > canvas.width/game.width){
        let h = canvas.width*(game.height/game.width);
        y -= (canvas.height/2)-(h/2);
        if(y < h && y > 0)
          game.toggle(Math.floor((x/canvas.width)*game.width), Math.floor((y/h)*game.height));
      }else{
        let w = canvas.height*(game.width/game.height);
        x -= (canvas.width/2)-(w/2);
        if(x < w && x > 0)
          game.toggle(Math.floor((x/w)*game.width), Math.floor((y/canvas.height)*game.height));
      }
      
    });

    startButton.addEventListener('click', (e) => {
      running = !running;
      startButton.innerHTML = running ? 'PAUSE' : 'START';
    });

    resetButton.addEventListener('click', (e) => {
      game.initGrid();
    });

    exportButton.addEventListener('click', (e) => {
      copyString(`${window.location.href.split('?')[0]}?height=${game.height}&width=${game.width}&export=${game.export()}`);
      alert('copied');
    });
    
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;

    animate();

  } else {
    console.error("canvas not surported");
  }
}

const setCanvasSize = () => {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}

start();
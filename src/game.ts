class Game{
  width: number;
  height: number;
  cellBorder: number;
  liveColor: string;
  deadColor: string;
  grid: boolean[];

  constructor(width:number, height:number){
    this.width = width;
    this.height = height;
    this.cellBorder = 0;
    this.liveColor = '#fff';
    this.deadColor = '#000';
    this.initGrid();
  }

  initGrid(){
    this.grid = [];
    
    for(let i = 0; i < this.height*this.width; i++)
      this.grid.push(false);
  }

  activate(x, y){
    this.grid[y * this.width + x] = true;
  }

  kill(x, y){
    this.grid[y * this.width + x] = false;
  }

  toggle(x, y){
    this.grid[y * this.width + x] = !this.getCell(x, y);
  }

  getCell(x, y){
    if(x < 0 || y < 0){
      return false;
    }
      
    return this.grid[y * this.width + x];
  }

  export(){
    const temp = this.grid;
    let grid = '';

    while(temp.length % 5 != 0){
      temp.push(false);
    }

    for(let i = 0; i < temp.length; i+=5){
      let bin = (temp[i] ? '1' : '0')
        + (temp[i+1] ? '1' : '0')
        + (temp[i+2] ? '1' : '0')
        + (temp[i+3] ? '1' : '0')
        + (temp[i+4] ? '1' : '0');

      grid += parseInt(bin, 2).toString(32);
    }

    return grid;
  }

  import(base32: string){
    this.grid = [];
    
    for(let i = 0; i < base32.length; i++){
      let temp = parseInt(base32[i], 32).toString(2);
      if(temp.length%5 != 0){
        temp = '0'.repeat(5-(temp.length%5)) + temp;
      }
      console.log(temp);
      for(let j = 0; j < temp.length; j++){
        this.grid.push(temp[j] == '1' ? true : false);
      }
    }

    
  }

  update(){
    let temp = [];

    for(let y = 0; y < this.height; y++){
      for(let x = 0; x < this.width; x++){
        const tl = this.getCell(x-1, y-1) ? 1 : 0;
        const t = this.getCell(x, y-1) ? 1 : 0;
        const tr = this.getCell(x+1, y-1) ? 1 : 0;
        const r = this.getCell(x+1, y) ? 1 : 0;
        const br = this.getCell(x+1, y+1) ? 1 : 0;
        const b = this.getCell(x, y+1) ? 1 : 0;
        const bl = this.getCell(x-1, y+1) ? 1 : 0;
        const l = this.getCell(x-1, y) ? 1 : 0;
        
        const liveNeighbors = tl + t + tr + r + br + b + bl + l;

        if(this.getCell(x, y)){
          temp.push(liveNeighbors == 2 || liveNeighbors == 3);
        }else{
          temp.push(liveNeighbors == 3);
        }
      }
    }

    this.grid = temp;
  }

  draw(ctx: CanvasRenderingContext2D, x, y, width, height){
    const cellHeight = height / this.height;
    const cellWidth = width / this.width

    if(this.height > this.width){

    }else{
      
    }

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#222';
    ctx.fillRect(x, y, width, height);

    for(let i = 0; i < this.height; i++){
      const top = i * cellHeight + y;

      for(let j = 0; j < this.width; j++){
        const left = j * cellWidth + x;
        const index = this.width * i + j;

        let radius = (ctx.canvas.height/this.height > ctx.canvas.width/this.width) ?
          (ctx.canvas.width/70)*(20/this.width) : (ctx.canvas.height/70)*(20/this.height);

        /*ctx.beginPath();
        ctx.moveTo(left + radius, top);
        ctx.arcTo(left + cellWidth, top, left + cellWidth, top + cellHeight, radius);
        ctx.arcTo(left + cellWidth, top + cellHeight, left, top + cellHeight, radius);
        ctx.arcTo(left, top + cellHeight, left, top, radius);
        ctx.arcTo(left, top, left + cellWidth, top, radius);
        ctx.closePath();*/


        ctx.fillStyle = this.grid[index] ? '#fff' : '#222';
        ctx.strokeStyle = '#fff';
        ctx.fillRect(left, top, cellWidth, cellHeight);
        ctx.strokeRect(left, top, cellWidth, cellHeight);
      }
    }
  }
}

export {Game}
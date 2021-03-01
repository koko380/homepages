//windowが読み込まれた時に動作
window.onload = function() {
  let canvas = document.getElementById("canvas");
  let start_stop = document.getElementById("start_stop");
  let next = document.getElementById("next");
  let reset = document.getElementById("reset")
  let random = document.getElementById("random")
  let slide_bar = document.getElementById("slide_bar");
  let generation = document.getElementById("generation");
  let cell_quantity = document.getElementById("cell_quantity");

  if(!canvas || !canvas.getContext) return false;
  let context = canvas.getContext("2d");

  //各セルの状態を格納
  let cell = new Array(canvas.width/10);
  for(let i=0; i<canvas.width/10; i++){
    cell[i] = new Array(canvas.height/10).fill(0);
  }
  
  //セルを一時的に格納
  let cell_tmp = new Array(canvas.width/10);
  for(let i=0; i<canvas.width/10; i++){
    cell_tmp[i] = new Array(canvas.height/10).fill(0);
  }

  //描画をリセット
  function refresh(check){
    //描画をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);
    //周りの四角を表示
    context.strokeRect(0, 0, canvas.width, canvas.height);
    //縦線を表示
    for(let i=0; i<canvas.width; i+=10){
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, canvas.height);
      context.stroke();
    }
    //横線を表示
   for(let i=0; i<canvas.height; i+=10){
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(canvas.width, i);
      context.stroke();
    }

    if(check){
    //各セルの状態を格納
    cell = new Array(canvas.width/10);
    for(let i=0; i<canvas.width/10; i++){
      cell[i] = new Array(canvas.height/10).fill(0);
    }
    }
  }
  refresh(true);
  reset.addEventListener("click", function(event){
    start_stop.value = "start";
    refresh(true);
    generation_number = 0;
    generation.textContent = "";
    generation.insertAdjacentHTML("beforeend", generation_number);
    cell_quantity.textContent = "";
    cell_quantity.insertAdjacentHTML("beforeend", 0);
  });

  //ランダムにセルを配置
  random.addEventListener("click", function(event){
    refresh(true);
    for(let x=0; x<canvas.width/10; x++){
      for(let y=0; y<canvas.height/10; y++){
        cell[x][y]=Math.floor(Math.random()*2);
        if(cell[x][y] == 1){
          context.fillRect(x*10, y*10, 10, 10);
        }
      }
    }
    cell_quantity.textContent = "";
    cell_quantity.insertAdjacentHTML("beforeend", all_cell(cell));
  });

  canvas.addEventListener("click", function(event){
    let x = Math.floor((Math.floor((event.clientX-event.target.getBoundingClientRect().left)/(canvas.clientWidth/canvas.width)))/10)*10;
    let y = Math.floor((Math.floor((event.clientY-event.target.getBoundingClientRect().top)/(canvas.clientHeight/canvas.height)))/10)*10;
    if(cell[x/10][y/10] === 0){
      cell[x/10][y/10] = 1;
    } else {
      cell[x/10][y/10] = 0;
    }
    refresh(false);
    for(let x=0; x<canvas.width/10; x++){
      for(let y=0; y<canvas.height/10; y++){
        if(cell[x][y] == 1){
          context.fillRect(x*10, y*10, 10, 10);
        }
      }
    }
    cell_quantity.textContent = "";
    cell_quantity.insertAdjacentHTML("beforeend", all_cell(cell));
  }, false);

  //セルの合計
  function all_cell(cell){
    let cell_total = 0;
    for(let x=0; x<canvas.width/10; x++){
      for(let y=0; y<canvas.height/10; y++){
        if(cell[x][y] == 1){
          cell_total++;
        }
      }
    }
    return cell_total;
  }

  //セルの合計と生死の判定
  function cell_count(){
    for(let x=0; x<canvas.width/10; x++){
      for(let y=0; y<canvas.height/10; y++){
        //周りの生きてるセルの合計
        let cell_total;
        if(cell[x-1] === undefined && cell[x][y-1] === undefined){
          cell_total = cell[x+1][y]+cell[x][y+1]+cell[x+1][y+1];
        } else if(cell[x+1] === undefined && cell[x][y-1] === undefined){
          cell_total = cell[x-1][y]+cell[x-1][y+1]+cell[x][y+1];
        } else if(cell[x-1] === undefined && cell[x][y+1] === undefined){
          cell_total = cell[x][y-1]+cell[x+1][y-1]+cell[x+1][y];
        } else if(cell[x+1] === undefined && cell[x][y+1] === undefined){
          cell_total = cell[x-1][y-1]+cell[x][y-1]+cell[x-1][y];
        } else if(cell[x-1] === undefined){
          cell_total = cell[x][y-1]+cell[x+1][y-1]+cell[x+1][y]+cell[x][y+1]+cell[x+1][y+1];
        } else if(cell[x+1] === undefined){
          cell_total = cell[x-1][y-1]+cell[x][y-1]+cell[x-1][y]+cell[x-1][y+1]+cell[x][y+1];
        } else if(cell[x][y-1] === undefined){
          cell_total = cell[x-1][y]+cell[x+1][y]+cell[x-1][y+1]+cell[x][y+1]+cell[x+1][y+1];
        } else if(cell[x][y+1] === undefined){
          cell_total = cell[x-1][y-1]+cell[x][y-1]+cell[x+1][y-1]+cell[x-1][y]+cell[x+1][y];
        } else{
           cell_total = cell[x-1][y-1]+cell[x][y-1]+cell[x+1][y-1]+cell[x-1][y]+cell[x+1][y]+cell[x-1][y+1]+cell[x][y+1]+cell[x+1][y+1];
        }
        //誕生
        if(cell[x][y] === 0 && cell_total == 3){
          cell_tmp[x][y] = 1;                                      
        }
        //生存
        else if(cell[x][y] == 1 && (cell_total == 2 || cell_total == 3)){
          cell_tmp[x][y] = 1;
        }
        //過疎
        else if(cell[x][y] == 1 && cell_total <= 1){
          cell_tmp[x][y] = 0;
        }
        //過密
        else if(cell[x][y] == 1 && cell_total >= 4){
          cell_tmp[x][y] = 0;
        }
        //変化なし
        else {
          cell_tmp[x][y] = cell[x][y];
        }
      }
    }
  }

  //次の世代を描画
  function next_generation(){
    refresh(true);
    for(let x=0; x<canvas.width/10; x++){
      for(let y=0; y<canvas.height/10; y++){
        if(cell[x][y] === 0 && cell_tmp[x][y] == 1){
          context.fillRect(x*10, y*10, 10, 10);
          cell[x][y] = cell_tmp[x][y];
        }
        if(cell[x][y] == 1 && cell_tmp[x][y] === 0){
          //context.clearRect(x*10, y*10, 10, 10);
          //context.strokeRect(x*10, y*10, 10, 10);
          cell[x][y] = cell_tmp[x][y];
        }
        
      }
    }
  }

  let generation_number = 0;

  //次の世代に自動で更新
  start_stop.addEventListener("click", async function(){
    let loop = true;
    if(start_stop.value == "stop"){
      start_stop.value = "start";
      loop = false;
    }
    if(start_stop.value =="start" && loop){
      start_stop.value = "stop"
    }
    while(start_stop.value =="stop"){
      cell_count();
      next_generation()
      generation_number++;
      generation.textContent = "";
      generation.insertAdjacentHTML("beforeend", generation_number);
      cell_quantity.textContent = "";
      cell_quantity.insertAdjacentHTML("beforeend", all_cell(cell));
      await new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve();
        }, slide_bar.value);
      });
    }
  }, false);
  
  //次の世代に1つ進める
  next.addEventListener("click", function(){
    cell_count();
    next_generation();
    generation_number++;
    generation.textContent = "";
    generation.insertAdjacentHTML("beforeend", generation_number);
    cell_quantity.textContent = "";
    cell_quantity.insertAdjacentHTML("beforeend", all_cell(cell));
  }, false);
};
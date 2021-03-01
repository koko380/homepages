window.onload = function() {
  let input_file = document.getElementById("input_file");
  let textbox = document.getElementById("textbox");
  let start_stop = document.getElementById("start_stop");
  
  let canvas = document.getElementById("canvas");
  canvasContext = canvas.getContext("2d");
  
  let reader = new FileReader();

  textbox.addEventListener("change", function(){
    textbox.value = textbox.value;
    console.log(textbox.value.length);
  })
  
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioContext = new AudioContext();
  input_file.addEventListener("change", function(event){
    let file = event.target.files[0];
    reader.onload = function(){
      function successCallback(audioBuffer){
        let source = audioContext.createBufferSource();
        
        let analyser = audioContext.createAnalyser();
        
        source.buffer = audioBuffer;
        source.connect(analyser).connect(audioContext.destination);
        
        analyser.fftSize = 2048;
        //analyser.fftSize = 256;
        
        let interval = window.setInterval(function(){
          let spectrums = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(spectrums);
          
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          canvasContext.fillStyle = "rgb(1, 0, 50)";
          canvasContext.fillRect(0, 0, canvas.width, canvas.height);
          
          //canvasContext.beginPath();
          //canvasContext.arc(canvas.width/2, canvas.height/2,  canvas.height/4, 0*Math.PI/180, 360*Math.PI/180, false);
          //canvasContext.stroke();
          
          let spectrumsLength = spectrums.length*0.75;
          
          for(let i=0; i<spectrumsLength; i++){
            canvasContext.save();
            canvasContext.setTransform(1, 0, 0, 1, 0, 0);
            let r = 128+127*Math.cos((i+5)/180*Math.PI);
            let g = 128+127*Math.cos(((i+5)+120)/180*Math.PI);
            let b = 128+127*Math.cos(((i+5)-120)/180*Math.PI);
            canvasContext.fillStyle = "rgb(175, 175, 175)";
            canvasContext.textAlign = "center";
            canvasContext.textBaseline = "middle";
            canvasContext.font = `${canvas.height/textbox.value.length/5}px`;
            canvasContext.fillText(textbox.value, canvas.width/2, canvas.height/2);
            canvasContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
            canvasContext.translate(canvas.width/2 + canvas.height/8*Math.cos((Math.PI/180) * (360/spectrumsLength*i-90)), canvas.height/2 + canvas.height/8*Math.sin((Math.PI/180) * (360/spectrumsLength*i-90)));
            canvasContext.rotate((Math.PI/180) * (360/spectrumsLength*i-180));
            canvasContext.translate(-(canvas.width/2 + canvas.height/8*Math.cos((Math.PI/180) * (360/spectrumsLength*i-90))), -(canvas.height/2 + canvas.height/8*Math.sin((Math.PI/180) * (360/spectrumsLength*i-90))));
            let startWidth = canvas.width/2 + canvas.height/8*Math.cos((Math.PI/180) * (360/spectrumsLength*i-90));
            let startHeight = canvas.height/2 + canvas.height/8*Math.sin((Math.PI/180) * (360/spectrumsLength*i-90));
            let barWidth = 360/spectrumsLength;
            let barHeight = spectrums[i]/255 * canvas.height/10 + 5;
            if(spectrums[i] === 0){
              canvasContext.fillRect(startWidth, startHeight, barWidth, 5);
            }
            canvasContext.fillRect(startWidth, startHeight, barWidth, barHeight);
            canvasContext.restore();
          }
        }, 10);
        
        let onMusic = false;
        
        source.onended = function(){
          clearInterval(interval);
          audioContext.suspend();
          start_stop.value = "start";
          
          let spectrums = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(spectrums);
          let spectrumsLength = spectrums.length*0.75;
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          canvasContext.fillStyle = "rgb(1, 0, 50)";
          canvasContext.fillRect(0, 0, canvas.width, canvas.height);
          for(let i=0; i<spectrumsLength; i++){
            canvasContext.save();
            canvasContext.setTransform(1, 0, 0, 1, 0, 0);
            let r = 128+127*Math.cos((i+5)/180*Math.PI);
            let g = 128+127*Math.cos(((i+5)+120)/180*Math.PI);
            let b = 128+127*Math.cos(((i+5)-120)/180*Math.PI);
            canvasContext.fillStyle = "rgb(175, 175, 175)";
            canvasContext.textAlign = "center";
            canvasContext.textBaseline = "middle";
            canvasContext.font = `${canvas.height/textbox.value.length/5}px`;
            canvasContext.fillText(textbox.value, canvas.width/2, canvas.height/2, 100);
            canvasContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
            canvasContext.translate(canvas.width/2 + canvas.height/8*Math.cos((Math.PI/180) * (360/spectrumsLength*i-90)), canvas.height/2 + canvas.height/8*Math.sin((Math.PI/180) * (360/spectrumsLength*i-90)));
            canvasContext.rotate((Math.PI/180) * (360/spectrumsLength*i-180));
            canvasContext.translate(-(canvas.width/2 + canvas.height/8*Math.cos((Math.PI/180) * (360/spectrumsLength*i-90))), -(canvas.height/2 + canvas.height/8*Math.sin((Math.PI/180) * (360/spectrumsLength*i-90))));
            let startWidth = canvas.width/2 + canvas.height/8*Math.cos((Math.PI/180) * (360/spectrumsLength*i-90));
            let startHeight = canvas.height/2 + canvas.height/8*Math.sin((Math.PI/180) * (360/spectrumsLength*i-90));
            let barWidth = 360/spectrumsLength;
            let barHeight = spectrums[i]/255 * canvas.height/10 + 5;
            canvasContext.fillRect(startWidth, startHeight, barWidth, 5);
            canvasContext.restore();
          }
          
          onMusic = false;
        }
        
        start_stop.addEventListener("click", function(){
          if(start_stop.value == "stop"){
            audioContext.suspend();
            start_stop.value = "start";
          } else {
            audioContext.resume();
            if(onMusic === false){
              source.start(3);
              onMusic = true;
            }
            start_stop.value = "stop";
          }
        })
      }
      
      function errorCallback(error){
        alert('Error:"decodeAudioData" method');
      }
      audioContext.decodeAudioData(reader.result, successCallback, errorCallback);
    }
    reader.readAsArrayBuffer(file);
  });
};

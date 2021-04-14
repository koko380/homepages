window.onload = async function(){
	let noiseGate = document.getElementById("noiseGate");
	let noiseGateValue = document.getElementById("noiseGateValue");
	noiseGate.addEventListener("input", function(){
		noiseGateValue.innerHTML = noiseGate.value;
	});

	//WebRTC用の音声読み込み
	let video = document.getElementById("video");
	let playVideo = document.getElementById("playVideo");
	let medias = {
		audio: true,
		video: false
	};
	let stream = await navigator.mediaDevices.getUserMedia(medias);

	//周波数の表示領域
	let canvas = document.getElementById("canvas");
	let canvasCtx = canvas.getContext("2d");

	playVideo.addEventListener("click", function(){
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		let audioCtx = new AudioContext();
		
		let analyser = audioCtx.createAnalyser();
		//高速フーリエ変換のデータサイズ
		analyser.fftSize = 2048;
		//初期値は-100dB
		analyser.minDecibels = -150;
		//初期値は-30dB
		analyser.maxDecibels = 0;
		//周波数領域の波形(振幅スペクトル)描画に関連するプロパティ
		analyser.smoothingTimeConstant = 0.8;

		let source = audioCtx.createMediaStreamSource(stream);

		let volume = audioCtx.createGain();

		source.connect(analyser);
		source.connect(volume);
		volume.connect(audioCtx.destination);

		//周波数表示の更新
		let intervalid = window.setInterval(function(){
			let range = analyser.maxDecibels - analyser.minDecibels;

			//500Hz間隔のサンプル数の値
			let n500Hz = Math.floor(500/(audioCtx.sampleRate/analyser.fftSize));

			//fftSizeプロパティの1/2の値(ナイキスト周波数)を8で割ったもの
			let spectrums = new Float32Array(analyser.frequencyBinCount/8);
			//周波数領域の波形データ(振幅スペクトル)をデシベル単位で取得するメソッド
			analyser.getFloatFrequencyData(spectrums);

			canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

			canvasCtx.beginPath();

			//縦のグリッド
			for(let i=0; i<spectrums.length; i++){
				let x = Math.floor((i/spectrums.length) * canvas.width);
        let y = Math.floor((-1*((spectrums[i]-analyser.maxDecibels)/range)) * canvas.height);

				//周波数の線の描画
				if(i === 0){
          canvasCtx.moveTo(x, y);
        } else {
					if(-1*((spectrums[i]-analyser.maxDecibels)/range) <= -parseInt(noiseGate.value)/150){
          	canvasCtx.lineTo(x, y);
						volume.gain.value = 1;
					} else {
						canvasCtx.lineTo(x, canvas.height);
						volume.gain.value = 0;
					}
        }

				//テキストの縦線の描画
				if((i%n500Hz) === 0){
					//500Hz間隔のサンプル数の値を周波数に変換
          let f = Math.floor(500*(i/n500Hz));
          let text = (f<1000) ? (f+" Hz") : ((f/1000)+" kHz");
          canvasCtx.fillRect(x, 0, 1, canvas.height);
          canvasCtx.fillText(text, x, canvas.height);
        }
			}

			canvasCtx.stroke();

			//横のグリッド
			for(let i=analyser.minDecibels; i<=analyser.maxDecibels; i+=10){
        let gy =(-1*((i-analyser.maxDecibels)/range)) * canvas.height;
				//周波数の横線の描画
        canvasCtx.fillRect(0, gy, canvas.width, 1);
				//テキストの描画
        canvasCtx.fillText((i+" dB"), 0, gy);
      }
		//インターバルは10msec
		}, 10);
	});
};

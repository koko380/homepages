class Noise extends AudioWorkletProcessor {
	constructor() {
		super();

		this.port.onmessage = event => {
			console.log(event.data);
		this.port.postMessage("pon");
		}
	}

	//オーディオ処理の実装箇所
	process(inputs, outputs, parameters) {
		//複数の入出力があった場合、最初のinputs, outputsを取得
		let input  = inputs[0];
		let output = outputs[0];

		for (let channel=0; channel<output.length; channel++) {
			for(let i=0; i<output[channel].length; i++){
				//乱数を出力に格納
				output[channel][i] = 2*(Math.random()-0.5);
			}
		}
		return true;
	}
}
//"Noise"にNoiseクラスを登録
registerProcessor("Noise", Noise);

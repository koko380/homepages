class WhiteNoise extends AudioWorkletProcessor{
	constructor(){
		super();
	}

	static get parameterDescripters(){
		return [{
			name: "white_noise",
			defaultValue: 0,
			minValue: 0,
			maxValue: 1,
			automationRate: "k-rate"
		}];
	}


	process(inputs, outputs, parameters){
		let input = inputs[0];
		let output = outputs[0];
		let parameters = parameters.white_noise[0]; //今回は使わない。

		for(let channel=0; channel<output.length; channel++){
			for(let i=0; i<output[channel].length; i++){
				output[channel][i] = 2*(Math.random()-0.5);
			}
		}

		return true;
	}
}

registerProcessor("white_noise", WhiteNoise);

//各オシレータの起動
var oscillator1_on_off = true;
var oscillator2_on_off = false;
var oscillator3_on_off = false;
var white_noise_on_off = false;

//Oscillator1の有効化のフラグ
document.getElementById("oscillator1_on").onclick = function(){
  oscillator1_on_off = true;
}
document.getElementById("oscillator1_off").onclick = function(){
  oscillator1_on_off = false;
}
//Oscillator2の有効化のフラグ
document.getElementById("oscillator2_on").onclick = function(){
  oscillator2_on_off = true;
}
document.getElementById("oscillator2_off").onclick = function(){
  oscillator2_on_off = false;
}
//Oscillator3の有効化のフラグ
document.getElementById("oscillator3_on").onclick = function(){
  oscillator3_on_off = true;
}
document.getElementById("oscillator3_off").onclick = function(){
  oscillator3_on_off = false;
}
//White Noiseの有効化のフラグ
document.getElementById("white_noise_on").onclick = function(){
  white_noise_on_off = true;
}
document.getElementById("white_noise_off").onclick = function(){
  white_noise_on_off = false;
}


document.getElementById("start_button").onclick = function(){

window.AudioContext = window.AudioContext || window.webkitAudioContext;

//AudioContextのインスタンスを生成
var context = new AudioContext();

//レガシーブラウザー用
context.createGain = context.createGain || context.createGainNode;

//GainNodeのインスタンスを生成
var vol = context.createGain();







//Oscillator1のインスタンスを生成
var oscillator1 = context.createOscillator();

//波形の種類
var waveform = document.getElementById("wave_type1").value;
if(waveform == "sine"){
  oscillator1.type = (typeof oscillator1.type === "string") ? "sine" : 0;
} else if(waveform == "square"){
  oscillator1.type = (typeof oscillator1.type === "string") ? "square" : 1;
} else if(waveform == "sawtooth"){
  oscillator1.type = (typeof oscillator1.type === "string") ? "sawtooth" : 2;
} else if(waveform == "triangle"){
  oscillator1.type = (typeof oscillator1.type === "string") ? "triangle" : 3;
} else if(waveform == "custom"){
  oscillator1.type = (typeof oscillator1.type === "string") ? "custom" : 4;
}


var octave1 = document.getElementById("octave_range1").value;
if(octave1 == -3){
	octave1 = 1/Math.pow(2,3);
} else if(octave1 == -2){
	octave1 = 1/Math.pow(2,2);
} else if(octave1 == -1){
  octave1 = 1/2;
} else if(octave1 == 0){
  octave1 = 1;
} else if(octave1 == 1){
  octave1 = 2;
} else if(octave1 == 2){
  octave1 = 2^2;
}

var coarse1 = document.getElementById("coarse_range1").value;

//音高
oscillator1.frequency.value = document.getElementById("frequency_range").value * octave1;
for(i=0; i<coarse1; i++){
	oscillator1.frequency.value += oscillator1.frequency.value * Math.pow(2,1/12) - oscillator1.frequency.value;
}

//半音単位の音高
oscillator1.detune.value = document.getElementById("fine_range1").value;


//Oscillator2のインスタンスを生成
var oscillator2 = context.createOscillator();

//波形の種類
var waveform = document.getElementById("wave_type2").value;
if(waveform == "sine"){
  oscillator2.type = (typeof oscillator2.type === "string") ? "sine" : 0;
} else if(waveform == "square"){
  oscillator2.type = (typeof oscillator2.type === "string") ? "square" : 1;
} else if(waveform == "sawtooth"){
  oscillator2.type = (typeof oscillator2.type === "string") ? "sawtooth" : 2;
} else if(waveform == "triangle"){
  oscillator2.type = (typeof oscillator2.type === "string") ? "triangle" : 3;
} else if(waveform == "custom"){
  oscillator2.type = (typeof oscillator2.type === "string") ? "custom" : 4;
}

var octave2 = document.getElementById("octave_range2").value;
if(octave2 == -3){
  octave2 = 1/Math.pow(2,3);
} else if(octave2 == -2){
  octave2 = 1/Math.pow(2,2);
} else if(octave2 == -1){
  octave2 = 1/2;
} else if(octave2 == 0){
  octave2 = 1;
} else if(octave2 == 1){
  octave2 = 2;
} else if(octave2 == 2){
  octave2 = 2^2;
}

var coarse2 = document.getElementById("coarse_range2").value;

//音高
oscillator2.frequency.value = document.getElementById("frequency_range").value * octave2;
for(i=0; i<coarse2; i++){
  oscillator2.frequency.value += oscillator2.frequency.value * Math.pow(2,1/12) - oscillator2.frequency.value;
}

//半音単位の音高
oscillator2.detune.value = document.getElementById("fine_range2").value;




//Oscillator3のインスタンスを生成
var oscillator3 = context.createOscillator();

//波形の種類
var waveform = document.getElementById("wave_type3").value;
if(waveform == "sine"){
  oscillator3.type = (typeof oscillator3.type === "string") ? "sine" : 0;
} else if(waveform == "square"){
  oscillator3.type = (typeof oscillator3.type === "string") ? "square" : 1;
} else if(waveform == "sawtooth"){
  oscillator3.type = (typeof oscillator3.type === "string") ? "sawtooth" : 2;
} else if(waveform == "triangle"){
  oscillator3.type = (typeof oscillator3.type === "string") ? "triangle" : 3;
} else if(waveform == "custom"){
  oscillator3.type = (typeof oscillator3.type === "string") ? "custom" : 4;
}

var octave3 = document.getElementById("octave_range3").value;
if(octave3 == -3){
  octave3 = 1/Math.pow(2,3);
} else if(octave3 == -2){
  octave3 = 1/Math.pow(2,2);
} else if(octave3 == -1){
  octave3 = 1/2;
} else if(octave3 == 0){
  octave3 = 1;
} else if(octave3 == 1){
  octave3 = 2;
} else if(octave3 == 2){
  octave3 = 2^2;
}

var coarse3 = document.getElementById("coarse_range3").value;

//音高
oscillator3.frequency.value = document.getElementById("frequency_range").value * octave3;
for(i=0; i<coarse3; i++){
  oscillator3.frequency.value += oscillator3.frequency.value * Math.pow(2,1/12) - oscillator3.frequency.value;
}

//半音単位の音高
oscillator3.detune.value = document.getElementById("fine_range3").value;

//ScriptProcessorは廃止予定
//レガシーブラウザー用
context.createScriptProcessor = context.createScriptProcessor || context.createJavaScriptNode;

//ホワイトノイズのインスタンスを生成
var white_noise = context.createScriptProcessor(1024, 2, 2);

//iOSのバグ対策
var dummy = context.createBufferSource();

if(white_noise_on_off == true){
	white_noise.onaudioprocess = function(event){
		var outputL = event.outputBuffer.getChannelData(0);
		var outputR = event.outputBuffer.getChannelData(1);
		for(var i=0; i<this.bufferSize; i++){
			outputL[i] = 2*(Math.random()-0.5);
			outputR[i] = 2*(Math.random()-0.5);
		}
	}
}




/*
//ホワイトノイズを生成する関数
async function noise1(){
	await context.audioWorklet.addModule("white_noise.js");
	let white_noise = new AudioWorkletNode(context, "WhiteNoise");
	let white_noise.noise = white_noise.parameters.get("white_noise"); //今回は使わない。
	//white_noise_vol = new GainNode(context, {gain:1});
	white_noise.connect(vol);
}
*/


oscillator3.detune.value = document.getElementById("fine_range3").value;


//フィルター用の設定
var filter = context.createBiquadFilter();

//フィルターの種類
var filter_type = document.getElementById("filter_type").value;
if(filter_type == "low_pass"){
	filter.type = (typeof filter.type === "string") ? "lowpass" : 0;
} else if(filter_type == "high_pass"){
	filter.type = (typeof filter.type === "string") ? "highpass" : 1;
} else if(filter_type == "band_pass"){
  filter.type = (typeof filter.type === "string") ? "bandpass" : 2;
} else if(filter_type == "low_shelf"){
  filter.type = (typeof filter.type === "string") ? "lowshelf" : 3;
} else if(filter_type == "high_shelf"){
  filter.type = (typeof filter.type === "string") ? "highshelf" : 4;
} else if(filter_type == "peaking"){
  filter.type = (typeof filter.type === "string") ? "peaking" : 5;
} else if(filter_type == "notch"){
  filter.type = (typeof filter.type === "string") ? "notch" : 6;
} else if(filter_type == "all_pass"){
	filter.type = (typeof filter.type === "string") ? "allpass" : 7;
}

//カットオフ
var master_filter = document.getElementById("cutoff_range").value;
//カットオフの範囲の細かい設定
filter.detune.value = 0; //いらないかな？
//アマウント(エンベロープ)
var amount = document.getElementById("amount_range").value/100;
//フィルターの帯域幅
filter.Q.value = document.getElementById("q_range").value;
//周波数帯域の強調(レゾナンス)
filter.gain.value = document.getElementById("resonance_range").value;


//フィルターADSRの設定
var fil_attack = document.getElementById("fil_attack_range").value/1000;
var fil_decay = document.getElementById("fil_decay_range").value/1000;
var fil_sustain = document.getElementById("fil_sustain_range").value/100;
var fil_release = document.getElementById("fil_release_range").value/1000;



//全体の音量
var master_volume = document.getElementById("volume_range").value;

//一時対策用のボリューム
var master_volume = 0.5;

//ボリュームADSRの設定
var vol_attack = document.getElementById("vol_attack_range").value/1000;
var vol_decay = document.getElementById("vol_decay_range").value/1000;
var vol_sustain = document.getElementById("vol_sustain_range").value/100;
var vol_release = document.getElementById("vol_release_range").value/1000;


//パンの設定
var panner = context.createStereoPanner();
panner.pan.value = document.getElementById("pan_range").value/100;


//(AudioBufferSourceNode ->) ScriptProcessorNode -> AudioDestinationNode
dummy.connect(white_noise);
white_noise.connect(filter);

//OscillatorNode(Input) -> GainNode(Volume) -> AudioDestinationNode(Output)
oscillator1.connect(filter);
oscillator2.connect(filter);
oscillator3.connect(filter);
filter.connect(vol);
vol.connect(panner);
panner.connect(context.destination);


//レガシーブラウザー用
oscillator1.start = oscillator1.start || oscillator1.noteOn;
oscillator1.stop = oscillator1.stop || oscillator1.noteOff;
oscillator2.start = oscillator2.start || oscillator2.noteOn;
oscillator2.stop = oscillator2.stop || oscillator2.noteOff;
oscillator3.start = oscillator3.start || oscillator3.noteOn;
oscillator3.stop = oscillator3.stop || oscillator3.noteOff;

var t0 = context.currentTime;

if(oscillator1_on_off == true){
	oscillator1.start(t0);
}
if(oscillator2_on_off == true){
	oscillator2.start(t0);
}
if(oscillator3_on_off == true){
	oscillator3.start(t0);
}

vol.gain.setValueAtTime(0, t0);
filter.frequency.setValueAtTime(master_filter, t0);

var vol_t1 = t0 + vol_attack;
vol.gain.linearRampToValueAtTime(master_volume, vol_t1);
var fil_t1 = t0 + fil_attack;

if(amount>=0){
	filter.frequency.linearRampToValueAtTime(parseInt(master_filter)+parseInt(((22000-master_filter)*amount)), fil_t1);
} else if(amount<0){
  filter.frequency.linearRampToValueAtTime(parseInt(master_filter)+parseInt(((master_filter-10)*amount)), fil_t1);
}

var vol_t2 = vol_decay;
var vol_t2_value = master_volume*vol_sustain;
var fil_t2 = fil_decay;
var fil_t2_value = fil_sustain;

//レガシーブラウザー用
vol.gain.setTargetAtTime = vol.gain.setTargetAtTime || vol.gain.setTargetValueAtTime;

vol.gain.setTargetAtTime(master_volume*vol_t2_value, vol_t1, vol_t2);
if(amount>=0){
	filter.frequency.setTargetAtTime(parseInt(master_filter)+(parseInt((22000-master_filter)*fil_t2_value)), fil_t1, fil_t2);
} else if(amount<0){
	filter.frequency.setTargetAtTime(parseInt(master_filter)-(parseInt((master_filter-10)*fil_t2_value)), fil_t1, fil_t2);
}

document.getElementById("stop_button").onclick = function(){
	var t3 = context.currentTime;
	var vol_t4 = vol_release;
	vol.gain.setTargetAtTime(0, t3, vol_t4);
  var fil_t4 = fil_release;
	filter.frequency.setTargetAtTime(master_filter, t3, fil_t4);

	if(vol.gain.value < 1e-3){
		oscillator1.stop(0);
		oscillator2.stop(0);
		oscillator3.stop(0);
	}
}

}

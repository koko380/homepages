let data_image_file = new Array();
let input_train_data = new Array(); //学習用の入力データ
let label_train_data = new Array(); //学習用の教師データ
let input_validation_data = new Array(); //テスト用の入力データ
let label_validation_data = new Array(); //テスト用の教師データ
let input_train_data_temporary = new Array();
let label_train_data_temporary = new Array();
let input_validation_data_temporary = new Array();
let label_validation_data_temporary = new Array();
let input_train_tensor, label_train_tensor, input_validation_tensor, label_validation_tensor;
let input_train_tensor_temporary, label_train_tensor_temporary, input_validation_tensor_temporary, label_validation_tensor_temporary;
let evaluate_data = new Array();
let train_count = 1;
let dsp;
let last_dsp;

//let image_expansion_rate = 1;
//let image_expansion_rate_evaluate = 4;
let image_width = 28;
let image_height = 28;

//htmlからid取得
let model_json_upload = document.getElementById("model_json_upload").files[0];
let model_weights_upload = document.getElementById("model_weights_upload").files[0];
let model_load = document.getElementById("model_load");
let make_model = document.getElementById("make_model");
let csv_file = document.getElementById("csv_file");
let change_tensor = document.getElementById("change_tensor");
let file_load_status = document.getElementById("file_load_status");
let middle_layer1_number = document.getElementById("middle_layer1_number");
let middle_layer1_activation = document.getElementById("middle_layer1_activation");
let middle_layer2_number = document.getElementById("middle_layer2_number");
let middle_layer2_activation = document.getElementById("middle_layer2_activation");
let output_layer_activation = document.getElementById("output_layer_activation");
let batch_size = document.getElementById("batch_size");
let learning_rate = document.getElementById("learning_rate");
let optimizer_algorithm = document.getElementById("optimizer_algorithm");
let loss_function = document.getElementById("loss_function");
let epoch_number = document.getElementById("epoch_number");
let learn_start = document.getElementById("learn_start");
let learn_status = document.getElementById("learn_status");
let estimate = document.getElementById("estimate");
//let estimate_result = document.getElementById("estimate_result");
let model_save = document.getElementById("model_save");
let learn_initialize = document.getElementById("learn_initialize");

middle_layer1_activation.addEventListener("change", function(){
	middle_layer1_activation.value = middle_layer1_activation.value;
});
middle_layer2_activation.addEventListener("change", function(){
  middle_layer2_activation.value = middle_layer2_activation.value;
});
output_layer_activation.addEventListener("change", function(){
	output_layer_activation.value = output_layer_activation.value;
});
batch_size.addEventListener("change", function(){
  batch_size.value = batch_size.value
});
learning_rate.addEventListener("change", function(){
	learning_rate.value = learning_rate.value
});
optimizer_algorithm.addEventListener("change", function(){
	switch(optimizer_algorithm){
		case "sgd":
			optimizer_algorithm.value = tf.train.sgd(learning_rate.value);
			break;
		case "momentum":
			optimizer_algorithm.value = tf.train.momentum(learning_rate.value, 1.0);
			break;
		case "adagrad":
			optimizer_algorithm.value = tf.train.adagrad(learning_rate.value);
			break;
		case "adadelta":
			optimizer_algorithm.value = tf.train.adadelta(learning_rate.value);
			break;
		case "adam":
			optimizer_algorithm.value = tf.train.adam(learning_rate.value);
			break;
		case "adamax":
			optimizer_algorithm.value = tf.train.adamax(learning_rate.value);
			break;
		case "rmsprop":
			optimizer_algorithm.value = tf.train.rmsprop(learning_rate.value);
			break;
	}
});
loss_function.addEventListener("change", function(){
	loss_function.value = loss_function.value
});
epoch_number.addEventListener("change", function(){
	epoch_number.value = epoch_number.value
});

//学習モデルの作成
let model;
model = tf.sequential();


//学習済みデータの読み込み
async function learn_load(){
  model = await tf.loadLayersModel(tf.io.browserFiles([model_json_upload, model_weights_upload]));
}
model_load.addEventListener("click", function(){
  learn_load();
});



make_model.addEventListener("click", function(){
	model.add(tf.layers.conv2d({
		inputShape: [image_width, image_height, 4],
		kernelSize: 5,
		filters: 8,
		strides: 1,
		activation: middle_layer1_activation.value,
		kernelInitizalizer: "varianceScaling"
	}));
	model.add(tf.layers.maxPooling2d({
		poolSize: [2, 2],
	  strides: [2, 2]
	}));
	model.add(tf.layers.conv2d({
  	kernelSize: 5,
	  filters: 16,
  	activation: middle_layer2_activation.value,
	  kernelInitizalizer: "varianceScaling"
	}));
	model.add(tf.layers.maxPooling2d({
  	poolSize: [3, 3],
	  strides: [3, 3]
	}));
	model.add(tf.layers.flatten());
	model.add(tf.layers.dense({
		units: 10,
	  activation: output_layer_activation.value,
  	kernelInitizalizer: "varianceScaling"
	}));
});



function image_load(event){
	return new Promise(async function(resolve,reject){
		for(let i=0; i<event.target.files.length; i++){
			if((Number.isInteger(i / event.target.files.length * 100))){
				file_load_status.innerHTML = "";
	      file_load_status.insertAdjacentHTML("beforeend", "ファイル読み込み中<br>");
				file_load_status.insertAdjacentHTML("beforeend", "ファイル読み込み率:"+i/event.target.files.length*100+"%");
			}
			await new Promise(function(resolve,reject){
	      setTimeout((function(){
	        resolve()
	      }), 0.001);
  	  });
			let files = event.target.files[i];
	    let file_reader = new FileReader();
			let files_length = event.target.files.length-1;
	  	file_reader.onload = function (event){
		    let data_url = event.target.result;
  		  let image = new Image();
    		image.onload = function (event){
	      	let data = (function (event){
	  	      let image_file = document.createElement("canvas");
	    	    image_file.width = event.target.naturalWidth;
		        image_file.height = event.target.naturalHeight;
  		      let context = image_file.getContext("2d");
    		    context.drawImage(event.target, 0, 0);
      		  let image_data = context.getImageData(0, 0, image_file.width, image_file.height);
						image_width = image_file.width;
						image_height = image_file.height;
	        	//data_image_file[i] = [image_data.data]; //多分いらない
						for(z=0; z<=3; z++){
							for(let y=0; y<image_height; y++){
								for(let x=0; x<image_width; x++){
									if(x==0 && y==0 && z==0){
										data_image_file[i] = [[context.getImageData(x, y, 1, 1).data[z]]];
									} else {
										data_image_file[i][0].push(context.getImageData(x, y, 1, 1).data[z]);
									}
								}
							}
						}
	  	      data_image_file[i].push(parseInt(files.name.substr(-5,1)));
    	  	  return image_data;
		      }(event));
  		    //document.getElementById("train_image").getContext("2d").putImageData(data, 0, 0);
					for(let j=0; j<data_image_file[i][0].length; j++){
            data_image_file[i][0][j] /= 255;
          }
					if(i == files_length){
		        resolve();
		      }
	  	  }
	  	  image.src = data_url;
		  }
	  	file_reader.readAsDataURL(files);
		}
	});
}



function prepare_data(){
  data_image = array_shuffle(data_image_file);
  input_train_data_temporary = [];
  label_train_data_temporary = [];
  for(let i=0; i<Math.round(data_image_file.length*0.8); i++){
		for(let j=0; j<data_image_file[i][0].length; j++){
			input_train_data.push(data_image_file[i][0][j]);
		}
		for(let j=0; j<10; j++){
      if(j == 0){
				if(j == data_image_file[i][1]){
      	  label_train_data[i] = [1];
				} else {
					label_train_data[i] = [0];
				}
      } else {
				if(j == data_image_file[i][1]){
        	label_train_data[i].push(1);
				} else {
					label_train_data[i].push(0);
				}
      }
    }
  }
  input_train_data_temporary = input_train_data;
  label_train_data_temporary = label_train_data;

  input_validation_data_temporary = [];
  label_validation_data_temporary = [];
  for(let i=Math.round(data_image_file.length*0.8); i<data_image_file.length; i++){
    for(let j=0; j<data_image_file[i][0].length; j++){
      input_validation_data.push(data_image_file[i][0][j]);
    }
    for(let j=0; j<10; j++){
      if(j == 0){
        if(j == data_image_file[i][1]){
          label_validation_data[i-Math.round(data_image_file.length*0.8)] = [1];
        } else {
          label_validation_data[i-Math.round(data_image_file.length*0.8)] = [0];
        }
      } else {
        if(j == data_image_file[i][1]){
          label_validation_data[i-Math.round(data_image_file.length*0.8)].push(1);
        } else {
          label_validation_data[i-Math.round(data_image_file.length*0.8)].push(0);
        }
      }
    }
  }
  input_validation_data_temporary = input_validation_data;
  label_validation_data_temporary = label_validation_data;

  //配列の中身は、[入力データ数, 入力データの属性数]
  input_train_tensor = tf.tensor4d(input_train_data, [(input_train_data.length/image_width/image_height/4), image_width, image_height, 4], "float32");
  label_train_tensor = tf.tensor2d(label_train_data, [label_train_data.length, 10], "int32");
  input_validation_tensor = tf.tensor4d(input_validation_data, [(input_validation_data.length/image_width/image_height/4), image_width, image_height, 4], "float32");
  label_validation_tensor = tf.tensor2d(label_validation_data, [label_validation_data.length, 10], "int32");

  //学習データの表示用
  input_train_tensor_temporary = input_train_tensor;
  label_train_tensor_temporary = label_train_tensor;
  input_validation_tensor_temporary = input_validation_tensor;
  label_validation_tensor_temporary = label_validation_tensor;

  file_load_status.insertAdjacentHTML("beforeend", "データ作成終了");

  //読み込んだファイルの表示
  //console.log("学習用データ:\n"+input_train_tensor_temporary+"\n\n分類用データ:\n"+label_train_tensor_temporary);
  //console.log("検証用データ:\n"+input_validation_tensor_temporary+"\n\n分類用データ:\n"+label_validation_tensor_temporary);
}



//配列の要素をランダムにする(フィッシャー-イェーツのシャッフル)
function array_shuffle(array){
	for(let i=array.length-1; i>=0; i--){
		let j = Math.floor(Math.random()*(i+1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}



csv_file.addEventListener("change", async function(event){
  file_load_status.innerHTML = "";
  file_load_status.insertAdjacentHTML("beforeend", "ファイル読み込み中");

	await image_load(event);

  file_load_status.innerHTML = "";
  file_load_status.insertAdjacentHTML("beforeend", "ファイル読み込み完了<br>");
});



change_tensor.addEventListener("click", function(event){
	prepare_data();
});



//学習
async function learn(){
	dsp = "学習回数: Loss(学習) / Accuracy(学習) / Loss(検証) / Accuracy(検証)<br>";

	//学習過程の設定
	model.compile({
		loss: loss_function.value,
		optimizer: optimizer_algorithm.value,
		metrics: ["accuracy"] //accuracyだと適切な評価関数が選ばれる
	});

	learn_status.innerHTML = "";
	learn_status.insertAdjacentHTML("beforeend", "-----学習中-----");

	//学習と学習過程をdspに格納
	const history = await model.fit(input_train_tensor, label_train_tensor, {
		batchSize: parseInt(batch_size.value),
		epochs: epoch_number.value,
		validationData: [input_validation_tensor, label_validation_tensor],
		shuffle: true,
		callbacks: {
			onEpochEnd: async function(epoch, logs){
				if(((epoch+1)%10) == 0){
					dsp = dsp+("      "+(train_count+epoch)).slice(-7)+" : "+(logs.loss+"000000000000").slice(0,12)+" / "+(logs.acc+"000000000000").slice(0,12)+" / "+(logs.val_loss+"000000000000").slice(0,12)+" / "+(logs.val_acc+"000000000000").slice(0,12)+"<br>";
					last_dsp = ("      "+(train_count+epoch)).slice(-7)+" : "+(logs.loss+"000000000000").slice(0,12)+" / "+(logs.acc+"000000000000").slice(0,12)+" / "+(logs.val_loss+"000000000000").slice(0,12)+" / "+(logs.val_acc+"000000000000").slice(0,12)+"<br>";
					learn_status.innerHTML = "";
					learn_status.insertAdjacentHTML("beforeend", dsp);
				}
			}
		}
	});

	train_count = train_count*1.0+epoch_number.value*1.0; //現在の学習回数を保存

	learn_status.innerHTML = "";
	learn_status.insertAdjacentHTML("beforeend", last_dsp);
	learn_status.insertAdjacentHTML("beforeend", "-----学習終了-----");
};
learn_start.addEventListener("click", function(){
  learn();
});



//指定したデータの評価
async function evaluate(event){
//評価データの読み込み
	await new Promise(async function(resolve,reject){
    for(let i=0; i<event.target.files.length; i++){
      if((Number.isInteger(i / event.target.files.length * 100))){
        file_load_status.innerHTML = "";
        file_load_status.insertAdjacentHTML("beforeend", "ファイル読み込み中<br>");
        file_load_status.insertAdjacentHTML("beforeend", "ファイル読み込み率:"+i/event.target.files.length*100+"%");
      }
      await new Promise(function(resolve,reject){
        setTimeout((function(){
          resolve()
        }), 0.001);
      });
      let files = event.target.files[i];
      let file_reader = new FileReader();
      let files_length = event.target.files.length-1;
      file_reader.onload = function (event){
        let data_url = event.target.result;
        let image = new Image();
        image.onload = function (event){
          let data = (function (event){
            let image_file = document.createElement("canvas");
            image_file.width = event.target.naturalWidth;
            image_file.height = event.target.naturalHeight;
            let context = image_file.getContext("2d");
            context.drawImage(event.target, 0, 0);
            let image_data = context.getImageData(0, 0, image_file.width, image_file.height);
            image_width = image_file.width;
            image_height = image_file.height;
            //data_image_file[i] = [image_data.data]; //多分いらない
            for(z=0; z<=3; z++){
              for(let y=0; y<image_height; y++){
                for(let x=0; x<image_width; x++){
                  if(x==0 && y==0 && z==0){
                    data_image_file[i] = [[context.getImageData(x, y, 1, 1).data[z]]];
                  } else {
                    data_image_file[i][0].push(context.getImageData(x, y, 1, 1).data[z]);
                  }
                }
              }
            }
            data_image_file[i].push(parseInt(files.name.substr(-5,1)));
            return image_data;
          }(event));
          //document.getElementById("train_image").getContext("2d").putImageData(data, 0, 0);
          for(let j=0; j<data_image_file[i][0].length; j++){
            data_image_file[i][0][j] /= 255;
          }
          if(i == files_length){
            resolve();
          }
        }
        image.src = data_url;
      }
      file_reader.readAsDataURL(files);
    }
  });

  for(let j=0; j<data_image_file[0][0].length; j++){
    evaluate_data.push(data_image_file[0][0][j]);
  }

  //評価用のデータの変換
  const input_data = tf.tensor4d(evaluate_data, [(evaluate_data.length/image_width/image_height/4), image_width, image_height, 4], "float32");

	//評価の実行
	const output_data = model.predict(input_data);
	let results = output_data.dataSync();

	estimate_result.innerHTML = "";
	estimate_result.insertAdjacentHTML("beforeend", "result(0):"+Math.floor(results[0]*100000)/1000+"%<br>")
	estimate_result.insertAdjacentHTML("beforeend", "result(1):"+Math.floor(results[1]*100000)/1000+"%<br>");
	estimate_result.insertAdjacentHTML("beforeend", "result(2):"+Math.floor(results[2]*100000)/1000+"%<br>");
	estimate_result.insertAdjacentHTML("beforeend", "result(3):"+Math.floor(results[3]*100000)/1000+"%<br>");
	estimate_result.insertAdjacentHTML("beforeend", "result(4):"+Math.floor(results[4]*100000)/1000+"%<br>");
	estimate_result.insertAdjacentHTML("beforeend", "result(5):"+Math.floor(results[5]*100000)/1000+"%<br>");
	estimate_result.insertAdjacentHTML("beforeend", "result(6):"+Math.floor(results[6]*100000)/1000+"%<br>");
	estimate_result.insertAdjacentHTML("beforeend", "result(7):"+Math.floor(results[7]*100000)/1000+"%<br>");
	estimate_result.insertAdjacentHTML("beforeend", "result(8):"+Math.floor(results[8]*100000)/1000+"%<br>");
	estimate_result.insertAdjacentHTML("beforeend", "result(9):"+Math.floor(results[9]*100000)/1000+"%<br>");
;

};
estimate_image_file.addEventListener("change", function(event){
  evaluate(event);
});



//学習済みデータの保存
async function learn_save(){
	await model.save("downloads://test");
}
model_save.addEventListener("click", function(){
	learn_save();
});



//再ロード(全リセット)
function initialize(){
	window.location.reload(true);
}
learn_initialize.addEventListener("click", function(){
  initialize();
});

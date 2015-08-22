module.exports = function(mongoose,Db){

	var NoteSchema = new mongoose.Schema({
		ToUserName:		{ type: String },
		FromUserName:	{ type: String },
		Content:		{ type: String },
		CreateTime:		{ type: Date }, 
	 	NoteId:			{ type: Number },
	 	Coordinate: 	{ type: [Number], index: '2d' }, // 建立2d索引
	 	Label: 			{ type: String }
	});

	NoteSchema.index( { CreateTime: 1 }, {expireAfterSeconds: 604800 });

	var Note = Db.model('Note',NoteSchema);

	/*
		{
			"name": "saveNote",
			"param": {
				"ToUserName": "开发者微信号",
				"FromUserName": "发送方帐号（一个OpenID）",
				"Content": "文本消息内容",
				"CreateTime": "创建时间",
				"NoteId": "NoteId",
				"Location_X": "地理位置维度"
				"Location_Y": "地理位置经度",
				"Label": "地理位置信息"
			},
			"callback": {
				"isSucc": "记录存储结果"
			}
		}
	*/
	var saveNote = function(ToUserName, FromUserName, Content,NoteId,Location_X,Location_Y,Label,callback){

		console.log('Try to saveNote: ' + 'Content--> ' + Content + ' Label--> ' + Label);
		
		var n = new Note({
			ToUserName: 	ToUserName,
			FromUserName: 	FromUserName,
			Content: 		Content,
			CreateTime: 	new Date(),
			NoteId: 		NoteId,
			Coordinate: 	[Location_X,Location_Y],
			Label: 			Label
		});
		
		n.save(function(err){
			if(err){
				console.log('fail to save Note.');
				return callback(false);
			}else{
				console.log('Note has been saved.');
				return callback(true);
			}
				  
		});
		
		console.log('saveNote comment was send');
	};


	/*
		{
			"name": "findByCoordinate",
			"param": {
				"Location_X": "地理位置维度",
				"Location_Y": "地理位置经度"
			},
			"callback": {
				"docs": "查找到的记录"
			}
		}
	*/
	var findByCoordinate = function(Location_X,Location_Y, callback){
		Note.find({ Coordinate: [Location_X,Location_Y] }, function(err, docs){
			console.log('------------Got Location--------------');
		//	console.log(docs);
			callback(docs);
		});
	};

	/*
		{
			"name": "deleteNote",
			"param": {
				"_id": "Message primary key"
			},
			"callback": {
				"isSucc": "是否删除成功"
			}
		}
	*/
	var deleteNote = function(_id,callback){
		Note.remove({ _id: _id }, function(err){
		//	console.log('delete Note: ' + _id);
			callback(true);
		})
	}

	/*
		{
			"name": "deleteAllDoc",
			"param": {
				// null
			},
			"callback": {
				"isSucc": "是否删除成功"
			}
		}
	*/

	var deleteAllDoc = function(callback){
		Note.remove({},function(err){
			if (!err) {
				callback(true);
			}else{
				throw err;
			}
		});
	}

	/*
		{
			"name": "findAll",
			"param": {
				// null
			},
			"callback": {
				"docs": "查找到的记录"
			}
		}
	*/

	var findAll = function(callback){
		Note.find({},function(err,docs){
			console.log('findAll function!');
			callback(docs);
		});
	}

	/*
		{
			"name": "findNear",
			"param": {
				"coor": "所要查找的坐标点",
				"r": "查找半径"
			},
			"callback": {
				"result": "查找到的记录"
			}
		}
	*/

	var findNear = function(coor,r,callback){
		Note.where('Coordinate').within().circle({ center: coor,radius: r,unique: true}).exec(function(err,result){
			console.log('in Note.js findNear.Note.where....');
			callback(result);
		});
	}

	return {
		saveNote: 			saveNote,
		deleteNote: 		deleteNote,
		findByCoordinate: 	findByCoordinate,
		deleteAllDoc: 		deleteAllDoc,
		findAll: 			findAll,
		findNear: 			findNear,
		Note: 				Note
	}
}
module.exports = function(app, models,config){

	//here is the logic of my personal wechat subscriptions,show it for shere.

	var wechat = require('wechat');

	app.post('/wechat',wechat(config,function(req,res,next){

	  var message = req.weixin;

	  if (message.MsgType === 'text') {

	  	if (req.wxsession.loc == undefined || req.wxsession.lab  == undefined) {
	  		res.reply({
	  			content: '请先发送地理位置再埋银子',
	  			type: 'text'
	  		});
	  	}else{
			models.Note.saveNote(message.ToUserName,message.FromUserName,message.Content,message.MsgId,req.wxsession.loc[0],req.wxsession.loc[1],req.wxsession.lab,function(isSucc){
				if (isSucc) {
					console.log('<>Success to saveNote in MongoDb<>');
					res.reply({
						content: '埋银成功！(保存七天)\n&发送位置查看这里留下了什么',
						type: 'text'
					});
				}else{
					console.log('<>Fail to saveNote in MongoDb<>');
					res.reply({
						content: '埋银失败!!\n请换只圣洁的手重试',
						type: 'text'
					});
				}
			});
	  	}

	  }else if (message.MsgType === 'location') {

	  	req.wxsession.loc = [message.Location_X,message.Location_Y];
	  	req.wxsession.lab = message.Label;
	  	req.wxsession.save();

	  	models.Note.findNear([message.Location_X,message.Location_Y],0.035,function(notes){
	  		console.log('---notes.length--->' + notes.length);

	  		if (notes.length != 0) {

	  			var records = '挖到的银子$\n~~~~~~~~~~~~~~~~\n\n';
	  			for(var i = 0; i < notes.length; i++){
	  				records = records + '#' + notes[i].Content + '#\n\n';
	  			}
	  			console.log('records##' + records);
	  			res.reply({
	  				content: records + '~~~~~~~~~~~~~~~~\n&回复消息埋银子!',
	  				type: 'text'
	  			});
	  		}else{
	  			res.reply({
	  				content: '已获取位置，此地无银!\n&回复消息埋银子!',
	  				type: 'text'
	  			})
	  		}

	  	});

	  }else if (message.MsgType === 'voice') {

	    res.reply({
	      content: 'Hola~\nwe need text only~',
	      type: 'text'
	    });

	  }else {
	    res.reply({
	      content: '欢迎新朋友~在这里记录、发现这个世界吧！\n\n&发送地理位置以查看或添加纪录',
	      type: 'text',
	    });
	  }

	next();
	}));
}
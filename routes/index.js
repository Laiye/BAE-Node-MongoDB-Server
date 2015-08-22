/*
	{
		"action": "/",
		"param": {
			//
		},
		"return": {
			//
		}
	}
*/
module.exports = function(app, models,config){

	app.get('/', function(req, res,next){
		res.json({
			status: 12,
			token: 'BAE-Node-MongoDB-Server_token',
			location: 'guangzhou'
		});
		next();
	});

	app.post('/test',function(req,res,next){

		res.json({
			status: 1,
			token: 'BAE-Node-MongoDB-Server_token_test'
		});
		next();
	});

};
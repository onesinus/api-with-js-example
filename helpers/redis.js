const redis = require("redis");
const client = redis.createClient();

const onError = () => {
	client.on('error', (error) => {
		console.error(error);
	});
}

const getValue = (key, cb) => {
	client.get(key, (err, res) => {
		console.log(">>>>>><<<<<<")
		console.log(err)
		console.log(res)
		if (err) cb(err, null);
		return cb(null, res);
	});
}

const setValue = (key, value) => {
	client.set(key, value);
}

module.exports = {
	getValue,
	setValue
}
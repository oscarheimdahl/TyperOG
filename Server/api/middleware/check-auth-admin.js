const jwt = require('jsonwebtoken');

//verifys the token with the given
module.exports = (req, res, next) => {
	try {
		const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
		req.userData = decoded;
		if (!req.userData.admin) {
			return res.status(401).json({
				message: 'Administrative access required'
			});
		}
		next();
	} catch (error) {
		return res.status(401).json({
			message: 'Auth failed'
		});
	}
};

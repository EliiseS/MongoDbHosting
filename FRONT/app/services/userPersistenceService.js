myApp.factory("userPersistenceService", ["$cookies", function($cookies) {
		var user = {};

		var cookieObject = {
			setCookieData: function(user) {
				console.log("setCookieData = " + user);
				user = user;
				$cookies.put("userName", user.name);
				$cookies.put("userEmail", user.email);
				$cookies.put("userId", user._id);
			},
			getCookieData: function() {
				user.name  = $cookies.get("userName");
				user.email = $cookies.get("userEmail");
				user._id   = $cookies.get("userId");
				return user;
			},
			clearCookieData: function() {
				user = null;
				$cookies.remove("userName");
				$cookies.remove("userEmail");
				$cookies.remove("userId");
			}
		};

		return cookieObject;
	}
]);
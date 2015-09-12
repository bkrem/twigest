var handlebars = require('express-handlebars');

var config = handlebars.create({
		defaultLayout: 'main',
		helpers: {
			section: function (name, options) {
				if (!this._sections) this._sections = {}; // initialize _sections object
				this._sections[name] = options.fn(this);
				return null;
			},
			sixCardPagination: function (context, options) {
				var cardsPerPage = 6, pageArray = [];
				for (var i = 0; i < cardsPerPage; i++) {
					pageArray.push(options.fn(context[i]));
				}
				console.log(pageArray);
				return pageArray;
			},
			// Comma-separate & abbreviate large integer values from Twitter API for frontend
			numFormat: function (options) {
				var num = options.fn(this).toString();
				switch (num.length) {
					// e.g. 10,000
					case 5:
						return num.slice(0,2) + "," + num.slice(2,3) + "K";
					// e.g. 100,000
					case 6:
						return num.slice(0,3) + "K";
					// e.g. 1,000,000
					case 7:
						return num.slice(0,1) + "." + num.slice(1,2) + "M";
					// e.g. 10,000,000
					case 8:
						return num.slice(0,2) + "." + num.slice(2,3) + "M";
					// e.g. 100,000,000; insanely high & so far unreached, but for good measure ¯\_(ツ)_/¯
					case 9:
						return num.slice(0,3) + "." + num.slice(3,4) + "M";
					// RegEx for comma-separation
					default:
						return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
			}
		}
	});

	module.exports = config;

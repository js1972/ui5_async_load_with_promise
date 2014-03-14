/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Task configuration.
		jshint: {
			options: {
				"jshintrc": true
			},

			gruntfile: {
				src: "Gruntfile.js"
			},
			application: {
				src: ["model/**/*.js", "util/**/*.js", "view/**/*.js", "*.js", "!spin.min.js"]
			}
		},


		qunit: {
			all: {
				src: ["test/**/*.html"]
			}
		},


		watch: {
			gruntfile: {
				files: "<%= jshint.gruntfile.src %>",
				tasks: ["jshint:gruntfile"]
			},
			qunit: {
				files: ["<%= jshint.application.src %>", "<%= qunit.all.src %>"],
				tasks: ["qunit"]
			},
			application: {
				files: "<%= jshint.application.src %>",
				tasks: ["jshint:application"]
			}
		},


		open: {
			root: {
				path: "http://<%= connect.options.hostname %>:<%= connect.options.port %>",
				options: {
					delay: 500
				}
			}
		},


		connect: {
			options: {
				port: 8080,
				hostname: "localhost",
				base: [".", "../sapui5/latest/"],
				middleware: function(connect, options) {
					var middleware = [];

					/*
					// add a middleware to specify network latency in ms
					middleware.push(function(req, res, next) {
						//next();
						setTimeout(next, 150);
					});
					*/
					
					middleware.push(connect.compress());

					// original middleware behavior
					var base = options.base;
					if (!Array.isArray(base)) {
						base = [base];
					}
					base.forEach(function(path) {
						middleware.push(connect.static(path));
					});

					return middleware;
				}
			},
			server: {}

			/*
			//=====================================================================
			//RESOURCE PROXY - un-comment the proxies setting below to configure
			//a proxy. context, host and changeOrigin are necessary. port defaults
			//to 80 anyway and rewrite allows you to re-write the url's sent to
			//the target host if you require this.
			//Also un-comment the connect middleware option under the
			//connect:livereload target - this starts the proxy which looks up
			//the proxies setting to determine which services to act on.
			//When not using grunt-connect-proxy you still must have the
			//livereload target for connect.
			//
			proxies: {
				context: "/Northwind",  // When the url contains this...
				host: "services.odata.org", // Proxy to this host
				changeOrigin: true
				//port: 80 //,
				//rewrite: {
				//	"^/odata": ""
				//"^/changingcontext": "/anothercontext"
				//}
			},
			//=====================================================================
			*/

			// Requires the Livereload browser extension or a middleware to inject the livereload script
			//livereload: {
				/*
				options: {
					middleware: function(connect, options) {
						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}

						// Setup the proxy
						var middlewares = [require("grunt-connect-proxy/lib/utils").proxyRequest];

						// Serve static files.
						options.base.forEach(function(base) {
							middlewares.push(connect.static(base));
						});

						return middlewares;
					}
				}
				*/
			//}
		}
	});


	// These plugins provide necessary tasks
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-open");
	grunt.loadNpmTasks("grunt-contrib-connect");
	//grunt.loadNpmTasks("grunt-connect-proxy");


	grunt.registerTask("default", ["jshint", "qunit:all", "watch"]);
	grunt.registerTask("serve", function() {
		grunt.task.run([
			//"configureProxies",
			"connect:server",
			//"connect:livereload",
			"open",
			"watch"
		]);
	});
};
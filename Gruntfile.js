module.exports = function(grunt) {
    "use strict";
    
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            options: {
                jshintrc: true
            },
            src:  [ "lib/**/*.js", "index.js" ]
        },
        jscs: {
            options: {
                config: ".jscsrc"
            },
            src: [ "lib/**/*.js", "index.js"]
        },
        exec: {
            buildPublicDocs: "jsdoc2md -t readme.hbs lib/**/*.js index.js > README.md",
            buildDeveloperDocs: "jsdoc2md -t readme.hbs --private lib/**/*.js index.js > DEVELOPER_README.md"
        },
        mocha_istanbul: {
            coverage: {
                src: ["test/**/*.js"]
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-mocha-istanbul");

    grunt.registerTask("test", ["jshint", "jscs", "mocha_istanbul"]);
    grunt.registerTask("docs", ["exec:buildPublicDocs", "exec:buildDeveloperDocs"]);
};

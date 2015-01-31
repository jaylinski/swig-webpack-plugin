var fs       = require('fs');
var path     = require('path');
var beautify = require('js-beautify').html;
var uglify   = require('html-minifier');
var swig     = require('swig');
var swigOptions = {cache: false};

function SwigWebpackPlugin(options) {
	this.options = options || {};
}

SwigWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('emit', function(compiler, callback) {
    var webpackStatsJson = compiler.getStats().toJson();
    var templateParams = {};
    templateParams.webpack = webpackStatsJson;
    templateParams.swigWebpackPlugin = {};
    templateParams.swigWebpackPlugin.assets = self.swigWebpackPluginAssets(compiler, webpackStatsJson);
    templateParams.swigWebpackPlugin.options = self.options;

    var outputFilename = self.options.filename || 'index.html';

    if (self.options.templateContent && self.options.template) {
      compiler.errors.push(new Error('SwigWebpackPlugin: cannot specify both template and templateContent options.'));
      callback();
    } else if (self.options.templateContent) {
      self.emitHtml(compiler, null, self.options.templateContent, templateParams, outputFilename);
      callback();
    } else {
      var templateFile = path.join(this.context, self.options.template);
      if (!templateFile) {
        templateFile = path.join(__dirname, 'template/index.html');
      }
      compiler.fileDependencies.push(templateFile);

      fs.readFile(templateFile, 'utf8', function(err, htmlTemplateContent) {
        if (err) {
          compiler.errors.push(new Error('SwigWebpackPlugin: Unable to read HTML template "' + templateFile + '"'));
        } else {
          self.emitHtml(compiler, templateFile, null, templateParams, outputFilename);
        }
        callback();
      });
    }
  });
};

SwigWebpackPlugin.prototype.emitHtml = function(compiler, htmlTemplateFile, htmlTemplateContent, templateParams, outputFilename) {
  var template;
  swig.setDefaults(swigOptions);
  if(htmlTemplateFile) {
  	template = swig.compileFile(htmlTemplateFile);
  } else if(htmlTemplateContent) {
  	template = swig.compile(htmlTemplateContent);
  } else {
  	compiler.errors.push(new Error('SwigWebpackPlugin: cannot find a templateFile or templateContent.'));
  }
  var html = template(templateParams);
  html = this.htmlFormatter(templateParams.swigWebpackPlugin.options, html);
  compiler.assets[outputFilename] = {
    source: function() {
      return html;
    },
    size: function() {
      return html.length;
    }
  };
};

SwigWebpackPlugin.prototype.htmlFormatter = function(options, html) {
  if(options.beautify) {
  	console.log('SwigWebpackPlugin: beautifying html');
  	return beautify(html, {indentSize: 2});
  } else if(options.uglify) {
  	console.log('SwigWebpackPlugin: uglifying html');
  	return uglify.minify(String(html), { collapseWhitespace: true });
  } else {
  	return html;
  }
};

SwigWebpackPlugin.prototype.swigWebpackPluginAssets = function(compiler, webpackStatsJson) {
  var assets = {};
  for (var chunk in webpackStatsJson.assetsByChunkName) {
    var chunkValue = webpackStatsJson.assetsByChunkName[chunk];

    // Webpack outputs an array for each chunk when using sourcemaps
    if (chunkValue instanceof Array) {
      // Is the main bundle always the first element?
      chunkValue = chunkValue[0];
    }

    if (compiler.options.output.publicPath) {
      chunkValue = compiler.options.output.publicPath + chunkValue;
    }
    assets[chunk] = chunkValue;
  }

  return assets;
};

module.exports = SwigWebpackPlugin;

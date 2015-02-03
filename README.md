[swig](https://github.com/paularmstrong/swig)-[webpack](https://github.com/webpack/webpack)-plugin
===================

> **Note:** forked from [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin).

This is a [webpack](http://webpack.github.io/) plugin that simplifies creation of HTML files to serve your
webpack bundles. This is especially useful for webpack bundles that include
a hash in the filename which changes every compilation. You can either let the plugin generate an HTML file for you or supply
your own template (using [swig](https://github.com/paularmstrong/swig)).

Installation
------------
Install the plugin with npm:
```shell
$ npm install swig-webpack-plugin --save-dev
```


Basic Usage
-----------

The plugin will generate an HTML file for you that includes all your webpack
bundles in the body using `script` tags. Just add the plugin to your webpack
config as follows:

```javascript
var SwigWebpackPlugin = require('swig-webpack-plugin')
var webpackConfig = {
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: '[name].js'
  },
  plugins: [new SwigWebpackPlugin()]
}
```

This will generate a file `index.html` from the default template.


If you have multiple webpack entry points, they will all be included with `script`
tags in the generated HTML.


Configuration
-------------
You can pass a hash of configuration options to `HtmlWebpackPlugin`.
Allowed values are as follows:

- `beautify`: Beautify the HTML.
- `uglify`: Uglify the HTML.
- `watch`: add files to webpack's file-dependencies
- `filename`: The file to write the HTML to. Defaults to `index.html`.
   You can specify a subdirectory here too (eg: `src/admin.html`).

Here's an example webpack config illustrating how to use these options:
```javascript
{
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  plugins: [
    new SwigWebpackPlugin({
      filename: 'src/*.html',
      watch: 'src/**/*',
      beautify: true
    })
  ]
}
```

Generating Multiple HTML Files
------------------------------
To generate more than one HTML file, declare the plugin more than
once in your plugins array:
```javascript
{
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  plugins: [
    new SwigWebpackPlugin(), // Generates default index.html
    new SwigWebpackPlugin({  // Also generate a test.html
      filename: 'test.html',
      template: 'src/test.html'
    })
  ]
}
```

Writing Your Own Templates
--------------------------
If the default generated HTML doesn't meet your needs you can supply
your own [swig template](https://github.com/paularmstrong/swig).
The [default template](https://github.com/jaylinski/swig-webpack-plugin/blob/master/template/index.html)
is a good starting point for writing your own.

To use a custom template, configure the plugin like this:
```javascript
{
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: '[name].js'
  },
  plugins: [
    new SwigWebpackPlugin({
      template: 'src/my_template.html'
    })
  ]
}
```

Alternatively, if you already have your template's content in a String, you
can pass it to the plugin using the `templateContent` option:
```javascript
plugins: [
  new SwigWebpackPlugin({
    templateContent: templateContentString
  })
]
```

Note the plugin will throw an error if you specify both `template` _and_
`templateContent`.

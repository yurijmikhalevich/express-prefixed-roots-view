# express-prefixed-roots-view

Alternative View class, provides another lookup method based on mappings prefix: dir.

Now, you can use multiple view dirs with express and use prefixes to access templates in it.

Compatible with express 3.x. Tested with express 3.2.x.

Usage:

```javascript
app.set('view', require('express-prefixed-roots-view'));
app.set('views', {
  '': __dirname + '/views',
  'module/': __dirname + '/module/views',
  'module2/': __dirname + '/module2/views'
});
```

Now, when you call res.render('index'), it only tries to render '/views/index'.
When your call res.render('module/index'), it tries to render '/views/module/index', if such file does not exists, it tries to render '/module/views/index'.
So, you can override templates, provided with modules.
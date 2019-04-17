const Express = require('express');

const app = new Express();

app.post('/login', (req, res) => res.send('Hello World!'));

app.get('/data', (req, res) => {
  res.json({
    code: 1,
    token: 'daffhfhfn-sdawedad-2dfgfgfg',
  });
});

app.post('/token', (req, res) => {
  res.json({
    isToken: true,
  });
});

app.listen(9023, () => console.log('Example app listening on port 9023!'));
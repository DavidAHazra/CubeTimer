const path = require('path');
const app = require(path.join(__dirname, './routes/app.js'));

app.listen(app.get('port'), () => {
    console.log('Listening on port:', app.get('port'));
});
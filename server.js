const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOURI || 'mongodb://127.0.0.1:27017/cluboflife', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("connected"))
    .catch(err => console.log(`Error: ${err.message}`))


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`UP AND RUNNING ON PORT ${PORT}`));

process.on('unhandledRejection', (err) => console.log(`Error: ${err.message}`));
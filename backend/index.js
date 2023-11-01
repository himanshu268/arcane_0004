const express = require('express')
const connecttomongo=require("./db");
connecttomongo();
const bodyParse = require('body-parser')

const app = express()
const port = 5000
app.use(bodyParse.json({limit: '35mb'}));

app.use(
  bodyParse.urlencoded({
    extended: true,
    limit: '35mb',
    parameterLimit: 50000,
  }),
);


//routes
app.use(express.json())
app.use('/api',require('./routes/auth'))
// app.use('/api/note',require('./routes/notes'))
// app.use('/no',require('./routes/nofeed'))
app.use('/api',require('./routes/personalfeed'))
app.use('/api',require('./routes/fetchingfeed'))
app.use('/api',require('./routes/comments'))
app.use('/api',require('./routes/likes'))
app.use('/api',require('./routes/photo'))
app.use('/api',require('./routes/voice'))




// app.get('/', (req, res) => {
//   res.send('Hello !')
// })

app.listen(port, () => {
  console.log(`Example app listening on port at http://localhost:${port}`)
})


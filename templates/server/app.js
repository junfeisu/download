import server from './server'

async function start () {
  try {
    // this is for register plugins
    
    // await server.register({
    //   plugin: '',
    //   options: {}
    // })
    await server.start()
  } catch (err) {
    console.log('start server err is ', err)
    throw err
  }

  console.log('server is start at ' + server.info.uri)
}

process.on('unhandledRejection', err => {
  console.log('unhandle rejection is ', err.message)
  process.exit(1)
})

start()

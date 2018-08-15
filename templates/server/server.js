import Hapi from 'hapi'
import routes from './routes'

export const serverConf = {
  port: process.env.PORT || 8000,
  host: 'localhost',
  routes: {
    cors: true
  }
}
const server = Hapi.server(serverConf)

routes.forEach(route => {
  server.route(route)
})

export default server

import './index.scss'
import AppController from '@controller/AppController'

window.addEventListener('load', () => {
  let appController = new AppController()
  appController.startApp()  
})

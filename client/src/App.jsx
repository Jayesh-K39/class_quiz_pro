import {Route, Routes} from 'react-router-dom'
import Protection from './wrappers/Protect'
import GuestRoute from './wrappers/GuestRoute'
import ModalProvider from './wrappers/ModalProvider'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Teacher from './Teacher'
import ControlRoom from './ControlRoom'
import Session from './Session'
import Join from './Join'
import Student from './Student'
import {Toaster, toast} from 'react-hot-toast'

function App() {
  return (
  	<ModalProvider>
  		<Toaster position='tope-center'/>
  		<Routes>
  			<Route path='/'
  				element={<Home/>}
  			/>
	
  			<Route path='/teacher' 
  				element={<GuestRoute><Teacher/></GuestRoute>}
  			/>
	
  			<Route path='/register' 
  				element={<GuestRoute><Register/></GuestRoute>}
  			/>
	
  			<Route path='/login' 
  				element={<GuestRoute><Login/></GuestRoute>}
  			/>
	
  			<Route path='/controlroom' 
  				element={<Protection><ControlRoom/></Protection>}
  			/>
	
			<Route path='/session'
				element={<Protection><Session/></Protection>}
			/>
			
  			<Route path='/join' element={<Join/>}/>
	
  			<Route path='/student' element={<Student/>}/>
	
  			<Route path='*' 
  				element={<Home/>}
  			/>
  		</Routes>
  	</ModalProvider>
  )
}

export default App

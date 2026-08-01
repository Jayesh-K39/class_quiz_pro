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
  		<Toaster position='top-center' toastOptions={{
  			style: {
  				background: '#1e1b3a',
  				color: '#fff',
  				border: '1px solid rgba(255,255,255,0.1)',
  			},
  			success: { iconTheme: { primary: '#34d399', secondary: '#1e1b3a' } },
  			error: { iconTheme: { primary: '#fb7185', secondary: '#1e1b3a' } },
  		}}/>
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

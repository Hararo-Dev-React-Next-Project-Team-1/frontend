import './App.css';
import Header from './components/Header';
import HomePage from './pages/index.tsx'
function App() {
  return (
    <>
      <Header />
      <div className='mt-20 w-screen'>
          <HomePage/>
      </div>
    </>
  );
}

export default App;

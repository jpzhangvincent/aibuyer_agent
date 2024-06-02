
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Body from './components/Body';
import Head from './components/Head';
import store from './utils/store';
import LandingPage from './components/LandingPage/LandingPage';
import ResultsContainer from './components/ResultsContainer/ResultsContainer';

const appRouter = createBrowserRouter([{
  path: "/",
  element: <Body />,
  children: [
    {
      path: "/",
      element: <LandingPage />
    },
    {
      path: "showResults",
      element: <ResultsContainer />
    }
  ]
}])

function App() {
  return (
    <Provider store={store}>
      <div>
      <Head />
      <RouterProvider router={appRouter} />
      </div>
    </Provider>
  );
}

export default App;

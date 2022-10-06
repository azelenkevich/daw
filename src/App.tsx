import { Provider } from 'react-redux';
import StudioContainer from './components/templates/StudioContainer';
import store from 'store/store';

const App = () => {
  return (
    <Provider store={store}>
      <StudioContainer />
    </Provider>
  );
};

export default App;

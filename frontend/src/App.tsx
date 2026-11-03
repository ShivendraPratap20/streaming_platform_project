
import type React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router/dom';
import router from './routes/routes';
import { store } from './redux/store/store';
import { ModalProvider } from './Provider/ModalProvider';

const queryClient = new QueryClient();

function App(): React.JSX.Element {  

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
export {
  queryClient,
}
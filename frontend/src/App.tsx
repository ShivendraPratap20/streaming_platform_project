
import type React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router/dom';
import router from './routes/routes';
import { store } from './redux/store/store';
import { ModalProvider } from './Provider/ModalProvider';

function App(): React.JSX.Element {

  const queryClient = new QueryClient();

  return (
    <ModalProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Provider>
    </ModalProvider>
  )
}

export default App

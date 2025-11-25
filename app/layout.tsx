import './globals.css';
import { Toaster } from 'react-hot-toast';
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-poppins antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#000000',
              color: '#fff',
            },
            duration: 1200,
          }}
        />
      </body>
    </html>
  );
};
export default RootLayout;

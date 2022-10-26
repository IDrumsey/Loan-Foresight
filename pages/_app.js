import '../styles/globals.css'
import { MantineProvider } from '@mantine/core'

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* https://mantine.dev/guides/next/ */}
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark'
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  )
}

export default MyApp

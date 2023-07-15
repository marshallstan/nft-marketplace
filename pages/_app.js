import '../styles/globals.css'
import { Footer, NavBar } from '@/components/componentsindex'

const MyApp = ({ Component, pageProps }) => (
  <div>
    <NavBar />
    <Component {...pageProps} />
    <Footer />
  </div>
)

export default MyApp

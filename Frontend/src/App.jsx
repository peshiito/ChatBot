import { TiendaProvider } from './context/TiendaContext';
import { BandaDemo, Encabezado, Pie } from './components/layout/Encabezado';
import { Hero } from './components/layout/Hero';
import { Catalogo } from './components/catalogo/Catalogo';
import { DetalleProducto } from './components/catalogo/DetalleProducto';
import { ChatWidget } from './components/chat/ChatWidget';
import { Legales } from './components/legal/Legales';

export function App() {
  return (
    <TiendaProvider>
      <a className="saltar" href="#catalogo">
        Saltar al catálogo
      </a>
      <BandaDemo />
      <Encabezado />
      <main id="contenido">
        <Hero />
        <Catalogo />
      </main>
      <Pie />
      <DetalleProducto />
      <Legales />
      <ChatWidget />
    </TiendaProvider>
  );
}

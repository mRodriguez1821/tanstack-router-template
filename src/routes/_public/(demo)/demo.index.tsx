import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/(demo)/demo/")({
  component: DemoIndexPage,
});

function DemoIndexPage() {
  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>Demos del Template</h2>
      <p>Selecciona un demo para probar las funcionalidades:</p>
      <ul>
        <li>
          <Link to="/demo/toasts">Demo: Sistema de Toasts</Link>
        </li>
        <li>
          <Link to="/demo/storage">Demo: Encrypted Storage (AES-GCM)</Link>
        </li>
        <li>
          <Link to="/demo/themes">Demo: Creador y Configurador de Temas</Link>
        </li>
        <li>
          <Link to="/demo/modal">Demo: Componente Reutilizable Modal</Link>
        </li>
        <li>
          <Link to="/demo/form">Demo: Pantalla Tipo Formulario (FormPage & Borradores)</Link>
        </li>
        <li>
          <Link to="/users">Demo: Rutas Protegidas & TanStack Query (Users)</Link>
        </li>
      </ul>
    </div>
  );
}

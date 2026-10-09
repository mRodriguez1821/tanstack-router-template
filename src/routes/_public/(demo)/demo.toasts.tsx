import { createFileRoute, Link } from "@tanstack/react-router";
import { useToast } from "@/common/hooks/useToast";

export const Route = createFileRoute("/_public/(demo)/demo/toasts")({
  component: DemoToastsPage,
});

function DemoToastsPage() {
  const toast = useToast();

  return (
    <div style={{ padding: "1.5rem" }}>
      <p>
        <Link to="/demo">&larr; Volver a Demos</Link>
      </p>
      <h2>Demo: Sistema de Toasts</h2>
      <p>Prueba los diferentes tipos de notificaciones toast:</p>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <button
          type="button"
          onClick={() => toast.success("Operación completada con éxito.")}
        >
          Toast Success
        </button>
        <button
          type="button"
          onClick={() => toast.info("Esta es una notificación informativa.")}
        >
          Toast Info
        </button>
        <button
          type="button"
          onClick={() => toast.warning("Advertencia: revisa los datos.")}
        >
          Toast Warning
        </button>
        <button
          type="button"
          onClick={() => toast.error("Error al procesar la solicitud.")}
        >
          Toast Error
        </button>
      </div>
    </div>
  );
}

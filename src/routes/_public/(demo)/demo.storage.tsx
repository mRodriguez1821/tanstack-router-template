import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useEncryptedStorage } from "@/common/hooks/useEncryptedStorage";
import { encryptedLocalStorage } from "@/common/lib/storage";

export const Route = createFileRoute("/_public/(demo)/demo/storage")({
  component: DemoStoragePage,
});

function DemoStoragePage() {
  const [note, setNote, clearNote] = useEncryptedStorage(
    "demo_note",
    "Texto inicial",
  );
  const [input, setInput] = useState(note);
  const [rawCiphertext, setRawCiphertext] = useState<string | null>(null);

  const hashedKey = encryptedLocalStorage.hashKey("demo_note");

  const inspectRaw = () => {
    if (typeof window !== "undefined") {
      setRawCiphertext(localStorage.getItem(`app:${hashedKey}`));
    }
  };

  useEffect(() => {
    inspectRaw();
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNote(input);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <p>
        <Link to="/demo">&larr; Volver a Demos</Link>
      </p>
      <h2>Demo: Encrypted Storage</h2>
      <p>
        La clave se hashea con SHA-256 y el valor se cifra con AES-GCM en localStorage.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe algo sensible..."
        />
        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          Guardar cifrado
        </button>
        <button
          type="button"
          onClick={() => {
            clearNote();
            setInput("");
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Limpiar
        </button>
      </form>

      <div style={{ marginTop: "1.5rem" }}>
        <p>
          <strong>Valor descifrado en React:</strong> {note || "(vacío)"}
        </p>
        <p>
          <strong>Clave en localStorage:</strong> <code>app:{hashedKey}</code>
        </p>
        <p>
          <strong>Valor real en localStorage:</strong>{" "}
          <code style={{ wordBreak: "break-all" }}>
            {rawCiphertext || "(no existe en localStorage)"}
          </code>
        </p>
      </div>
    </div>
  );
}

import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthContainer } from "./AuthContainer";
import { Card } from "../Card";
import { Button } from "../Button";
import { Input } from "../Input";

const meta: Meta<typeof AuthContainer> = {
  title: "Layout/AuthContainer",
  component: AuthContainer,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AuthContainer>;

export const Default: Story = {
  render: () => (
    <div className="bg-[var(--background)] min-h-screen">
      <AuthContainer>
        <Card
          className="w-full max-w-sm"
          title="Iniciar Sesión"
          description="Ingresa tus credenciales para acceder a la plataforma"
          footer={
            <Button variant="primary" className="w-full">
              Entrar
            </Button>
          }
        >
          <div className="space-y-3">
            <Input label="Correo electrónico" placeholder="usuario@empresa.com" />
            <Input label="Contraseña" type="password" placeholder="••••••••" />
          </div>
        </Card>
      </AuthContainer>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar, type SidebarProps } from "./Sidebar";

const meta: Meta<SidebarProps> = {
  title: "Layout/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpenOnDesktop: {
      control: "boolean",
      description: "Estado de despliegue en desktop (expandido o modo iconos colapsado)",
    },
    isOpenOnMobile: {
      control: "boolean",
      description: "Estado de visibilidad en dispositivos móviles",
    },
  },
  args: {
    isOpenOnDesktop: true,
    isOpenOnMobile: false,
  },
};

export default meta;
type Story = StoryObj<SidebarProps>;

export const Default: Story = {
  render: (args) => (
    <div className="flex h-screen bg-[var(--background)]">
      <Sidebar {...args} />
      <div className="flex-1 p-8 text-xs opacity-75">
        <h2 className="text-sm font-bold text-[var(--foreground)] mb-2">Contenedor de Contenido</h2>
        <p>Alterna la propiedad <code>isOpenOnDesktop</code> en Controls para observar el menú colapsado o expandido.</p>
      </div>
    </div>
  ),
};

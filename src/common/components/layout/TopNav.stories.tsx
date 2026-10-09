import type { Meta, StoryObj } from "@storybook/react-vite";
import { TopNav, type TopNavProps } from "./TopNav";

const meta: Meta<TopNavProps> = {
  title: "Layout/TopNav",
  component: TopNav,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isDesktopSidebarOpen: {
      control: "boolean",
      description: "Estado del botón toggle del sidebar en el TopNav",
    },
  },
  args: {
    isDesktopSidebarOpen: true,
  },
};

export default meta;
type Story = StoryObj<TopNavProps>;

export const Default: Story = {
  render: (args) => (
    <div className="bg-[var(--background)] min-h-[200px]">
      <TopNav
        {...args}
        onOpenSearchModal={() => alert("Búsqueda global abierta")}
        onToggleMobileSidebar={() => alert("Toggle mobile sidebar")}
        onToggleDesktopSidebar={() => alert("Toggle desktop sidebar")}
      />
    </div>
  ),
};

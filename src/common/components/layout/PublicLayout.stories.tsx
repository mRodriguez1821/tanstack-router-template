import type { Meta, StoryObj } from "@storybook/react-vite";
import { PublicLayout } from "./PublicLayout";
import { AuthContext, type AuthContextValue } from "@/common/context/authContextStore";

const unauthMock: AuthContextValue = {
  isAuthenticated: false,
  currentUser: null,
  login: async () => true,
  logout: () => {},
};

const authMock: AuthContextValue = {
  isAuthenticated: true,
  currentUser: {
    id: "user-1",
    displayName: "Admin Demo",
    email: "admin@empresa.com",
    username: "admin",
    role: "Administrator",
  },
  login: async () => true,
  logout: () => {},
};

const meta: Meta<typeof PublicLayout> = {
  title: "Layout/PublicLayout",
  component: PublicLayout,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PublicLayout>;

export const Unauthenticated: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider value={unauthMock}>
        <Story />
      </AuthContext.Provider>
    ),
  ],
  render: () => (
    <div className="min-h-[400px]">
      <PublicLayout />
    </div>
  ),
};

export const Authenticated: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider value={authMock}>
        <Story />
      </AuthContext.Provider>
    ),
  ],
  render: () => (
    <div className="min-h-[400px]">
      <PublicLayout />
    </div>
  ),
};

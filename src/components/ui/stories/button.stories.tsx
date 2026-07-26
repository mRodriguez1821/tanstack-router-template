import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: <p>Default</p>,
    variant: "default",
    size: "default",
  },
};

export const Destructive: Story = {
  args: {
    children: <p>Default</p>,
    variant: "destructive",
    size: "default",
  },
};

export const Ghost: Story = {
  args: {
    children: <p>Default</p>,
    variant: "ghost",
    size: "default",
  },
};

export const Link: Story = {
  args: {
    children: <p>Default</p>,
    variant: "link",
    size: "default",
  },
};

export const Outline: Story = {
  args: {
    children: <p>Default</p>,
    variant: "outline",
    size: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: <p>Default</p>,
    variant: "secondary",
    size: "default",
  },
};

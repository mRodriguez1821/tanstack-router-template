import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../table";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Pagado",
    totalAmount: "$250.00",
    paymentMethod: "Tarjeta de Crédito",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pendiente",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "No pagado",
    totalAmount: "$350.00",
    paymentMethod: "Transferencia Bancaria",
  },
  {
    invoice: "INV004",
    paymentStatus: "Pagado",
    totalAmount: "$450.00",
    paymentMethod: "Tarjeta de Crédito",
  },
];

export const Default: Story = {
  render: () => (
    <div className="p-6 max-w-2xl">
      <Table>
        <TableCaption>Lista de facturas recientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Factura</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Método</TableHead>
            <TableHead className="text-right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.invoice}>
              <TableCell className="font-medium">{inv.invoice}</TableCell>
              <TableCell>{inv.paymentStatus}</TableCell>
              <TableCell>{inv.paymentMethod}</TableCell>
              <TableCell className="text-right">{inv.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right font-bold">$1,200.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};

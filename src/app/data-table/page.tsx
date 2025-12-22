import { columns } from "./columns";
import type { Data } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Data[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52A",
      amount: 100,
      status: "pending",
      email: "A@example.com",
    },
    {
      id: "728ed52B",
      amount: 200,
      status: "success",
      email: "B@example.com",
    },
    {
      id: "728ed52C",
      amount: 300,
      status: "failed",
      email: "C@example.com",
    },
    {
      id: "728ed52D",
      amount: 400,
      status: "pending",
      email: "D@example.com",
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

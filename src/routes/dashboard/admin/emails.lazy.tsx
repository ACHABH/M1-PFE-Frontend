import type { ColumnDef } from "@tanstack/react-table";
import type { Email } from "../../../types/db";
import { createLazyFileRoute } from "@tanstack/react-router";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useGetAll as useGetAllEmails } from "../../../api/email";
import { useMemo, useState } from "react";
import Table from "../../../components/table";

export const Route = createLazyFileRoute("/dashboard/admin/emails")({
  component: Component,
});

function Component() {
  const { data: emails } = useGetAllEmails();

  const [emailId, setEmailId] = useState<number | null>(null);

  const columns = useMemo<ColumnDef<Email>[]>(() => {
    return [
      {
        accessorKey: "subject",
        header: "Subject",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "content",
        header: "Content",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "id",
        header: "Actions",
        enableSorting: false,
        cell(props) {
          const emailId = props.getValue<number>();
          return (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                setEmailId(emailId);
              }}
            >
              View
            </Button>
          );
        },
      },
    ];
  }, []);

  return (
    <Container as="div" className="mt-4">
      <h1>Emails</h1>
      <Table data={emails} columns={columns} />
    </Container>
  );
}

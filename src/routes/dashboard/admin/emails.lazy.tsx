import type { ColumnDef } from "@tanstack/react-table";
import type { Email } from "../../../types/db";
import { createLazyFileRoute } from "@tanstack/react-router";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { type ElementRef, useMemo, useRef, useState } from "react";
import { useGetAll as useGetAllEmails } from "../../../api/email";
import Table from "../../../components/table";
import EmailModal from "../../../components/admin/email-modal";

export const Route = createLazyFileRoute("/dashboard/admin/emails")({
  component: Component,
});

function Component() {
  const ref = useRef<ElementRef<typeof EmailModal>>(null);

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
                ref.current?.show();
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
      {emailId && <EmailModal ref={ref} emailId={emailId} />}
    </Container>
  );
}

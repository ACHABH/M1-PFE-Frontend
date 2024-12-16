import type { ColumnDef } from "@tanstack/react-table";
import type { EmailTemplate } from "../../../types/db";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type ElementRef, useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Table from "../../../components/table";
import TemplateModal from "../../../components/admin/template-modal";
import {
  useDelete as useDeleteTemplate,
  useGetAll as useGetAllTemplates,
} from "../../../api/email/template";

export const Route = createLazyFileRoute("/dashboard/admin/email-template")({
  component: RouteComponent,
});

function RouteComponent() {
  const ref = useRef<ElementRef<typeof TemplateModal>>(null);

  const { data: templates } = useGetAllTemplates();
  const { mutateAsync: deleteTemplate } = useDeleteTemplate();

  const [templateId, setTemplateId] = useState<number | null>(null);

  const columns = useMemo<ColumnDef<EmailTemplate>[]>(() => {
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
          const templateId = props.getValue<number>();
          return (
            <Container as="div" style={{ display: "flex", gap: 5 }}>
              <Button
                type="button"
                variant="warning"
                size="sm"
                onClick={() => {
                  setTemplateId(templateId);
                  ref.current?.show();
                }}
              >
                Update
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => {
                  const confirmation = window.confirm("Confirm delete action?");
                  if (confirmation) deleteTemplate(templateId);
                }}
              >
                Delete
              </Button>
            </Container>
          );
        },
      },
    ];
  }, [deleteTemplate]);

  return (
    <Container as="div" className="mt-4">
      <h3>Email Template Manager</h3>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => ref.current?.show()}
      >
        Add template
      </Button>
      <Table columns={columns} data={templates} />
      <TemplateModal
        ref={ref}
        templateId={templateId}
        onClose={() => ref.current?.close()}
      />
    </Container>
  );
}

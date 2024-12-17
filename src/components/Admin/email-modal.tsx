import { forwardRef } from "react";
import AddModal, { type Ref } from "../../layout/add-modal";
import { useGetOne as useGetOneEmail } from "../../api/email";

type Props = {
  emailId: number;
};

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef<Ref, Props>(({ emailId }, ref) => {
  const { data: email } = useGetOneEmail(emailId);

  return (
    <AddModal ref={ref} title={email?.subject ?? ""} action={null}>
      <pre>{JSON.stringify(email, null, 2)}</pre>
    </AddModal>
  );
});

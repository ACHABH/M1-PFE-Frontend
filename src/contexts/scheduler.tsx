import type { ChildrenProps } from "../types/props";
import type { StrictOmit } from "../types/util";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useEffectOnce from "react-use/lib/useEffectOnce";
import useUpdateEffect from "react-use/lib/useUpdateEffect";
import { useAuth } from "../api/auth";
import { mail } from "../api/mail";

type SchedulerValue = {
  scheduleEmail: ScheduleEmail;
};

const SchedulerContext = createContext<null | SchedulerValue>(null);

type EmailSchedulerSchema = {
  id: number;
  sendAt: number; // date in milliseconds
  from: string;
  to: string;
  subject: string;
  html: string;
};

const SCHEDULE = "schedule";

type ScheduleEmail = (
  email: StrictOmit<EmailSchedulerSchema, "from" | "id">
) => void;

export default function SchedulerProvider({ children }: ChildrenProps) {
  const user = useAuth();
  const [emails, setEmails] = useState<EmailSchedulerSchema[]>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      for (const email of emails) {
        if (email.sendAt < Date.now()) return;
        await mail(email.from, email.to, email.subject, email.html);
        setEmails((prev) => prev.filter((p) => p.id !== email.id));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [emails]);

  useEffectOnce(() => {
    const schedule = localStorage.getItem(SCHEDULE) ?? "";
    if (schedule.length === 0) return;
    const emails = JSON.parse(schedule) as EmailSchedulerSchema[];
    setEmails(emails);
  });

  useUpdateEffect(() => {
    localStorage.setItem(SCHEDULE, JSON.stringify(emails));
  }, [emails]);

  const scheduleEmail = useCallback<ScheduleEmail>(
    (email) => {
      setEmails((prev) => [
        ...prev,
        { ...email, from: user!.email, id: Date.now() },
      ]);
    },
    [user]
  );

  return (
    <SchedulerContext.Provider value={{ scheduleEmail }}>
      {children}
    </SchedulerContext.Provider>
  );
}

export const useScheduler = () => useContext(SchedulerContext)!;

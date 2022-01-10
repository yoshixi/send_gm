import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { MessageTemplate, User } from "@/models";
import { useEffect, useState } from "react";
import { useAuthentication } from "@/hooks/authentication";

const db = getFirestore();

export const createTemplate = async (
  userId: string,
  messageTemplate: MessageTemplate
) => {
  return await addDoc(
    collection(db, "users", userId, "message_templates"),
    messageTemplate
  );
};

export const getTemplates = async (
  userId: string
): Promise<MessageTemplate[]> => {
  const templatesQuery = query(
    collection(db, "users", userId, "message_templates")
  );
  const docs = await getDocs(templatesQuery);
  const result: MessageTemplate[] = [];
  docs.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() } as MessageTemplate);
  });
  return result;
};

export const useMessageTemplates = () => {
  const { currentUser } = useAuthentication();
  const [messageTemplates, setMessageTemplates] = useState<
    Array<MessageTemplate>
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.uid) {
        const result = await getTemplates(currentUser.uid);
        setMessageTemplates(result);
      }
    };

    fetchData();
  }, [currentUser]);

  return {
    messageTemplates,
  };
};

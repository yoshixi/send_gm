import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  getDoc,
  query,
  doc,
  setDoc,
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

export const setTemplate = async (
  userId: string,
  messageTemplateId: string,
  messageTemplate: MessageTemplate
) => {
  return await setDoc(
    doc(db, "users", userId, "message_templates", messageTemplateId),
    messageTemplate
  );
};

const getTemplates = async (userId: string): Promise<MessageTemplate[]> => {
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

const getTemplate = async (
  userId: string,
  messageTemplateId: string
): Promise<MessageTemplate> => {
  const docRef = doc(
    db,
    "users",
    userId,
    "message_templates",
    messageTemplateId
  );
  const docSnap = await getDoc(docRef);
  const template = { id: docSnap.id, ...docSnap.data() } as MessageTemplate;
  return template;
};

export const useMessageTemplates = () => {
  const { currentUser } = useAuthentication();
  const [messageTemplates, setMessageTemplates] = useState<
    Array<MessageTemplate>
  >([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplate | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.uid) {
        const result = await getTemplates(currentUser.uid);
        setMessageTemplates(result);
        setSelectedTemplate(result[0]);
      }
    };

    fetchData();
  }, [currentUser]);

  return {
    messageTemplates,
    selectedTemplate,
    setSelectedTemplate,
  };
};

export const useMessageTemplate = (messageTemplateId: string) => {
  const { currentUser } = useAuthentication();
  const [messageTemplate, setMessageTemplate] =
    useState<MessageTemplate | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.uid) {
        const result = await getTemplate(currentUser.uid, messageTemplateId);
        setMessageTemplate(result);
      }
    };

    fetchData();
  }, [currentUser, messageTemplateId]);

  const updateTemplate = (template: MessageTemplate) => {
    if (!currentUser?.uid) return Promise.resolve(alert("not login"));

    return setTemplate(currentUser?.uid, messageTemplateId, template);
  };

  return {
    messageTemplate,
    setMessageTemplate,
    updateTemplate,
  };
};

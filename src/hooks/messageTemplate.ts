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
const REPLACE_ARG1_STRING = "*|MERGE1|*";
const REPLACE_ARG2_STRING = "*|MERGE2|*";
const REPLACE_NAME_STRING = "*|NAME|*";
const REPLACE_TO_EMAIL_STRING = "*|TO_EMAIL|*";

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

type ReplaceMessageTagsParams = {
  message: string;
  to: string;
  toName: string;
  arg1: string;
  arg2: string;
};

const replaceMessageTags = (params: ReplaceMessageTagsParams): string => {
  const { to, toName, message, arg1, arg2 } = params;

  return message
    .replace(REPLACE_ARG1_STRING, arg1)
    .replace(REPLACE_ARG2_STRING, arg2)
    .replace(REPLACE_NAME_STRING, toName)
    .replace(REPLACE_TO_EMAIL_STRING, to);
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

  const replaceSelectedTemplateMessageTags = (
    params: Pick<ReplaceMessageTagsParams, "to" | "toName" | "arg1" | "arg2">
  ): string => {
    if (!selectedTemplate) {
      console.log("template is not selected");
      return "";
    }

    return replaceMessageTags({ ...params, message: selectedTemplate.message });
  };

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
    replaceSelectedTemplateMessageTags,
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
    replaceMessageTags,
  };
};

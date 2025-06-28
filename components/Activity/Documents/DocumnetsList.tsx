import { Loading } from "@/components/common/LoadingScreen";
import SwipeDelete from "@/components/common/SwipeDelete";
import { useTheme } from "@/context/ThemeContext";
import {
  useDeleteDocumentMutation,
  useGetUserDocumentsQuery,
} from "@/redux/api/endpoints/documentApiSlice";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Documents from "./Documents";

const DocumnetsList = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { data: documents, isLoading } = useGetUserDocumentsQuery();
  const [deleteDocument, { isLoading: isDeleting }] =
    useDeleteDocumentMutation();

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId).unwrap();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  if (documents?.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text }}>
          {t('afterUploadingDocument')}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {(isLoading || isDeleting) && <Loading />}
      {documents?.map((document) => (
        <SwipeDelete
          handleDelete={() => handleDelete(document._id)}
          key={document._id}>
          <Documents
            _id={document._id}
            title={document.title}
            documentType={document.title}
            uploadedDate={document.updatedAt}
            deadline={document.info.deadline}
            description={document.info.description}
            expirationDate={document.info.expirationDate}
            status={document.info.status}
          />
        </SwipeDelete>
      ))}
    </View>
  );
};

export default DocumnetsList;

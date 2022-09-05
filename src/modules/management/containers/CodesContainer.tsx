import * as React from "react";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Codes } from "../components/Codes";
import { ManagementService } from "../services/management-service";

export const CodesContainer: FC = () => {
  const managementService = new ManagementService();

  const [title, setTitle] = useState<string>("");
  const [codes, setCodes] = useState<Array<string>>([]);
  const { electionId } = useParams<{ electionId: string }>();

  useEffect(() => {
    managementService.getCodes(electionId).then((res) => {
      setTitle(res.title);
      setCodes(res.codes);
    });
  }, [electionId]);

  return <Codes codes={codes} title={title} />;
};

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { BsCodeSlash } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AuditTypeModal = (props: Props) => {
  const router = useRouter();
  return (
    <Modal size="sm" isOpen={props.isOpen} onClose={props.onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Choose the type of Audit Input
            </ModalHeader>
            <ModalBody className="flex text-center justify-center items-center pb-4">
              <Button
                className="w-[240px] hover:bg-[#5191d4] font-[400]"
                onPress={() => {
                  router.push("/codeAudit");
                  onClose();
                }}
              >
                <BsCodeSlash />
                Contract Code Auditor
              </Button>
              <p>or</p>
              <Button
                className="w-[240px] hover:bg-[#5191d4] font-[400]"
                onPress={() => {
                  router.push("/addressAudit");
                  onClose();
                }}
              >
                <FaRegAddressCard />
                Contract Address Auditor
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AuditTypeModal;

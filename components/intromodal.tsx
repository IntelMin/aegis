import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export default function IntroModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    // You can set a timeout to close the modal after a certain period
    const timeout = setTimeout(() => {
      onOpen();
    }, 5000); // Close the modal after 5 seconds

    return () => clearTimeout(timeout);
  }, [onOpen]);
  return (
    <>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent className=" ">
          {(onClose) => (
            <>
              <ModalHeader className="flex  gap-1">
                Welcome To <b>Aegis Ai</b>
              </ModalHeader>
              <ModalBody>
                <p>
                  Welcome to AegisAI, your all-in-one platform for comprehensive
                  security solutions. AegisAI offers live monitoring, providing
                  real-time insights into your system's security.
                </p>
                <p>
                  Elevate your security posture with our Security Score feature,
                  giving you a percentile ranking and ensuring you stay in the
                  top tier of security practices.
                </p>
                <p>
                  Additionally, leverage our Code and Token Audit tools to
                  ensure the integrity of your codebase and manage your access
                  tokens securely. AegisAI is here to empower you with robust
                  security measures.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button className="border-1 border-white" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

import { JSX, useCallback, useMemo, useState } from "react"
import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function useEditorModal(): [
  JSX.Element | null,
  (title: string, showModal: (onClose: () => void) => JSX.Element) => void,
] {
  const [modalContent, setModalContent] = useState<null | {
    closeOnClickOutside: boolean
    content: JSX.Element
    title: string
  }>(null)

  const onClose = useCallback(() => {
    setModalContent(null)
  }, [])

  const modal = useMemo(() => {
    if (modalContent === null) {
      return null
    }
    const { title, content } = modalContent
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Use the dialog content below to configure your settings.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }, [modalContent, onClose])

  const showModal = useCallback(
    (
      title: string,
      getContent: (onClose: () => void) => JSX.Element,
      closeOnClickOutside = false
    ) => {
      setModalContent({
        closeOnClickOutside,
        content: getContent(onClose),
        title,
      })
    },
    [onClose]
  )

  return [modal, showModal]
}

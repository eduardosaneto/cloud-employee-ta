'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@heroui/react'
import { ProspectWithQualification } from '../../dashboard/page'
import { useState } from 'react'
import { Database } from '@/lib/supabase/database.types'

type Qualification = Database['public']['Tables']['qualifications']['Row']
type Prospect = Database['public']['Tables']['prospects']['Row']

function getLatestQualification(
  p: ProspectWithQualification
): Qualification | null {
  if (!p.qualifications || p.qualifications.length === 0) return null
  return p.qualifications.sort((a, b) => {
    if (a?.generated_at && b?.generated_at) {
      return (
        new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()
      )
    }
    return a?.generated_at ? -1 : 1
  })[0]
}

export default function ProspectList({
  prospects,
}: {
  prospects: ProspectWithQualification[]
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selected, setSelected] = useState<
    (Qualification & { prospect: Prospect }) | null
  >(null)

  const handleOpenModal = (qual: Qualification, prospect: Prospect) => {
    setSelected({ ...qual, prospect })
    onOpen()
  }

  const renderCell = (
    prospect: ProspectWithQualification,
    columnKey: React.Key
  ) => {
    const qual = getLatestQualification(prospect)
    const status = qual?.status || 'unknown'

    switch (columnKey) {
      case 'domain':
        return <p className='font-medium'>{prospect.domain}</p>
      case 'status':
        return (
          <Chip
            color={
              status === 'completed'
                ? 'success'
                : status === 'pending'
                  ? 'warning'
                  : 'danger'
            }
            variant={status === 'completed' ? 'flat' : 'light'}
            size='sm'
          >
            {status}
          </Chip>
        )
      case 'score':
        if (status === 'completed' && qual?.score != null) {
          const scoreColor =
            qual.score >= 75
              ? 'text-success-600'
              : qual.score >= 50
                ? 'text-warning-600'
                : 'text-danger-600'
          return (
            <span className={`font-bold ${scoreColor}`}>
              {qual.score} / 100
            </span>
          )
        }
        return <span className='text-default-400'>N/A</span>
      case 'actions':
        return (
          <div className='text-right'>
            <Button
              variant='light'
              size='sm'
              isDisabled={status !== 'completed' || !qual}
              onPress={() => handleOpenModal(qual!, prospect)}
            >
              View Reasoning
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Table aria-label='Prospects List'>
        <TableHeader>
          <TableColumn key='domain'>Domain</TableColumn>
          <TableColumn key='status'>Status</TableColumn>
          <TableColumn key='score'>Score</TableColumn>
          <TableColumn key='actions' className='text-right'>
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody
          items={prospects}
          emptyContent="You haven't qualified any prospects yet."
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Reasoning Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <h2 className='text-xl font-semibold'>
                  Qualification for {selected?.prospect.domain}
                </h2>
              </ModalHeader>
              <ModalBody>
                <div className='pb-4'>
                  <span
                    className={`text-3xl font-bold ${
                      selected?.score && selected.score >= 75
                        ? 'text-success-600'
                        : selected?.score && selected.score >= 50
                          ? 'text-warning-600'
                          : 'text-danger-600'
                    }`}
                  >
                    {selected?.score} / 100
                  </span>
                  <p className='text-default-700 mt-4 text-base'>
                    {selected?.reasoning}
                  </p>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

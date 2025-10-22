'use client'

import { Card, CardBody, CardHeader } from '@heroui/react'
import QualificationForm from './QualificationForm'
import IcpDisplay from './IcpDisplay'
import ProspectList from './ProspectList'
import {
  IcpWithPersonas,
  ProspectWithQualification,
} from '@/app/dashboard/page'

type DashboardClientUIProps = {
  icp: IcpWithPersonas
  prospects: ProspectWithQualification[]
}

export default function Dashboard({ icp, prospects }: DashboardClientUIProps) {
  return (
    <section className='flex flex-col gap-8'>
      <IcpDisplay icp={icp} />
      <Card>
        <CardHeader>
          <h2 className='text-xl font-semibold'>Qualify New Prospects</h2>
          <p className='text-default-500'>
            Enter a list of comma-separated domains to qualify against your ICP.
          </p>
        </CardHeader>
        <CardBody>
          <QualificationForm icpId={icp.id} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h2 className='text-xl font-semibold'>Qualification History</h2>
        </CardHeader>
        <CardBody>
          <ProspectList prospects={prospects} />
        </CardBody>
      </Card>
    </section>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react'
import { IcpWithPersonas } from '../../dashboard/page'

function DetailList({
  title,
  items,
}: {
  title: string
  items: string[] | null
}) {
  if (!items || items.length === 0) return null
  return (
    <div className='mb-4'>
      <h4 className='text-default-500 mb-2 text-sm font-semibold uppercase'>
        {title}
      </h4>
      <div className='flex flex-wrap gap-2'>
        {items.map((item) => (
          <Chip key={item} color='default' variant='flat'>
            {item}
          </Chip>
        ))}
      </div>
    </div>
  )
}

export default function IcpDisplay({ icp }: { icp: IcpWithPersonas }) {
  return (
    <Card>
      <CardHeader className="flex flex-col">
        <h2 className='text-xl font-semibold'>
          {icp.title || 'Ideal Customer Profile'}
        </h2>
        <p className='text-default-500 text-sm'>
          {icp.description || 'No description provided.'}
        </p>
      </CardHeader>
      <CardBody>
        <DetailList title='Industries' items={icp.industries} />
        <DetailList title='Company Size' items={icp.company_size} />
        <DetailList title='Revenue Range' items={icp.revenue_range} />
        <DetailList title='Geographic Regions' items={icp.geographic_regions} />
        <DetailList title='Funding Stages' items={icp.funding_stages} />

        <Divider className='my-4' />

        <h3 className='mb-3 text-lg font-semibold'>Buyer Personas</h3>
        <div className='space-y-4'>
          {icp.buyer_personas.length > 0 ? (
            icp.buyer_personas.map((persona: any) => (
              <Card key={persona.id} shadow='none' className='bg-default-50'>
                <CardHeader className='flex-col items-start pt-3 pb-0'>
                  <h4 className='text-base font-bold'>{persona.role}</h4>
                  <p className='text-default-500 text-xs font-bold uppercase'>
                    {persona.department}
                  </p>
                </CardHeader>
                <CardBody className='pt-2'>
                  <h5 className='mb-1 text-xs font-medium'>Pain Points:</h5>
                  <ul className='text-default-700 list-inside list-disc text-sm'>
                    {persona.pain_points?.map((pain: any) => (
                      <li key={pain}>{pain}</li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            ))
          ) : (
            <p className='text-default-500 text-sm'>
              No buyer personas defined.
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

"use client";

import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { IcpWithPersonas } from "../../dashboard/page";

function DetailList({
  title,
  items,
}: {
  title: string;
  items: string[] | null;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-2 text-sm uppercase text-default-500">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Chip key={item} color="default" variant="flat">
            {item}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export default function IcpDisplay({ icp }: { icp: IcpWithPersonas }) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <h2 className="text-xl font-semibold">
          {icp.title || "Ideal Customer Profile"}
        </h2>
        <p className="text-default-500 text-sm">
          {icp.description || "No description provided."}
        </p>
      </CardHeader>
      <CardBody>
        <DetailList title="Industries" items={icp.industries} />
        <DetailList title="Company Size" items={icp.company_size} />
        <DetailList title="Revenue Range" items={icp.revenue_range} />
        <DetailList title="Geographic Regions" items={icp.geographic_regions} />
        <DetailList title="Funding Stages" items={icp.funding_stages} />

        <Divider className="my-4" />

        <h3 className="font-semibold text-lg mb-3">Buyer Personas</h3>
        <div className="space-y-4">
          {icp.buyer_personas.length > 0 ? (
            icp.buyer_personas.map((persona: any) => (
              <Card key={persona.id} shadow="none" className="bg-default-50">
                <CardHeader className="pb-0 pt-3 flex-col items-start">
                  <h4 className="font-bold text-base">{persona.role}</h4>
                  <p className="text-xs uppercase font-bold text-default-500">
                    {persona.department}
                  </p>
                </CardHeader>
                <CardBody className="pt-2">
                  <h5 className="font-medium text-xs mb-1">Pain Points:</h5>
                  <ul className="list-disc list-inside text-sm text-default-700">
                    {persona.pain_points?.map((pain: any) => (
                      <li key={pain}>{pain}</li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            ))
          ) : (
            <p className="text-sm text-default-500">
              No buyer personas defined.
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

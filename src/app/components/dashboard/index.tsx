"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import QualificationForm from "./QualificationForm";
import IcpDisplay from "./IcpDisplay";
import ProspectList from "./ProspectList";
import {
  IcpWithPersonas,
  ProspectWithQualification,
} from "@/app/dashboard/page";

type DashboardClientUIProps = {
  icp: IcpWithPersonas;
  prospects: ProspectWithQualification[];
};

export default function Dashboard({ icp, prospects }: DashboardClientUIProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Qualify New Prospects</h2>
            <p className="text-default-500">
              Enter a list of comma-separated domains to qualify.
            </p>
          </CardHeader>
          <CardBody>
            <QualificationForm icpId={icp.id} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Qualification History</h2>
          </CardHeader>
          <CardBody>
            <ProspectList prospects={prospects} />
          </CardBody>
        </Card>
      </div>
      <div className="md:col-span-1 space-y-6">
        <IcpDisplay icp={icp} />
      </div>
    </div>
  );
}

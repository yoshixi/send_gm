import * as React from "react";
import type { ReactElement } from "react";

import DashboardLayout from "@/components/layouts/Dashboard";

export default function Index() {
  return <p>aaaaa</p>;
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
